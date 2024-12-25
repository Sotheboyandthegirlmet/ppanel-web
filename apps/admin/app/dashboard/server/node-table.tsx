'use client';

import { Display } from '@/components/display';
import { ProTable, ProTableActions } from '@/components/pro-table';
import {
  batchDeleteNode,
  createNode,
  deleteNode,
  getNodeGroupList,
  getNodeList,
  nodeSort,
  updateNode,
} from '@/services/admin/server';
import { ConfirmButton } from '@repo/ui/confirm-button';
import { Badge } from '@shadcn/ui/badge';
import { Button } from '@shadcn/ui/button';
import { toast } from '@shadcn/ui/lib/sonner';
import { cn } from '@shadcn/ui/lib/utils';
import { Switch } from '@shadcn/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shadcn/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import NodeForm from './node-form';
import { NodeStatusCell } from './node-status';

export default function NodeTable() {
  const t = useTranslations('server.node');

  const [loading, setLoading] = useState(false);

  const { data: groups } = useQuery({
    queryKey: ['getNodeGroupList'],
    queryFn: async () => {
      const { data } = await getNodeGroupList();
      return (data.data?.list || []) as API.ServerGroup[];
    },
  });

  const ref = useRef<ProTableActions>(null);

  return (
    <ProTable<API.Server, { groupId: number; search: string }>
      action={ref}
      header={{
        toolbar: (
          <NodeForm<API.CreateNodeRequest>
            trigger={t('create')}
            title={t('createNode')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createNode({ ...values, enable: false });
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
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
          cell: ({ row }) => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant='outline'
                    className={cn('text-primary-foreground', {
                      'bg-green-500': row.original.protocol === 'shadowsocks',
                      'bg-rose-500': row.original.protocol === 'vmess',
                      'bg-blue-500': row.original.protocol === 'vless',
                      'bg-yellow-500': row.original.protocol === 'trojan',
                      'bg-purple-500': row.original.protocol === 'hysteria2',
                      'bg-cyan-500': row.original.protocol === 'tuic',
                    })}
                  >
                    {row.getValue('id')}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{row.original.protocol}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ),
        },
        {
          accessorKey: 'enable',
          header: t('enable'),
          cell: ({ row }) => {
            return (
              <Switch
                checked={row.getValue('enable')}
                onCheckedChange={async (checked) => {
                  await updateNode({
                    ...row.original,
                    id: row.original.id!,
                    enable: checked,
                  } as API.UpdateNodeRequest);
                  ref.current?.refresh();
                }}
              />
            );
          },
        },
        {
          accessorKey: 'status',
          header: t('status'),
          cell: ({ row }) => {
            return <NodeStatusCell status={row.original?.status} />;
          },
        },
        {
          accessorKey: 'name',
          header: t('name'),
        },
        {
          accessorKey: 'server_addr',
          header: t('serverAddr'),
        },
        {
          accessorKey: 'speed_limit',
          header: t('speedLimit'),
          cell: ({ row }) => (
            <Display type='traffic' value={row.getValue('speed_limit')} unlimited />
          ),
        },
        {
          accessorKey: 'traffic_ratio',
          header: t('trafficRatio'),
          cell: ({ row }) => <Badge variant='outline'>{row.getValue('traffic_ratio')} X</Badge>,
        },

        {
          accessorKey: 'groupId',
          header: t('nodeGroup'),
          cell: ({ row }) => {
            const name = groups?.find((group) => group.id === row.getValue('groupId'))?.name;
            return name ? <Badge variant='outline'>{name}</Badge> : '--';
          },
        },
      ]}
      params={[
        {
          key: 'search',
        },
        {
          key: 'group_id',
          placeholder: t('nodeGroup'),
          options: groups?.map((item) => ({
            label: item.name,
            value: String(item.id),
          })),
        },
      ]}
      request={async (pagination, filter) => {
        const { data } = await getNodeList({
          ...pagination,
          ...filter,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
      actions={{
        render: (row) => [
          <NodeForm<API.Server>
            key='edit'
            trigger={t('edit')}
            title={t('editNode')}
            loading={loading}
            initialValues={row}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await updateNode({ ...row, ...values } as API.UpdateNodeRequest);
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
                const { id, sort, enable, updated_at, created_at, status, ...params } = row;
                await createNode({
                  ...params,
                  enable: false,
                } as API.CreateNodeRequest);
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
              await deleteNode({
                id: row.id,
              });
              toast.success(t('deleteSuccess'));
              ref.current?.refresh();
            }}
            cancelText={t('cancel')}
            confirmText={t('confirm')}
          />,
        ],
        batchRender(rows) {
          return [
            <ConfirmButton
              key='delete'
              trigger={<Button variant='destructive'>{t('delete')}</Button>}
              title={t('group.confirmDelete')}
              description={t('group.deleteWarning')}
              onConfirm={async () => {
                await batchDeleteNode({
                  ids: rows.map((item) => item.id),
                });
                toast.success(t('group.deleteSuccess'));
                ref.current?.refresh();
              }}
              cancelText={t('group.cancel')}
              confirmText={t('group.confirm')}
            />,
          ];
        },
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
          nodeSort({
            sort: changedItems.map((item) => ({ id: item.id, sort: item.sort })),
          });
        }

        return updatedItems;
      }}
    />
  );
}
