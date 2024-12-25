'use client';

import { getTutorial } from '@/utils/tutorial';
import { Markdown } from '@repo/ui/markdown';
import { Avatar, AvatarFallback } from '@shadcn/ui/avatar';
import { buttonVariants } from '@shadcn/ui/button';
import { useOutsideClick } from '@shadcn/ui/hooks/use-outside-click';
import { cn } from '@shadcn/ui/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RefObject, useEffect, useId, useRef, useState } from 'react';

interface Item {
  path: string;
  title: string;
}
export function TutorialButton({ items }: { items: Item[] }) {
  const t = useTranslations('document');

  const [active, setActive] = useState<Item | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    enabled: !!(active as Item)?.path,
    queryKey: ['getTutorial', (active as Item)?.path],
    queryFn: async () => {
      const markdown = await getTutorial((active as Item)?.path);
      return markdown;
    },
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false);
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  useOutsideClick(ref as RefObject<HTMLDivElement>, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-10 h-full w-full bg-black/20'
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <div className='fixed inset-0 z-[100] grid place-items-center'>
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className='bg-foreground absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full'
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className='bg-muted flex size-full flex-col overflow-auto p-6 sm:rounded'
            >
              <Markdown
                components={{
                  img: ({ node, className, ...props }) => {
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        {...props}
                        width={800}
                        height={384}
                        className='my-4 inline-block size-auto max-h-96'
                      />
                    );
                  },
                }}
              >
                {data || ''}
              </Markdown>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className='flex w-full flex-col gap-4'>
        {items.map((item, index) => (
          <motion.div
            layoutId={`card-${item.title}-${id}`}
            key={`card-${item.title}-${id}`}
            onClick={() => setActive(item)}
            className='bg-background hover:bg-accent flex cursor-pointer items-center justify-between rounded border p-4'
          >
            <div className='flex flex-row items-center gap-4'>
              <motion.div layoutId={`image-${item.title}-${id}`}>
                <Avatar className='size-12'>
                  <AvatarFallback className='bg-primary'>{item.title.split('')[0]}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div className=''>
                <motion.h3 layoutId={`title-${item.title}-${id}`} className='font-medium'>
                  {item.title}
                </motion.h3>
                {/* <motion.p
                  layoutId={`description-${item.title}-${id}`}
                  className='text-center text-neutral-600 md:text-left dark:text-neutral-400'
                >
                  {formatDate(item.updated_at)}
                </motion.p> */}
              </div>
            </div>
            <motion.button
              layoutId={`button-${item.title}-${id}`}
              className={cn(
                buttonVariants({
                  variant: 'secondary',
                }),
                'rounded-full',
              )}
            >
              {t('read')}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-4 w-4 text-black'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M18 6l-12 12' />
      <path d='M6 6l12 12' />
    </motion.svg>
  );
};
