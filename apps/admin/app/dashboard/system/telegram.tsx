'use client';

import { getTelegramConfig, updateTelegramConfig } from '@/services/admin/system';
import { EnhancedInput } from '@repo/ui/enhanced-input';
import { Label } from '@shadcn/ui/label';
import { toast } from '@shadcn/ui/lib/sonner';
import { Switch } from '@shadcn/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@shadcn/ui/table';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function Telegram() {
  const t = useTranslations('system.telegram');

  const { data, refetch } = useQuery({
    queryKey: ['getTelegramConfig'],
    queryFn: async () => {
      const { data } = await getTelegramConfig();

      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateTelegramConfig({
        ...data,
        [key]: value,
      } as API.TelegramConfig);
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {
      /* empty */
    }
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Label>{t('webhookDomain')}</Label>
            <p className='text-muted-foreground text-xs'>{t('webhookDomainDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholderWebhookDomain')}
              value={data?.telegram_web_hook_domain}
              onValueBlur={(value) => updateConfig('telegram_web_hook_domain', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('botToken')}</Label>
            <p className='text-muted-foreground text-xs'>{t('botTokenDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholderBotToken')}
              value={data?.telegram_bot_token}
              onValueBlur={(value) => updateConfig('telegram_bot_token', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('enableBotNotifications')}</Label>
            <p className='text-muted-foreground text-xs'>
              {t('enableBotNotificationsDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.telegram_notify}
              onCheckedChange={(checked) => {
                updateConfig('telegram_notify', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('groupURL')}</Label>
            <p className='text-muted-foreground text-xs'>{t('groupURLDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholderGroupURL')}
              value={data?.telegram_group_url}
              onValueBlur={(value) => updateConfig('telegram_group_url', value)}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
