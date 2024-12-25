'use client';

import { getAlipayF2FPaymentConfig, updateAlipayF2FPaymentConfig } from '@/services/admin/payment';
import { EnhancedInput } from '@repo/ui/enhanced-input';
import { unitConversion } from '@repo/ui/utils';
import { Label } from '@shadcn/ui/label';
import { toast } from '@shadcn/ui/lib/sonner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/ui/select';
import { Switch } from '@shadcn/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@shadcn/ui/table';
import { Textarea } from '@shadcn/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function AlipayF2F() {
  const t = useTranslations('payment');

  const { data, refetch } = useQuery({
    queryKey: ['getAlipayF2FPaymentConfig'],
    queryFn: async () => {
      const { data } = await getAlipayF2FPaymentConfig();

      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateAlipayF2FPaymentConfig({
        ...data,
        [key]: value,
      } as API.UpdateAlipayF2fRequest);
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
            <Label>{t('enable')}</Label>
            <p className='text-muted-foreground text-xs'>{t('enableDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.enable}
              onCheckedChange={(checked) => {
                updateConfig('enable', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('alipayf2f.sandbox')}</Label>
            <p className='text-muted-foreground text-xs'>{t('alipayf2f.sandboxDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.config.sandbox}
              onCheckedChange={(checked) => {
                updateConfig('config', {
                  ...data?.config,
                  sandbox: checked,
                });
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('showName')}</Label>
            <p className='text-muted-foreground text-xs'>{t('showNameDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              value={data?.name}
              onValueBlur={(value) => updateConfig('name', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('iconUrl')}</Label>
            <p className='text-muted-foreground text-xs'>{t('iconUrlDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              value={data?.icon_url}
              onValueBlur={(value) => updateConfig('icon', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('notifyUrl')}</Label>
            <p className='text-muted-foreground text-xs'>{t('notifyUrlDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              value={data?.domain}
              onValueBlur={(value) => updateConfig('domain', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('feeMode')}</Label>
            <p className='text-muted-foreground text-xs'>{t('feeModeDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Select
              value={String(data?.fee_mode)}
              onValueChange={(value) => {
                updateConfig('fee_mode', Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='请选择' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='0'>{t('feeModeItems.0')}</SelectItem>
                  <SelectItem value='1'>{t('feeModeItems.1')}</SelectItem>
                  <SelectItem value='2'>{t('feeModeItems.2')}</SelectItem>
                  <SelectItem value='3'>{t('feeModeItems.3')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('feePercent')}</Label>
            <p className='text-muted-foreground text-xs'>{t('feePercentDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              type='number'
              min={0}
              max={100}
              maxLength={3}
              value={data?.fee_percent}
              onValueBlur={(value) => updateConfig('fee_percent', value)}
              suffix='%'
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('fixedFee')}</Label>
            <p className='text-muted-foreground text-xs'>{t('fixedFeeDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              min={0}
              value={data?.fee_amount}
              formatInput={(value) => unitConversion('centsToDollars', value)}
              formatOutput={(value) => unitConversion('dollarsToCents', value)}
              onValueBlur={(value) => updateConfig('fee_amount', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('alipayf2f.appId')}</Label>
            <p className='text-muted-foreground text-xs' />
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              value={data?.config.app_id}
              onValueBlur={(value) =>
                updateConfig('config', {
                  ...data?.config,
                  app_id: value,
                })
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('alipayf2f.privateKey')}</Label>
            <p className='text-muted-foreground text-xs' />
          </TableCell>
          <TableCell className='text-right'>
            <Textarea
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.config.private_key}
              onBlur={(e) => {
                updateConfig('config', {
                  ...data?.config,
                  private_key: e.target.value,
                });
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('alipayf2f.publicKey')}</Label>
            <p className='text-muted-foreground text-xs' />
          </TableCell>
          <TableCell className='text-right'>
            <Textarea
              placeholder={t('inputPlaceholder')}
              defaultValue={data?.config.public_key}
              onBlur={(e) => {
                updateConfig('config', {
                  ...data?.config,
                  public_key: e.target.value,
                });
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('alipayf2f.invoiceName')}</Label>
            <p className='text-muted-foreground text-xs' />
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('alipayf2f.invoiceNameDescription')}
              value={data?.config.invoice_name}
              onValueBlur={(value) =>
                updateConfig('config', {
                  ...data?.config,
                  invoice_name: value,
                })
              }
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
