'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '@/components/ui';
import { api } from '@/lib/api';
import type { DailyStatsSnapshot } from '@/lib/types';

interface ChartDataPoint {
  date: string;
  views: number;
  upvotes: number;
  replies: number;
  shares: number;
  dailyViews: number;
  dailyUpvotes: number;
}

interface StatsHistoryChartProps {
  days?: number;
}

export function StatsHistoryChart({
  days = 30,
}: StatsHistoryChartProps): React.ReactNode {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading stats...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error !== null) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-destructive">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">
              No stats data available yet. Stats are collected daily.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestData = data[data.length - 1];
  const previousData = data.length > 1 ? data[data.length - 2] : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Reply Performance</h3>
          {latestData !== undefined && (
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Today: </span>
                <span className="font-medium">
                  +{latestData.dailyViews} views
                </span>
              </div>
              {previousData !== null && (
                <div>
                  <span className="text-muted-foreground">vs yesterday: </span>
                  <span
                    className={
                      latestData.dailyViews >= previousData.dailyViews
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {latestData.dailyViews >= previousData.dailyViews
                      ? '+'
                      : ''}
                    {latestData.dailyViews - previousData.dailyViews}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
              />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
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
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                name="Total Views"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="upvotes"
                name="Total Upvotes"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="dailyViews"
                name="Daily Views"
                stroke="hsl(221, 83%, 53%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function transformData(snapshots: DailyStatsSnapshot[]): ChartDataPoint[] {
  return snapshots.map((snapshot, index) => {
    const previousSnapshot = index > 0 ? snapshots[index - 1] : null;
    return {
      date: snapshot.date,
      views: snapshot.totalViews,
      upvotes: snapshot.totalUpvotes,
      replies: snapshot.totalReplies,
      shares: snapshot.totalShares,
      dailyViews:
        previousSnapshot !== null
          ? snapshot.totalViews - previousSnapshot.totalViews
          : snapshot.totalViews,
      dailyUpvotes:
        previousSnapshot !== null
          ? snapshot.totalUpvotes - previousSnapshot.totalUpvotes
          : snapshot.totalUpvotes,
    };
  });
}
