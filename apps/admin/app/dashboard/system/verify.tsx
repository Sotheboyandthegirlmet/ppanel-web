'use client';

import { getVerifyConfig, updateVerifyConfig } from '@/services/admin/system';
import { EnhancedInput } from '@repo/ui/enhanced-input';
import { Label } from '@shadcn/ui/label';
import { toast } from '@shadcn/ui/lib/sonner';
import { Switch } from '@shadcn/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@shadcn/ui/table';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function Verify() {
  const t = useTranslations('system.verify');

  const { data, refetch } = useQuery({
    queryKey: ['getVerifyConfig'],
    queryFn: async () => {
      const { data } = await getVerifyConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateVerifyConfig({
        ...data,
        [key]: value,
      } as API.VerifyConfig);
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
            <Label>{t('turnstileSiteKey')}</Label>
            <p className='text-muted-foreground text-xs'>{t('turnstileSiteKeyDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.turnstile_site_key}
              onValueBlur={(value) => updateConfig('turnstile_site_key', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('turnstileSecret')}</Label>
            <p className='text-muted-foreground text-xs'>{t('turnstileSecretDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.turnstile_secret}
              onValueBlur={(value) => updateConfig('turnstile_secret', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('registrationVerificationCode')}</Label>
            <p className='text-muted-foreground text-xs'>
              {t('registrationVerificationCodeDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.enable_register_verify}
              onCheckedChange={(checked) => {
                updateConfig('enable_register_verify', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('loginVerificationCode')}</Label>
            <p className='text-muted-foreground text-xs'>{t('loginVerificationCodeDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.enable_login_verify}
              onCheckedChange={(checked) => {
                updateConfig('enable_login_verify', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('resetPasswordVerificationCode')}</Label>
            <p className='text-muted-foreground text-xs'>
              {t('resetPasswordVerificationCodeDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.enable_reset_password_verify}
              onCheckedChange={(checked) => {
                updateConfig('enable_reset_password_verify', checked);
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
