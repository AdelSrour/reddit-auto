'use client';

import Link from 'next/link';
import { Bot, Radio, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { useDashboardData } from '@/hooks';
import { ReplyStatsCards } from './ReplyStatsCards';
import { RecentRepliesTable } from './RecentRepliesTable';
import { StatsHistoryChart } from './StatsHistoryChart';

const quickLinks: Array<{
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    href: '/f5bot',
    title: 'F5Bot Matches',
    description: 'View Reddit posts and comments from F5Bot alerts',
    icon: Radio,
  },
  {
    href: '/automation',
    title: 'Automation',
    description: 'Create and manage automation instances',
    icon: Bot,
  },
];

export function DashboardContent(): React.ReactNode {
  const { replies, meta, stats, loading, error, setPage } = useDashboardData();

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReplyStatsCards stats={stats} isLoading={loading} />

      <StatsHistoryChart days={30} />

      <RecentRepliesTable
        replies={replies}
        meta={meta}
        onPageChange={setPage}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <Card className="cursor-pointer transition-shadow hover:border-primary/30 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
