'use client';

import { formatDate } from '@repo/ui/utils';
import { Badge } from '@shadcn/ui/badge';
import { Progress } from '@shadcn/ui/progress';
import { ScrollArea } from '@shadcn/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shadcn/ui/tooltip';
import { useTranslations } from 'next-intl';

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function NodeStatusCell({ status }: { status: API.NodeStatus }) {
  const t = useTranslations('server.node');

  const {
    last_at,
    online_users,
    status: serverStatus,
  } = status || {
    online_users: [],
    status: {
      cpu: 0,
      mem: 0,
      disk: 0,
      updated_at: 0,
    },
    last_at: 0,
  };
  const isOnline = last_at > 0;
  const badgeVariant = isOnline ? 'default' : 'destructive';
  const badgeText = isOnline ? t('normal') : t('abnormal');
  const onlineCount = Array.isArray(online_users) ? online_users?.length : 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='flex items-center space-x-2 rounded-md'>
            <Badge variant={badgeVariant}>{badgeText}</Badge>
            <span className='text-sm font-medium'>
              {t('onlineCount')}: {onlineCount}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className='bg-muted text-foreground w-80'>
          <div className='space-y-4'>
            <>
              <div className='space-y-2'>
                <div className='space-y-1'>
                  <div className='flex justify-between text-xs'>
                    <span className='font-medium'>CPU</span>
                    <span>{formatPercentage(serverStatus?.cpu ?? 0)}</span>
                  </div>
                  <Progress value={(serverStatus?.cpu ?? 0) * 100} className='h-2' />
                </div>
                <div className='space-y-1'>
                  <div className='flex justify-between text-xs'>
                    <span className='font-medium'>{t('memory')}</span>
                    <span>{formatPercentage(serverStatus?.mem ?? 0)}</span>
                  </div>
                  <Progress value={(serverStatus?.mem ?? 0) * 100} className='h-2' />
                </div>
                <div className='space-y-1'>
                  <div className='flex justify-between text-xs'>
                    <span className='font-medium'>{t('disk')}</span>
                    <span>{formatPercentage(serverStatus?.disk ?? 0)}</span>
                  </div>
                  <Progress value={(serverStatus?.disk ?? 0) * 100} className='h-2' />
                </div>
              </div>
              <div className='text-xs'>
                {t('lastUpdated')}: {formatDate(serverStatus?.updated_at ?? 0)}
              </div>
              {isOnline && onlineCount > 0 && (
                <div className='space-y-2'>
                  <h4 className='text-sm font-semibold'>{t('onlineUsers')}</h4>
                  <ScrollArea className='h-[400px] rounded-md border p-2'>
                    {online_users.map((user, index) => (
                      <div key={user.uid} className='py-1 text-xs'>
                        {user.ip} (UID: {user.uid})
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
