'use client';

import { locales } from '@/config/constants';
import { setLocale } from '@/utils/common';
import { Icon } from '@iconify/react';
import { getCountry } from '@repo/ui/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shadcn/ui/select';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LanguageSwitch() {
  const locale = useLocale();
  const country = getCountry(locale);
  const t = useTranslations('language');
  const router = useRouter();

  const handleLanguageChange = (value: string) => {
    setLocale(value);
    router.refresh();
  };

  return (
    <Select defaultValue={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className='hover:bg-accent hover:text-accent-foreground w-auto border-none bg-transparent p-2 focus:ring-0 [&>svg]:hidden'>
        <SelectValue>
          <div className='flex items-center'>
            <Icon icon={`flagpack:${country?.alpha2.toLowerCase()}`} className='!size-5' />
            <span className='sr-only'>{t(`${locale}`)}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map(getCountry).map((item) => (
          <SelectItem key={`${item?.lang}-${item?.alpha2}`} value={`${item?.lang}-${item?.alpha2}`}>
            <div className='flex items-center gap-2'>
              <Icon icon={`flagpack:${item?.alpha2.toLowerCase()}`} className='!size-5' />
              {t(`${item?.lang}-${item?.alpha2}`)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
