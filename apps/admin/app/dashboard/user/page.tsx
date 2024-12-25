'use client';

import { ProTable, ProTableActions } from '@/components/pro-table';
import { createUser, deleteUser, getUserList, updateUser } from '@/services/admin/user';
import { ConfirmButton } from '@repo/ui/confirm-button';
import { formatDate, unitConversion } from '@repo/ui/utils';
import { Button } from '@shadcn/ui/button';
import { toast } from '@shadcn/ui/lib/sonner';
import { Switch } from '@shadcn/ui/switch';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { UserDetail } from './user-detail';
import UserForm from './user-form';

export default function Page() {
  const t = useTranslations('user');
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  return (
    <ProTable<API.User, any>
      action={ref}
      header={{
        title: t('userList'),
        toolbar: (
          <UserForm<API.CreateUserRequest>
            key='create'
            trigger={t('create')}
            title={t('createUser')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createUser(values);
                toast.success(t('createSuccess'));
                ref.current?.refresh();
                setLoading(false);

                return true;
              } catch (error) {
                setLoading(false);

                return false;
              }
            }}
          />
        ),
      }}
      columns={[
        {
          accessorKey: 'enable',
          header: t('enable'),
          cell: ({ row }) => {
            return (
              <Switch
                defaultChecked={row.getValue('enable')}
                onCheckedChange={async (checked) => {
                  await updateUser({
                    ...row.original,
                    enable: checked,
                  } as unknown as API.UpdateUserRequest);
                  toast.success(t('updateSuccess'));
                  ref.current?.refresh();
                }}
              />
            );
          },
        },
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          accessorKey: 'email',
          header: t('userName'),
        },
        {
          accessorKey: 'balance',
          header: t('balance'),
          cell: ({ row }) => unitConversion('centsToDollars', row.getValue('balance')),
        },
        {
          accessorKey: 'referer_id',
          header: t('referer'),
          cell: ({ row }) => <UserDetail id={row.original.referer_id} />,
        },
        {
          accessorKey: 'created_at',
          header: t('createdAt'),
          cell: ({ row }) => formatDate(row.getValue('created_at')),
        },
      ]}
      request={async (pagination) => {
        const { data } = await getUserList(pagination);
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
      actions={{
        render: (row) => {
          return [
            <UserForm<API.UpdateUserRequest>
              key='edit'
              trigger={t('edit')}
              title={t('editUser')}
              loading={loading}
              initialValues={row as unknown as API.UpdateUserRequest}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await updateUser({
                    ...row,
                    ...values,
                  });
                  toast.success(t('updateSuccess'));
                  ref.current?.refresh();
                  setLoading(false);

                  return true;
                } catch (error) {
                  setLoading(false);

                  return false;
                }
              }}
            />,
            <ConfirmButton
              key='edit'
              trigger={<Button variant='destructive'>{t('delete')}</Button>}
              title={t('confirmDelete')}
              description={t('deleteDescription')}
              onConfirm={async () => {
                await deleteUser({ id: row.id });
                toast.success(t('deleteSuccess'));
                ref.current?.refresh();
              }}
              cancelText={t('cancel')}
              confirmText={t('confirm')}
            />,
          ];
        },
      }}
    />
  );
}
