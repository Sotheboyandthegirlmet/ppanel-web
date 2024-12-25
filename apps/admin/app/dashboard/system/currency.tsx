'use client';

import { getCurrencyConfig, updateCurrencyConfig } from '@/services/admin/system';
import { EnhancedInput } from '@repo/ui/enhanced-input';
import { Label } from '@shadcn/ui/label';
import { toast } from '@shadcn/ui/lib/sonner';
import { Table, TableBody, TableCell, TableRow } from '@shadcn/ui/table';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function Site() {
  const t = useTranslations('system.currency');

  const { data, refetch } = useQuery({
    queryKey: ['getCurrencyConfig'],
    queryFn: async () => {
      const { data } = await getCurrencyConfig();
      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateCurrencyConfig({
        ...data,
        [key]: value,
      } as API.CurrencyConfig);
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
            <Label>{t('accessKey')}</Label>
            <p className='text-muted-foreground text-xs'>{t('accessKeyDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              value={data?.access_key}
              onValueBlur={(value) => updateConfig('access_key', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('currencyUnit')}</Label>
            <p className='text-muted-foreground text-xs'>{t('currencyUnitDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder='USD'
              value={data?.currency_unit}
              onValueBlur={(value) => updateConfig('currency_unit', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('currencySymbol')}</Label>
            <p className='text-muted-foreground text-xs'>{t('currencySymbolDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder='$'
              value={data?.currency_symbol}
              onValueBlur={(value) => updateConfig('currency_symbol', value)}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
