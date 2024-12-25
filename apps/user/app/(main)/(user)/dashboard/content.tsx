'use client';

import { Display } from '@/components/display';
import { queryApplicationConfig } from '@/services/user/subscribe';
import { queryUserSubscribe } from '@/services/user/user';
import { Icon } from '@iconify/react';
import { getNextResetDate, isBrowser } from '@repo/ui/utils';
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
import { Button } from '@shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/ui/card';
import { differenceInDays } from '@shadcn/ui/lib/date-fns';
import { toast } from '@shadcn/ui/lib/sonner';
import { Separator } from '@shadcn/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@shadcn/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';

import useGlobalStore from '@/config/use-global';
import { getStat } from '@/services/common/common';
import { getPlatform } from '@/utils/common';
import CopyToClipboard from 'react-copy-to-clipboard';
import Renewal from '../order/renewal';
import ResetTraffic from '../order/reset-traffic';
import Subscribe from '../subscribe/page';

export default function Content() {
  const t = useTranslations('dashboard');
  const { getUserSubscribe, getAppSubLink } = useGlobalStore();

  const [protocol, setProtocol] = useState('');

  const { data: userSubscribe = [] } = useQuery({
    queryKey: ['queryUserSubscribe'],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data?.list || [];
    },
  });
  const { data: application } = useQuery({
    queryKey: ['queryApplicationConfig'],
    queryFn: async () => {
      const { data } = await queryApplicationConfig();
      return data.data as API.ApplicationResponse;
    },
  });
  const [platform, setPlatform] = useState<keyof API.ApplicationResponse>(getPlatform());

  const { data } = useQuery({
    queryKey: ['getStat'],
    queryFn: async () => {
      const { data } = await getStat({
        skipErrorHandler: true,
      });
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {userSubscribe.length ? (
        <>
          <h2 className='flex items-center gap-1.5 font-semibold'>
            <Icon icon='uil:servers' className='size-5' />
            {t('mySubscriptions')}
          </h2>
          <div className='flex flex-wrap justify-between gap-4'>
            <Tabs
              value={platform}
              onValueChange={(value) => setPlatform(value as keyof API.ApplicationResponse)}
              className='w-full max-w-full md:w-auto'
            >
              <TabsList className='flex *:flex-auto'>
                {application &&
                  Object.keys(application)?.map((item) => (
                    <TabsTrigger value={item} key={item} className='px-1 uppercase lg:px-3'>
                      {item}
                    </TabsTrigger>
                  ))}
              </TabsList>
            </Tabs>
            {data?.protocol && data?.protocol.length > 1 && (
              <Tabs
                value={protocol}
                onValueChange={setProtocol}
                className='w-full max-w-full md:w-auto'
              >
                <TabsList className='flex *:flex-auto'>
                  {['all', ...(data?.protocol || [])].map((item) => (
                    <TabsTrigger
                      value={item === 'all' ? '' : item}
                      key={item}
                      className='px-1 uppercase lg:px-3'
                    >
                      {item}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>
          {userSubscribe.map((item) => (
            <Card key={item.id}>
              <CardHeader className='flex flex-row flex-wrap items-center justify-between gap-2 space-y-0'>
                <CardTitle className='font-medium'>{item.subscribe.name}</CardTitle>
                <div className='flex gap-2'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size='sm' variant='destructive'>
                        {t('resetSubscription')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('prompt')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('confirmResetSubscription')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast.success(t('resetSuccess'))}>
                          {t('confirm')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <ResetTraffic
                    id={item.subscribe_id}
                    token={item.token}
                    replacement={item.subscribe.replacement}
                  />
                  <Renewal token={item.token} subscribe={item.subscribe} />
                </div>
              </CardHeader>
              <CardContent>
                <ul className='grid grid-cols-2 gap-3 *:flex *:flex-col *:justify-between lg:grid-cols-4'>
                  <li>
                    <span className='text-muted-foreground'>{t('used')}</span>
                    <span className='text-2xl font-bold'>
                      <Display
                        type='traffic'
                        value={item.upload + item.download}
                        unlimited={!item.traffic}
                      />
                    </span>
                  </li>
                  <li>
                    <span className='text-muted-foreground'>{t('totalTraffic')}</span>
                    <span className='text-2xl font-bold'>
                      <Display type='traffic' value={item.traffic} unlimited={!item.traffic} />
                    </span>
                  </li>
                  <li>
                    <span className='text-muted-foreground'>{t('nextResetDays')}</span>
                    <span className='text-2xl font-semibold'>
                      {differenceInDays(getNextResetDate(item.start_time), new Date()) ||
                        t('unknown')}
                    </span>
                  </li>
                  <li>
                    <span className='text-muted-foreground'>{t('expirationDays')}</span>
                    <span className='text-2xl font-semibold'>
                      {differenceInDays(new Date(item.expire_time), new Date()) || t('unknown')}
                    </span>
                  </li>
                </ul>
                <Separator className='mt-4' />
                <Accordion type='single' collapsible defaultValue='0' className='w-full'>
                  {getUserSubscribe(item.token, protocol)?.map((url, index) => (
                    <AccordionItem key={url} value={String(index)}>
                      <AccordionTrigger className='hover:no-underline'>
                        <div className='flex w-full flex-row items-center justify-between'>
                          <CardTitle className='text-sm font-medium'>
                            {t('subscriptionUrl')} {index + 1}
                          </CardTitle>
                          <CopyToClipboard
                            text={url}
                            onCopy={(text, result) => {
                              if (result) {
                                toast.success(t('copySuccess'));
                              }
                            }}
                          >
                            <span
                              className='text-primary hover:bg-accent mr-4 flex cursor-pointer rounded p-2 text-sm'
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Icon icon='uil:copy' className='mr-2 size-5' />
                              {t('copy')}
                            </span>
                          </CopyToClipboard>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className='grid grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-7'>
                          {application &&
                            application[platform]?.map((app) => (
                              <div
                                key={app.name}
                                className='text-muted-foreground flex size-full flex-col items-center justify-between gap-2 text-xs'
                              >
                                <span>{app.name}</span>
                                {app.icon && (
                                  <Image src={app.icon} alt={app.name} width={50} height={50} />
                                )}
                                <div className='flex'>
                                  <Button size='sm' variant='secondary' className='px-1.5' asChild>
                                    <Link href={app.url!}>{t('download')}</Link>
                                  </Button>
                                  <CopyToClipboard
                                    text={url}
                                    onCopy={(text, result) => {
                                      const href = getAppSubLink(app.subscribe_type, url);
                                      if (isBrowser() && href) {
                                        window.location.href = href;
                                      } else if (result) {
                                        toast.success(
                                          <>
                                            <p>{t('copySuccess')}</p>
                                            <p>{t('manualImportMessage')}</p>
                                          </>,
                                        );
                                      }
                                    }}
                                  >
                                    <Button size='sm' className='p-2'>
                                      {t('import')}
                                    </Button>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            ))}
                          <div className='text-muted-foreground hidden size-full flex-col items-center justify-between gap-2 text-sm lg:flex'>
                            <span>{t('qrCode')}</span>
                            <QRCodeCanvas
                              value={url}
                              size={80}
                              bgColor='transparent'
                              fgColor='rgb(59, 130, 246)'
                            />
                            <span className='text-center'>{t('scanToSubscribe')}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <>
          <h2 className='flex items-center gap-1.5 font-semibold'>
            <Icon icon='uil:shop' className='size-5' />
            {t('purchaseSubscription')}
          </h2>
          <Subscribe />
        </>
      )}
    </>
  );
}
