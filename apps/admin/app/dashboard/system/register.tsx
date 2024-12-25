'use client';

import { getRegisterConfig, updateRegisterConfig } from '@/services/admin/system';
import { EnhancedInput } from '@repo/ui/enhanced-input';
import { Label } from '@shadcn/ui/label';
import { toast } from '@shadcn/ui/lib/sonner';
import { Switch } from '@shadcn/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@shadcn/ui/table';
import { Textarea } from '@shadcn/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function Register() {
  const t = useTranslations('system.register');

  const { data, refetch } = useQuery({
    queryKey: ['getRegisterConfig'],
    queryFn: async () => {
      const { data } = await getRegisterConfig();

      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateRegisterConfig({
        ...data,
        [key]: value,
      } as API.RegisterConfig);
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
            <Label>{t('stopNewUserRegistration')}</Label>
            <p className='text-muted-foreground text-xs'>
              {t('stopNewUserRegistrationDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.stop_register}
              onCheckedChange={(checked) => {
                updateConfig('stop_register', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('emailVerification')}</Label>
            <p className='text-muted-foreground text-xs'>{t('emailVerificationDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.enable_email_verify}
              onCheckedChange={(checked) => {
                updateConfig('enable_email_verify', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('emailSuffixWhitelist')}</Label>
            <p className='text-muted-foreground text-xs'>{t('emailSuffixWhitelistDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.enable_email_domain_suffix}
              onCheckedChange={(checked) => {
                updateConfig('enable_email_domain_suffix', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='align-top'>
            <Label>{t('whitelistSuffixes')}</Label>
            <p className='text-muted-foreground text-xs'>{t('whitelistSuffixesDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Textarea
              className='h-52'
              placeholder={t('whitelistSuffixesPlaceholder')}
              defaultValue={data?.email_domain_suffix_list}
              onBlur={(e) => {
                updateConfig('email_domain_suffix_list', e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('ipRegistrationLimit')}</Label>
            <p className='text-muted-foreground text-xs'>{t('ipRegistrationLimitDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.enable_ip_register_limit}
              onCheckedChange={(checked) => {
                updateConfig('enable_ip_register_limit', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('registrationLimitCount')}</Label>
            <p className='text-muted-foreground text-xs'>
              {t('registrationLimitCountDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              type='number'
              min={0}
              value={data?.ip_register_limit}
              onValueBlur={(value) => updateConfig('ip_register_limit', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('penaltyTime')}</Label>
            <p className='text-muted-foreground text-xs'>{t('penaltyTimeDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              type='number'
              min={0}
              value={data?.ip_register_limit_duration}
              onValueBlur={(value) => updateConfig('ip_register_limit_duration', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('trialRegistration')}</Label>
            <p className='text-muted-foreground text-xs'>{t('trialRegistrationDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.enable_trial}
              onCheckedChange={(checked) => {
                updateConfig('enable_trial', checked);
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
