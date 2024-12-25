'use client';

import { getSystemLog, restartSystem } from '@/services/admin/tool';
import { Icon } from '@iconify/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shadcn/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@shadcn/ui/alert-dialog';
import { Badge } from '@shadcn/ui/badge';
import { Button } from '@shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shadcn/ui/card';
import { ScrollArea } from '@shadcn/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const getLogLevelColor = (level: string) => {
  const colorMap: { [key: string]: string } = {
    INFO: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    WARN: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    ERROR: 'bg-red-100 text-red-800 hover:bg-red-200',
  };
  return colorMap[level] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
};

export default function page() {
  const t = useTranslations('tool');
  const {
    data: logs,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['getSystemLog'],
    queryFn: async () => {
      const { data } = await getSystemLog();
      return data.data?.list || [];
    },
  });

  const [openRestart, setOpenRestart] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  return (
    <Card className='border-none'>
      <CardHeader className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
        <div>
          <CardTitle>{t('systemServices')}</CardTitle>
          <CardDescription>{t('viewLogsAndManage')}</CardDescription>
        </div>
        <div className='mt-4 flex flex-col space-y-2 sm:mt-0 sm:flex-row sm:space-x-2 sm:space-y-0'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>{t('systemUpgrade')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirmSystemUpgrade')}</AlertDialogTitle>
                <AlertDialogDescription>{t('upgradeDescription')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction>{t('confirmUpgrade')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog open={openRestart} onOpenChange={setOpenRestart}>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>{t('systemReboot')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirmSystemReboot')}</AlertDialogTitle>
                <AlertDialogDescription>{t('rebootDescription')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <Button
                  onClick={async () => {
                    setIsRestarting(true);
                    await restartSystem();
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    setIsRestarting(false);
                    setOpenRestart(false);
                  }}
                  disabled={isRestarting}
                >
                  {isRestarting && <Icon icon='mdi:loading' className='mr-2 animate-spin' />}{' '}
                  {isRestarting ? t('rebooting') : t('confirmReboot')}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-semibold'>
              {t('currentVersion')} <span>V1.0.0</span>
            </div>
            <div className='text-muted-foreground text-sm'>
              {t('lastUpdated')} <span>2024-12-16 12:00:00</span>
            </div>
          </div>
          <Card className='overflow-hidden'>
            <CardHeader className='bg-secondary py-1'>
              <div className='flex items-center justify-between'>
                <CardTitle>{t('systemLogs')}</CardTitle>
                <Button variant='ghost' size='icon' disabled={isLoading} onClick={() => refetch()}>
                  <Icon
                    icon='uil:refresh'
                    className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
                  />
                  <span className='sr-only'>{t('refreshLogs')}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className='p-0'>
              <ScrollArea className='h-[calc(100dvh-300px)] w-full rounded-md'>
                {isLoading ? (
                  <div className='flex h-full items-center justify-center'>
                    <Icon icon='uil:loading' className='text-primary h-8 w-8 animate-spin' />
                  </div>
                ) : (
                  <Accordion type='single' collapsible className='w-full'>
                    {logs?.map((log, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className='px-4'>
                        <AccordionTrigger className='hover:no-underline'>
                          <div className='flex w-full flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0'>
                            <Badge
                              variant='outline'
                              className={`${getLogLevelColor(log.level)} mb-2 sm:mb-0`}
                            >
                              {log.level}
                            </Badge>
                            <span className='text-xs font-medium sm:text-sm'>{log.time}</span>
                            <span className='text-muted-foreground flex-1 truncate text-xs sm:text-sm'>
                              {log.message}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='px-2'>
                          <div className='grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:text-sm'>
                            <div className='font-medium'>{t('ip')}:</div>
                            <div>{log.ip}</div>
                            <div className='font-medium'>{t('request')}:</div>
                            <div className='break-all'>{log.request}</div>
                            <div className='font-medium'>{t('status')}:</div>
                            <div>{log.status}</div>
                            <div className='font-medium'>{t('caller')}:</div>
                            <div className='break-all'>{log.caller}</div>
                            <div className='font-medium'>{t('errors')}:</div>
                            <div className='break-all'>{log.errors || t('none')}</div>
                            <div className='font-medium'>{t('query')}:</div>
                            <div className='break-all'>{log.query || t('none')}</div>
                            <div className='font-medium'>{t('userAgent')}:</div>
                            <div className='break-all'>{log['user-agent']}</div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
