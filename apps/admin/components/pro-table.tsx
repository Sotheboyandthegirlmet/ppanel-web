'use client';

import { ProTable as _ProTable, ProTableProps } from '@repo/ui/pro-table';
import { useTranslations } from 'next-intl';
export { type ProTableActions } from '@repo/ui/pro-table';

export function ProTable<
  TData extends Record<string, unknown>,
  TValue extends Record<string, unknown>,
>(props: ProTableProps<TData, TValue>) {
  const t = useTranslations('common.table');
  return (
    <_ProTable
      {...props}
      texts={{
        actions: t('actions'),
        asc: t('asc'),
        desc: t('desc'),
        hide: t('hide'),
        selectedRowsText(total) {
          return t('selectedItems', { total });
        },
        textPageOf(current, total) {
          return t('pageInfo', { current, total });
        },
        textRowsPerPage: t('rowsPerPage'),
      }}
    />
  );
}
