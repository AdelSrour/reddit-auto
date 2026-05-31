'use client';

import { Card, CardContent } from '@/components/ui';
import type { ReplyStats } from '@/lib/types';
import { MessageSquare, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';

interface ReplyStatsCardsProps {
  stats: ReplyStats | null;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  isLoading: boolean;
}

function StatCard({ title, value, subtitle, icon, isLoading }: StatCardProps): React.ReactNode {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            {subtitle && !isLoading && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="text-muted-foreground/50">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReplyStatsCards({ stats, isLoading }: ReplyStatsCardsProps): React.ReactNode {
  const topSubreddit = stats?.topSubreddits[0];
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Replies"
        value={stats?.successfulReplies ?? 0}
        subtitle={`${stats?.failedReplies ?? 0} failed`}
        icon={<MessageSquare size={24} />}
        isLoading={isLoading}
      />
      <StatCard
        title="This Week"
        value={stats?.repliesThisWeek ?? 0}
        subtitle={`${stats?.repliesToday ?? 0} today`}
        icon={<TrendingUp size={24} />}
        isLoading={isLoading}
      />
      <StatCard
        title="Success Rate"
        value={`${stats?.successRate ?? 0}%`}
        subtitle={`${stats?.totalReplies ?? 0} total attempts`}
        icon={<CheckCircle size={24} />}
        isLoading={isLoading}
      />
      <StatCard
        title="Top Subreddit"
        value={topSubreddit ? `r/${topSubreddit.subreddit}` : '-'}
        subtitle={topSubreddit ? `${topSubreddit.count} replies` : undefined}
        icon={<BarChart3 size={24} />}
        isLoading={isLoading}
      />
    </div>
  );
}
