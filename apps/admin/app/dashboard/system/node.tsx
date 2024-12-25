'use client';

import { getNodeConfig, updateNodeConfig } from '@/services/admin/system';
import { Icon } from '@iconify/react';
import { EnhancedInput } from '@repo/ui/enhanced-input';
import { Label } from '@shadcn/ui/label';
import { toast } from '@shadcn/ui/lib/sonner';
import { Table, TableBody, TableCell, TableRow } from '@shadcn/ui/table';
import { useQuery } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useTranslations } from 'next-intl';

export default function Node() {
  const t = useTranslations('system.node');

  const { data, refetch } = useQuery({
    queryKey: ['getNodeConfig'],
    queryFn: async () => {
      const { data } = await getNodeConfig();

      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateNodeConfig({
        ...data,
        [key]: value,
      } as API.NodeConfig);
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
            <Label>{t('communicationKey')}</Label>
            <p className='text-muted-foreground text-xs'>{t('communicationKeyDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              value={data?.node_secret}
              onValueBlur={(value) => updateConfig('node_secret', value)}
              suffix={
                <Icon
                  icon='uil:arrow-random'
                  onClick={() => {
                    updateConfig('node_secret', nanoid());
                  }}
                />
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('nodePullInterval')}</Label>
            <p className='text-muted-foreground text-xs'>{t('nodePullIntervalDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              type='number'
              min={0}
              onValueBlur={(value) => updateConfig('node_pull_interval', value)}
              suffix='S'
              value={data?.node_pull_interval}
              placeholder={t('inputPlaceholder')}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('nodePushInterval')}</Label>
            <p className='text-muted-foreground text-xs'>{t('nodePushIntervalDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              type='number'
              min={0}
              value={data?.node_push_interval}
              onValueBlur={(value) => updateConfig('node_push_interval', value)}
              placeholder={t('inputPlaceholder')}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
