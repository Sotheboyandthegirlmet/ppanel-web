'use client';

import { getEmailSmtpConfig, testEmailSmtp, updateEmailSmtpConfig } from '@/services/admin/system';
import { HTMLEditor } from '@repo/ui/editor';
import { EnhancedInput } from '@repo/ui/enhanced-input';
import { Button } from '@shadcn/ui/button';
import { Label } from '@shadcn/ui/label';
import { toast } from '@shadcn/ui/lib/sonner';
import { Switch } from '@shadcn/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@shadcn/ui/table';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Email() {
  const t = useTranslations('system.email');

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['getEmailSmtpConfig'],
    queryFn: async () => {
      const { data } = await getEmailSmtpConfig();
      return data.data;
    },
  });

  const [email, setEmail] = useState<string>();

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateEmailSmtpConfig({
        ...data,
        [key]: value,
      } as API.EmailSmtpConfig);
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {
      /* empty */
    }
  }

  return (
    <>
      <Table>
        <TableBody>
          {[
            {
              key: 'email_smtp_host',
              label: t('smtpServerAddress'),
              description: t('smtpServerAddressDescription'),
            },
            {
              key: 'email_smtp_port',
              label: t('smtpServerPort'),
              description: t('smtpServerPortDescription'),
              type: 'number',
            },
            {
              key: 'email_smtp_ssl',
              label: t('smtpEncryptionMethod'),
              description: t('smtpEncryptionMethodDescription'),
              component: 'switch',
            },
            {
              key: 'email_smtp_user',
              label: t('smtpAccount'),
              description: t('smtpAccountDescription'),
            },
            {
              key: 'email_smtp_pass',
              label: t('smtpPassword'),
              description: t('smtpPasswordDescription'),
              type: 'password',
            },
            {
              key: 'email_smtp_from',
              label: t('senderAddress'),
              description: t('senderAddressDescription'),
            },
          ].map(({ key, label, description, type = 'text', component = 'input' }) => (
            <TableRow key={key}>
              <TableCell>
                <Label>{label}</Label>
                <p className='text-muted-foreground text-xs'>{description}</p>
              </TableCell>
              <TableCell className='text-right'>
                {component === 'input' ? (
                  <EnhancedInput
                    placeholder={t('inputPlaceholder')}
                    value={data?.[key]}
                    type={type}
                    onValueBlur={(value) => updateConfig(key, value)}
                  />
                ) : (
                  <Switch
                    checked={data?.[key]}
                    onCheckedChange={(checked) => updateConfig(key, checked)}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Label>{t('sendTestEmail')}</Label>
              <p className='text-muted-foreground text-xs'>{t('sendTestEmailDescription')}</p>
            </TableCell>
            <TableCell className='flex items-center gap-2 text-right'>
              <EnhancedInput
                placeholder={t('inputPlaceholder')}
                value={email}
                onValueChange={(value) => setEmail(value as string)}
              />
              <Button
                disabled={!email}
                onClick={async () => {
                  if (isFetching || !email) return;
                  try {
                    await testEmailSmtp({ email });
                    toast.success(t('sendSuccess'));
                  } catch {
                    toast.error(t('sendFailure'));
                  }
                }}
              >
                {t('sendTestEmail')}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className='grid grid-cols-1 gap-4 py-4 md:grid-cols-3'>
        {['verify_email_template', 'expiration_email_template', 'maintenance_email_template'].map(
          (templateKey) => (
            <HTMLEditor
              key={templateKey}
              title={t(`${templateKey}`)}
              description={t(`${templateKey}Description`, { after: '{{', before: '}}' })}
              placeholder={t('inputPlaceholder')}
              value={data?.[templateKey]}
              onBlur={(value) => {
                updateConfig(templateKey, value);
              }}
            />
          ),
        )}
      </div>
    </>
  );
}
