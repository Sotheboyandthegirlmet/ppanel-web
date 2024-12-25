import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL } from '@/config/constants';
import { queryUserInfo } from '@/services/user/user';
import { extractDomain } from '@repo/ui/utils';
import { create } from 'zustand';

export interface GlobalStore {
  common: API.GetGlobalConfigResponse;
  user?: API.User;
  setCommon: (common: Partial<API.GetGlobalConfigResponse>) => void;
  setUser: (user?: API.User) => void;
  getUserInfo: () => Promise<void>;
  getUserSubscribe: (uuid: string, type?: string) => string[];
  getAppSubLink: (type: string, url: string) => string;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  common: {
    background: '',
    site: {
      host: '',
      site_name: '',
      site_desc: '',
      site_logo: '',
    },
    verify: {
      enable_login_verify: false,
      enable_register_verify: false,
      enable_reset_password_verify: false,
      turnstile_site_key: '',
    },
    register: {
      stop_register: false,
      enable_email_verify: false,
      enable_email_domain_suffix: false,
      email_domain_suffix_list: '',
      enable_trial: false,
      enable_ip_register_limit: false,
      ip_register_limit: 0,
      ip_register_limit_duration: 0,
    },
    invite: {
      forced_invite: false,
      referral_percentage: 0,
      only_first_purchase: false,
    },
    currency: {
      currency_unit: 'USD',
      currency_symbol: '$',
      access_key: '',
    },
    subscribe: {
      single_model: false,
      subscribe_path: '',
      subscribe_domain: '',
      pan_domain: false,
    },
  },
  user: undefined,
  setCommon: (common) =>
    set((state) => ({
      common: {
        ...state.common,
        ...common,
      },
    })),
  setUser: (user) => set({ user }),
  getUserInfo: async () => {
    try {
      const { data } = await queryUserInfo();
      set({ user: data.data });
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  },
  getUserSubscribe: (uuid: string, type?: string) => {
    const { pan_domain, subscribe_domain, subscribe_path } = get().common.subscribe || {};
    const domains = subscribe_domain
      ? subscribe_domain.split('\n')
      : [extractDomain(NEXT_PUBLIC_API_URL || NEXT_PUBLIC_SITE_URL || '', pan_domain)];

    return domains.map((domain) => {
      if (pan_domain) {
        if (type) return `https://${uuid}.${type}.${domain}`;
        return `https://${uuid}.${domain}`;
      } else {
        if (type) return `https://${domain}${subscribe_path}?token=${uuid}&type=${type}`;
        return `https://${domain}${subscribe_path}?token=${uuid}`;
      }
    });
  },
  getAppSubLink: (type: string, url: string) => {
    const name = get().common.site.site_name || '';
    switch (type) {
      case 'Clash':
        return `clash://install-config?url=${url}&name=${name}`;
      case 'Hiddify':
        return `hiddify://import/${url}#${name}`;
      case 'Loon':
        return `loon://import?sub=${encodeURI(url)}`;
      case 'NekoBox':
        return `sn://subscription?url=${url}&name=${name}`;
      case 'NekoRay':
        return `sn://subscription?url=${url}&name=${name}`;
      // case 'Netch':
      //   return ``;
      case 'Quantumult X':
        return `quantumult-x://add-resource?remote-resource=${encodeURIComponent(
          JSON.stringify({
            server_remote: [`${url}, tag=${name}`],
          }),
        )}`;
      case 'Shadowrocket':
        return `shadowrocket://add/sub://${window.btoa(url)}?remark=${encodeURI(name)}`;
      case 'Singbox':
        return `sing-box://import-remote-profile?url=${encodeURI(url)}#${name}`;
      case 'Surfboard':
        return `surfboard:///install-config?url=${encodeURI(url)}`;
      case 'Surge':
        return `surge:///install-config?url=${encodeURI(url)}`;
      case 'V2box':
        return `v2box://install-sub?url=${encodeURI(url)}&name=${name}`;
      case 'V2rayN':
        return `v2rayn://install-sub?url=${encodeURI(url)}&name=${name}`;
      case 'V2rayNg':
        return `v2rayng://install-sub?url=${encodeURI(url)}&name=${name}`;
      default:
        return '';
    }
  },
}));

export default useGlobalStore;
