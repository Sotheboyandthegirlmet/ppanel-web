'use client';

import useGlobalStore from '@/config/use-global';
import { bindTelegram, unbindTelegram, updateUserNotifySetting } from '@/services/user/user';
import { Button } from '@shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shadcn/ui/form';
import { Input } from '@shadcn/ui/input';
import { useForm } from '@shadcn/ui/lib/react-hook-form';
import { toast } from '@shadcn/ui/lib/sonner';
import { z, zodResolver } from '@shadcn/ui/lib/zod';
import { Switch } from '@shadcn/ui/switch';
import { useTranslations } from 'next-intl';

const FormSchema = z.object({
  telegram: z.number().nullish(),
  enable_email_notify: z.boolean(),
  enable_telegram_notify: z.boolean(),
});

export default function NotifySettings() {
  const t = useTranslations('profile.notify');
  const { user, getUserInfo } = useGlobalStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      telegram: user?.telegram,
      enable_email_notify: user?.enable_email_notify,
      enable_telegram_notify: user?.enable_telegram_notify,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await updateUserNotifySetting(data as API.UpdateUserNotifySettingRequet);
    toast.success(t('updateSuccess'));
  }

  return (
    <Card>
      <CardHeader className='bg-muted/50 flex flex-row items-start'>
        <CardTitle>{t('notificationSettings')}</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-4 p-6 text-sm'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
            <FormField
              control={form.control}
              name='telegram'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('telegramId')}</FormLabel>
                  <FormControl>
                    <div className='flex w-full items-center space-x-2'>
                      <Input
                        type='number'
                        placeholder={t('telegramIdPlaceholder')}
                        {...field}
                        value={field.value ? field.value : ''}
                        onChange={(e) => {
                          field.onChange(e.target.value ? Number(e.target.value) : '');
                        }}
                        disabled
                      />
                      <Button
                        size='sm'
                        type='button'
                        onClick={async () => {
                          if (user?.telegram) {
                            await unbindTelegram();
                            await getUserInfo();
                          } else {
                            const { data } = await bindTelegram();
                            data.data?.url && window.open(data.data.url, '_blank');
                          }
                        }}
                      >
                        {t(user?.telegram ? 'unbind' : 'bind')}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='enable_email_notify'
              render={({ field }) => (
                <FormItem className='text-muted-foreground flex items-center justify-between'>
                  <FormLabel>{t('emailNotification')}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='enable_telegram_notify'
              render={({ field }) => (
                <FormItem className='text-muted-foreground flex items-center justify-between'>
                  <FormLabel>{t('telegramNotification')}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
