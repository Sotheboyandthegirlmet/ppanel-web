'use client';

import useGlobalStore from '@/config/use-global';
import { checkUser, resetPassword, userLogin, userRegister } from '@/services/common/auth';
import { toast } from '@shadcn/ui/lib/sonner';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ReactNode, useState, useTransition } from 'react';

import {
  NEXT_PUBLIC_DEFAULT_USER_EMAIL,
  NEXT_PUBLIC_DEFAULT_USER_PASSWORD,
} from '@/config/constants';
import { getRedirectUrl, setAuthorization } from '@/utils/common';
import UserCheckForm from './user-check-form';
import UserLoginForm from './user-login-form';
import UserRegisterForm from './user-register-form';
import UserResetForm from './user-reset-form';

export default function UserAuthForm() {
  const t = useTranslations('auth');
  const { common } = useGlobalStore();
  const { register } = common;
  const router = useRouter();
  const [type, setType] = useState<'login' | 'register' | 'reset'>();
  const [loading, startTransition] = useTransition();
  const [initialValues, setInitialValues] = useState<{
    email?: string;
    password?: string;
  }>({
    email: NEXT_PUBLIC_DEFAULT_USER_EMAIL,
    password: NEXT_PUBLIC_DEFAULT_USER_PASSWORD,
  });

  const handleFormSubmit = async (params: any) => {
    const onLogin = async (token?: string) => {
      if (!token) return;
      setAuthorization(token);
      router.replace(getRedirectUrl());
      router.refresh();
    };
    startTransition(async () => {
      try {
        switch (type) {
          case 'login':
            // eslint-disable-next-line no-case-declarations
            const login = await userLogin(params);
            toast.success(t('login.success'));
            onLogin(login.data.data?.token);
            break;
          case 'register':
            // eslint-disable-next-line no-case-declarations
            const create = await userRegister(params);
            toast.success(t('register.success'));
            onLogin(create.data.data?.token);
            break;
          case 'reset':
            await resetPassword(params);
            toast.success(t('reset.success'));
            setType('login');
            break;
          default:
            if (type === 'reset') break;
            // eslint-disable-next-line no-case-declarations
            const response = await checkUser(params);
            setInitialValues({
              ...initialValues,
              ...params,
            });
            setType(response.data.data?.exist ? 'login' : 'register');
            break;
        }
      } catch (error) {
        /* empty */
      }
    });
  };
  let UserForm: ReactNode = null;
  switch (type) {
    case 'login':
      UserForm = (
        <UserLoginForm
          loading={loading}
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          setInitialValues={setInitialValues}
          onSwitchForm={setType}
        />
      );
      break;
    case 'register':
      UserForm = (
        <UserRegisterForm
          loading={loading}
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          setInitialValues={setInitialValues}
          onSwitchForm={setType}
        />
      );
      break;
    case 'reset':
      UserForm = (
        <UserResetForm
          loading={loading}
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          setInitialValues={setInitialValues}
          onSwitchForm={setType}
        />
      );
      break;
    default:
      UserForm = (
        <UserCheckForm
          loading={loading}
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
        />
      );
      break;
  }

  return (
    <>
      <div className='mb-11 text-center'>
        <h1 className='mb-3 text-2xl font-bold'>{t(`${type || 'check'}.title`)}</h1>
        <div className='text-muted-foreground font-medium'>
          {t(`${type || 'check'}.description`)}
        </div>
      </div>
      {/* {!((type === 'register' && register.stop_register) || type === 'reset') && (
        <>
          <div className='mb-3 grid items-center justify-center gap-3 font-bold lg:grid-cols-3'>
            <Button type='button' variant='outline'>
              <Icon icon='uil:telegram' className='mr-2 size-5' />
              Telegram
            </Button>
            <Button type='button' variant='outline'>
              <Icon icon='uil:google' className='mr-2 size-5' />
              Google
            </Button>
            <Button type='button' variant='outline'>
              <Icon icon='uil:apple' className='mr-2 size-5' />
              Apple
            </Button>
          </div>
          <div
            className={cn(
              'my-14 flex h-0 items-center text-center',
              'before:mr-4 before:block before:w-1/2 before:border-b-[1px]',
              'after:ml-4 after:w-1/2 after:border-b-[1px]',
            )}
          >
            <span className='text-muted-foreground w-[125px] text-sm'>{t('orWithEmail')}</span>
          </div>
        </>
      )} */}
      {UserForm}
    </>
  );
}
