'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '@/components/ui';
import { api } from '@/lib/api';
import type { DailyStatsSnapshot } from '@/lib/types';

interface ChartDataPoint {
  date: string;
  dailyViews: number;
  dailyUpvotes: number;
  dailyReplies: number;
}

interface VisibleLines {
  views: boolean;
  upvotes: boolean;
  replies: boolean;
}

interface StatsHistoryChartProps {
  days?: number;
}

const LINE_COLORS = {
  views: 'hsl(var(--primary))',
  upvotes: 'hsl(142, 76%, 36%)',
  replies: 'hsl(221, 83%, 53%)',
} as const;

export function StatsHistoryChart({
  days = 30,
}: StatsHistoryChartProps): React.ReactNode {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState<VisibleLines>({
    views: true,
    upvotes: true,
    replies: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchData(): Promise<void> {
      try {
        const snapshots = await api.automation.stats.history(days);
        if (isMounted) {
          const chartData = transformData(snapshots);
          setData(chartData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load stats');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [days]);

  function toggleLine(line: keyof VisibleLines): void {
    setVisibleLines((prev) => ({
      ...prev,
      [line]: !prev[line],
    }));
  }

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="h-[350px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading stats...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error !== null) {
    return (
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="h-[350px] flex items-center justify-center">
            <div className="text-destructive">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="h-[350px] flex items-center justify-center">
            <div className="text-muted-foreground">
              No stats data available yet. Stats are collected daily.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Daily Performance</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleLine('views')}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 border
                ${
                  visibleLines.views
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-muted/50 border-muted text-muted-foreground opacity-60'
                }
              `}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: LINE_COLORS.views }}
              />
              Views
            </button>
            <button
              type="button"
              onClick={() => toggleLine('upvotes')}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 border
                ${
                  visibleLines.upvotes
                    ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                    : 'bg-muted/50 border-muted text-muted-foreground opacity-60'
                }
              `}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: LINE_COLORS.upvotes }}
              />
              Upvotes
            </button>
            <button
              type="button"
              onClick={() => toggleLine('replies')}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 border
                ${
                  visibleLines.replies
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400'
                    : 'bg-muted/50 border-muted text-muted-foreground opacity-60'
                }
              `}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: LINE_COLORS.replies }}
              />
              Replies
            </button>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/50"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickFormatter={(value: string) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
                label={{
                  value: 'Date',
                  position: 'insideBottom',
                  offset: -20,
                  className: 'fill-muted-foreground text-xs',
                }}
                tickLine={false}
                axisLine={{ className: 'stroke-muted' }}
              />
              <YAxis
                className="text-xs"
                label={{
                  value: 'Number of Replies/Views/Upvotes',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  className: 'fill-muted-foreground text-xs',
                  style: { textAnchor: 'middle' },
                }}
                tickLine={false}
                axisLine={{ className: 'stroke-muted' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelFormatter={(label) => {
                  if (typeof label !== 'string') return String(label);
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              {visibleLines.views && (
                <Line
                  type="monotone"
                  dataKey="dailyViews"
                  name="Views"
                  stroke={LINE_COLORS.views}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              )}
              {visibleLines.upvotes && (
                <Line
                  type="monotone"
                  dataKey="dailyUpvotes"
                  name="Upvotes"
                  stroke={LINE_COLORS.upvotes}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              )}
              {visibleLines.replies && (
                <Line
                  type="monotone"
                  dataKey="dailyReplies"
                  name="Replies"
                  stroke={LINE_COLORS.replies}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function transformData(snapshots: DailyStatsSnapshot[]): ChartDataPoint[] {
  return snapshots.map((snapshot, index) => {
    const prev = index > 0 ? snapshots[index - 1] : null;
    return {
      date: snapshot.date,
      dailyViews: prev !== null ? snapshot.totalViews - prev.totalViews : snapshot.totalViews,
      dailyUpvotes: prev !== null ? snapshot.totalUpvotes - prev.totalUpvotes : snapshot.totalUpvotes,
      dailyReplies: prev !== null ? snapshot.totalReplies - prev.totalReplies : snapshot.totalReplies,
    };
  });
}
