'use client';

import { Empty } from '@/components/empty';
import { queryAnnouncement } from '@/services/user/announcement';
import { Markdown } from '@repo/ui/markdown';
import { Timeline } from '@shadcn/ui/timeline';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const { data } = useQuery({
    queryKey: ['queryAnnouncement'],
    queryFn: async () => {
      const { data } = await queryAnnouncement({
        page: 1,
        size: 99,
        pinned: false,
        popup: false,
      });
      return data.data?.announcements || [];
    },
  });
  return data && data.length > 0 ? (
    <Timeline
      data={
        data.map((item) => ({
          title: item.title,
          content: <Markdown>{item.content}</Markdown>,
        })) || []
      }
    />
  ) : (
    <Empty />
  );
}
