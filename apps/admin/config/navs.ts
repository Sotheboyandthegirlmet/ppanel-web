export const navs = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'flat-color-icons:globe',
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'System Config',
        url: '/dashboard/system',
        icon: 'flat-color-icons:services',
      },
      {
        title: 'Payment Config',
        url: '/dashboard/payment',
        icon: 'flat-color-icons:currency-exchange',
      },
    ],
  },
  {
    title: 'Server',
    items: [
      {
        title: 'Server Management',
        url: '/dashboard/server',
        icon: 'flat-color-icons:data-protection',
      },
    ],
  },
  {
    title: 'Finance',
    items: [
      {
        title: 'Subscribe Management',
        url: '/dashboard/subscribe',
        icon: 'flat-color-icons:shop',
      },
      {
        title: 'Order Management',
        url: '/dashboard/order',
        icon: 'flat-color-icons:todo-list',
      },
      {
        title: 'Coupon Management',
        url: '/dashboard/coupon',
        icon: 'flat-color-icons:bookmark',
      },
    ],
  },
  {
    title: 'User',
    items: [
      {
        title: 'User Management',
        url: '/dashboard/user',
        icon: 'flat-color-icons:conference-call',
      },
      {
        title: 'Announcement Management',
        url: '/dashboard/announcement',
        icon: 'flat-color-icons:news',
      },
      {
        title: 'Ticket Management',
        url: '/dashboard/ticket',
        icon: 'flat-color-icons:collaboration',
      },
      {
        title: 'Document Management',
        url: '/dashboard/document',
        icon: 'flat-color-icons:document',
      },
    ],
  },
  {
    title: 'System Tool',
    url: '/dashboard/tool',
    icon: 'flat-color-icons:info',
  },
];

export function findNavByUrl(url: string) {
  for (const nav of navs) {
    if (nav.url && nav.url === url) {
      return [nav];
    }
    if (nav.items) {
      const current = nav.items.find((item) => item.url === url);
      if (current) {
        return [nav, current];
      }
    }
  }
  return [];
}
