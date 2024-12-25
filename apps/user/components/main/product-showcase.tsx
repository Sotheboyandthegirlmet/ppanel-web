'use client';

import { SubscribeDetail } from '@/app/(main)/(user)/subscribe/detail';
import { Display } from '@/components/display';
import { getSubscription } from '@/services/common/common';
import { Icon } from '@iconify/react';
import { Button } from '@shadcn/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@shadcn/ui/card';
import { cn } from '@shadcn/ui/lib/utils';
import { Separator } from '@shadcn/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function ProductShowcase() {
  const t = useTranslations('index');

  const { data } = useQuery({
    queryKey: ['getSubscription'],
    queryFn: async () => {
      const { data } = await getSubscription({
        skipErrorHandler: true,
      });
      return data.data?.list || [];
    },
  });
  if (data?.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-2 text-center text-3xl font-bold'
      >
        {t('product_showcase_title')}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className='text-muted-foreground mb-8 text-center text-lg'
      >
        {t('product_showcase_description')}
      </motion.p>
      <div className='mx-auto flex flex-wrap justify-center gap-8 overflow-x-auto overflow-y-hidden'>
        {data?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className='w-1/2 lg:w-1/4'
          >
            <Card className='flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-2xl'>
              <CardHeader className='bg-muted/50 p-4 text-xl font-medium'>{item.name}</CardHeader>
              <CardContent className='flex flex-grow flex-col gap-4 p-6 text-sm'>
                <ul className='flex flex-grow flex-col gap-3'>
                  {(() => {
                    let parsedDescription;
                    try {
                      parsedDescription = JSON.parse(item.description);
                    } catch {
                      parsedDescription = { description: '', features: [] };
                    }

                    const { description, features } = parsedDescription;
                    return (
                      <>
                        {description && <li className='text-muted-foreground'>{description}</li>}
                        {features.map((feature, index) => (
                          <li
                            className={cn('flex items-center gap-2', {
                              'text-muted-foreground line-through': feature.type === 'destructive',
                            })}
                            key={index}
                          >
                            {feature.icon && (
                              <Icon
                                icon={feature.icon}
                                className={cn('text-primary size-5', {
                                  'text-green-500': feature.type === 'success',
                                  'text-destructive': feature.type === 'destructive',
                                })}
                              />
                            )}
                            {feature.label}
                          </li>
                        ))}
                      </>
                    );
                  })()}
                </ul>
                <SubscribeDetail
                  subscribe={{
                    ...item,
                    name: null,
                  }}
                />
              </CardContent>
              <Separator />
              <CardFooter className='relative flex flex-col gap-4 p-4'>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className='pb-4 text-2xl font-semibold sm:text-3xl'
                >
                  <Display type='currency' value={item.unit_price} />
                  <span className='text-base font-medium'>/{t('per_month')}</span>
                </motion.h2>
                <motion.div>
                  <Button
                    className='absolute bottom-0 left-0 w-full rounded-b-xl rounded-t-none'
                    asChild
                  >
                    <Link href='/subscribe'>{t('subscribe')}</Link>
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
