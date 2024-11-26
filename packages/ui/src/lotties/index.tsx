'use client';

import { type LottieComponentProps } from 'lottie-react';
import dynamic from 'next/dynamic';
import gift from './gift.json';
import globalMap from './global-map.json';
import loading from './loading.json';
import locations from './locations.json';
import login from './login.json';
import moon from './moon.json';
import networkSecurity from './network-security.json';
import rocket from './rocket.json';
import servers from './servers.json';
import sun from './sun.json';
import users from './users.json';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function RocketLoadingIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={rocket} />;
}

export function LoadingIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={loading} />;
}

export function SunIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={sun} />;
}

export function MoonIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={moon} />;
}

export function NetworkSecurityIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={networkSecurity} />;
}

export function UsersIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={users} />;
}

export function LocationsIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={locations} />;
}

export function ServersIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={servers} />;
}

export function GlobalMapIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={globalMap} />;
}

export function GiftIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={gift} />;
}

export function LoginIcon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={login} />;
}
