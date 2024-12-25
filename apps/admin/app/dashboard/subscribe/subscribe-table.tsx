'use client';

import { Display } from '@/components/display';
import { ProTable, ProTableActions } from '@/components/pro-table';
import {
  batchDeleteSubscribe,
  createSubscribe,
  deleteSubscribe,
  getSubscribeGroupList,
  getSubscribeList,
  subscribeSort,
  updateSubscribe,
} from '@/services/admin/subscribe';
import { ConfirmButton } from '@repo/ui/confirm-button';
import { Badge } from '@shadcn/ui/badge';
import { Button } from '@shadcn/ui/button';
import { toast } from '@shadcn/ui/lib/sonner';
import { Switch } from '@shadcn/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import SubscribeForm from './subscribe-form';

export default function SubscribeTable() {
  const t = useTranslations('subscribe');
  const [loading, setLoading] = useState(false);
  const { data: groups } = useQuery({
    queryKey: ['getSubscribeGroupList', 'all'],
    queryFn: async () => {
      const { data } = await getSubscribeGroupList({
        page: 1,
        size: 9999,
      });
      return data.data?.list as API.SubscribeGroup[];
    },
  });
  const ref = useRef<ProTableActions>(null);
  return (
    <ProTable<API.Subscribe, { group_id: number; query: string }>
      action={ref}
      header={{
        toolbar: (
          <SubscribeForm<API.CreateSubscribeRequest>
            trigger={t('create')}
            title={t('createSubscribe')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createSubscribe({
                  ...values,
                  show: false,
                  sell: false,
                });
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
      params={[
        {
          key: 'search',
        },
        {
          key: 'group_id',
          placeholder: t('subscribeGroup'),
          options: groups?.map((item) => ({
            label: item.name,
            value: String(item.id),
          })),
        },
      ]}
      request={async (pagination, filters) => {
        const { data } = await getSubscribeList({
          ...pagination,
          ...filters,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
      columns={[
        {
          accessorKey: 'show',
          header: t('show'),
          cell: ({ row }) => {
            return (
              <Switch
                defaultChecked={row.getValue('show')}
                onCheckedChange={async (checked) => {
                  await updateSubscribe({
                    ...row.original,
                    show: checked,
                  } as API.UpdateSubscribeRequest);
                  ref.current?.refresh();
                }}
              />
            );
          },
        },
        {
          accessorKey: 'sell',
          header: t('sell'),
          cell: ({ row }) => {
            return (
              <Switch
                defaultChecked={row.getValue('sell')}
                onCheckedChange={async (checked) => {
                  await updateSubscribe({
                    ...row.original,
                    sell: checked,
                  } as API.UpdateSubscribeRequest);
                  ref.current?.refresh();
                }}
              />
            );
          },
        },
        {
          accessorKey: 'name',
          header: t('name'),
        },
        {
          accessorKey: 'unit_price',
          header: t('unitPrice'),
          cell: ({ row }) => <Display type='currency' value={row.getValue('unit_price')} />,
        },
        {
          accessorKey: 'replacement',
          header: t('replacement'),
          cell: ({ row }) => <Display type='currency' value={row.getValue('replacement')} />,
        },
        {
          accessorKey: 'traffic',
          header: t('traffic'),
          cell: ({ row }) => <Display type='traffic' value={row.getValue('traffic')} unlimited />,
        },
        {
          accessorKey: 'device_limit',
          header: t('deviceLimit'),
          cell: ({ row }) => (
            <Display type='number' value={row.getValue('device_limit')} unlimited />
          ),
        },
        {
          accessorKey: 'inventory',
          header: t('inventory'),
          cell: ({ row }) => (
            <Display
              type='number'
              value={row.getValue('inventory') === -1 ? 0 : row.getValue('inventory')}
              unlimited
            />
          ),
        },
        {
          accessorKey: 'quota',
          header: t('quota'),
          cell: ({ row }) => <Display type='number' value={row.getValue('quota')} unlimited />,
        },
        {
          accessorKey: 'group_id',
          header: t('subscribeGroup'),
          cell: ({ row }) => {
            const name = groups?.find((group) => group.id === row.getValue('group_id'))?.name;
            return name ? <Badge variant='outline'>{name}</Badge> : '--';
          },
        },
      ]}
      actions={{
        render: (row) => [
          <SubscribeForm<API.Subscribe>
            key='edit'
            trigger={t('edit')}
            title={t('editSubscribe')}
            loading={loading}
            initialValues={row}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await updateSubscribe({
                  ...row,
                  ...values,
                } as API.UpdateSubscribeRequest);
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
          <Button
            key='copy'
            variant='secondary'
            onClick={async () => {
              setLoading(true);
              try {
                const { id, sort, sell, updated_at, created_at, ...params } = row;
                await createSubscribe({
                  ...params,
                  show: false,
                  sell: false,
                });
                toast.success(t('copySuccess'));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch (error) {
                setLoading(false);
                return false;
              }
            }}
          >
            {t('copy')}
          </Button>,
          <ConfirmButton
            key='delete'
            trigger={<Button variant='destructive'>{t('delete')}</Button>}
            title={t('confirmDelete')}
            description={t('deleteWarning')}
            onConfirm={async () => {
              await deleteSubscribe({
                id: row.id,
              });
              toast.success(t('deleteSuccess'));
              ref.current?.refresh();
            }}
            cancelText={t('cancel')}
            confirmText={t('confirm')}
          />,
        ],
        batchRender: (rows) => [
          <ConfirmButton
            key='delete'
            trigger={<Button variant='destructive'>{t('delete')}</Button>}
            title={t('confirmDelete')}
            description={t('deleteWarning')}
            onConfirm={async () => {
              await batchDeleteSubscribe({
                ids: rows.map((item) => item.id),
              });

              toast.success(t('deleteSuccess'));
              ref.current?.reset();
            }}
            cancelText={t('cancel')}
            confirmText={t('confirm')}
          />,
        ],
      }}
      onSort={async (source, target, items) => {
        const sourceIndex = items.findIndex((item) => String(item.id) === source);
        const targetIndex = items.findIndex((item) => String(item.id) === target);

        const originalSortMap = new Map(items.map((item) => [item.id, item.sort || item.id]));

        const [movedItem] = items.splice(sourceIndex, 1);
        items.splice(targetIndex, 0, movedItem!);

        const updatedItems = items.map((item, index) => {
          const originalSort = originalSortMap.get(item.id);
          const newSort = originalSort !== undefined ? originalSort : item.sort;
          return { ...item, sort: newSort };
        });

        const changedItems = updatedItems.filter(
          (item) => originalSortMap.get(item.id) !== item.sort,
        );

        if (changedItems.length > 0) {
          subscribeSort({
            sort: changedItems.map((item) => ({ id: item.id, sort: item.sort })),
          });
        }

        return updatedItems;
      }}
    />
  );
}
