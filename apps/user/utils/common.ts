import { locales, NEXT_PUBLIC_DEFAULT_LANGUAGE } from '@/config/constants';
import { isBrowser } from '@repo/ui/utils';
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, {
  path: '/',
  maxAge: 365 * 24 * 60 * 60,
});

export function getLocale() {
  const browserLocale = navigator.language?.split(',')?.[0] || '';
  const defaultLocale = locales.includes(browserLocale) ? browserLocale : '';
  const cookies = new Cookies(null, { path: '/' });
  const cookieLocale = cookies.get('locale') || '';
  const locale = cookieLocale || defaultLocale || NEXT_PUBLIC_DEFAULT_LANGUAGE;
  return locale;
}

export function setLocale(value: string) {
  return cookies.set('locale', value);
}

export function setAuthorization(value: string) {
  return cookies.set('Authorization', value);
}

export function getAuthorization(value?: string) {
  const Authorization = isBrowser() ? cookies.get('Authorization') : value;
  if (!Authorization) return;
  return Authorization;
}

export function setRedirectUrl(value?: string) {
  if (value) {
    sessionStorage.setItem('redirect-url', value);
  }
}

export function getRedirectUrl() {
  return sessionStorage.getItem('redirect-url') ?? '/dashboard';
}

export function Logout() {
  const cookies = new Cookies(null, { path: '/' });
  cookies.remove('Authorization');
  const pathname = location.pathname;
  if (!['', '/', '/auth', '/tos'].includes(pathname)) {
    setRedirectUrl(location.pathname);
    location.href = `/`;
  }
}

export function getPlatform(): 'windows' | 'mac' | 'linux' | 'android' | 'ios' {
  if (typeof navigator === 'undefined') {
    console.log('This function can only run in a browser environment.');
    return 'windows';
  }

  const userAgent = navigator.userAgent;

  const platformPatterns: Record<string, RegExp> = {
    windows: /Windows NT/,
    mac: /Mac OS X/,
    linux: /Linux/,
    android: /Android/,
    ios: /iPhone OS|iPad; CPU OS/,
  };

  for (const [platform, regex] of Object.entries(platformPatterns)) {
    if (regex.test(userAgent)) {
      return platform as 'windows' | 'mac' | 'linux' | 'android' | 'ios';
    }
  }

  return 'windows';
}
