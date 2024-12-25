import Providers from '@/components/providers';
import { geistMono, geistSans } from '@/config/fonts';
import { currentUser } from '@/services/admin/user';
import { getGlobalConfig } from '@/services/common/common';
import '@shadcn/ui/globals.css';
import { Toaster } from '@shadcn/ui/sonner';
import { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { PublicEnvScript } from 'next-runtime-env';
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';
import rtlDetect from 'rtl-detect';

export async function generateMetadata(): Promise<Metadata> {
  noStore();

  let site: API.SiteConfig | undefined;
  await getGlobalConfig({ skipErrorHandler: true })
    .then((res) => {
      const config = res.data.data;
      site = config?.site || undefined;
    })
    .catch((error) => {
      console.error('Error fetching global config:', error);
    });

  const defaultMetadata = {
    title: {
      default: site?.site_name || `PPanel`,
      template: `%s | ${site?.site_name || 'PPanel'}`,
    },
    description: site?.site_desc || '',
    icons: {
      icon: site?.site_logo
        ? [
            {
              url: site.site_logo,
              sizes: 'any',
            },
          ]
        : [
            { url: '/favicon.ico', sizes: '48x48' },
            { url: '/favicon.svg', type: 'image/svg+xml' },
          ],
      apple: site?.site_logo || '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  };

  return defaultMetadata;
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  let config, user;

  try {
    config = await getGlobalConfig({ skipErrorHandler: true }).then((res) => res.data.data);
  } catch (error) {
    /* empty */
  }

  try {
    user = await currentUser({
      skipErrorHandler: true,
      Authorization: (await cookies()).get('Authorization')?.value,
    }).then((res) => res.data.data);
  } catch (error) {
    /* empty */
  }

  return (
    <html suppressHydrationWarning lang={locale} dir={rtlDetect.getLangDir(locale)}>
      <head>
        <PublicEnvScript />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} size-full min-h-[calc(100dvh-env(safe-area-inset-top))] antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <NextTopLoader showSpinner={false} />
          <Providers common={{ ...config }} user={user}>
            <Toaster richColors closeButton />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
