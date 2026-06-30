'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bot, Plus, Play, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui';
import { InstanceCard } from '@/components/automation';
import { useAutomationInstances } from '@/hooks';
import { api } from '@/lib/api';
import type { DailyAutomationResult, StatsRefreshResult, SkipReason } from '@/lib/types';

function formatSkipReason(reason: SkipReason): string {
  switch (reason) {
    case 'NO_AVAILABLE_POSTS':
      return 'No available posts';
    case 'DAILY_LIMIT_REACHED':
      return 'Daily limit reached';
    case 'INACTIVE':
      return 'Inactive';
  }
}

export default function AutomationPage() {
  const { instances, loading, error, refresh } = useAutomationInstances();
  const [runningDaily, setRunningDaily] = useState(false);
  const [dailyResult, setDailyResult] = useState<DailyAutomationResult | null>(null);
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [refreshingStats, setRefreshingStats] = useState(false);
  const [statsResult, setStatsResult] = useState<StatsRefreshResult | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const handleRunDaily = async (): Promise<void> => {
    setRunningDaily(true);
    setDailyResult(null);
    setDailyError(null);

    try {
      const result = await api.automation.runDaily();
      setDailyResult(result);
      refresh();
    } catch (err) {
      setDailyError(err instanceof Error ? err.message : 'Failed to run daily automation');
    } finally {
      setRunningDaily(false);
    }
  };

  const handleRefreshStats = async (): Promise<void> => {
    setRefreshingStats(true);
    setStatsResult(null);
    setStatsError(null);

    try {
      const result = await api.automation.stats.refresh();
      setStatsResult(result);
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : 'Failed to refresh stats');
    } finally {
      setRefreshingStats(false);
    }
  };

  return (
    <div>
      <Header
        title="Automation"
        description="Manage your automation instances"
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleRefreshStats}
              disabled={refreshingStats}
            >
              {refreshingStats ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Refresh Stats
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleRunDaily}
              disabled={runningDaily}
            >
              {runningDaily ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                  Run Daily Automation
                </>
              )}
            </Button>
            <Link href="/automation/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Create Instance
              </Button>
            </Link>
          </div>
        }
      />

      {statsResult !== null && (
        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-700 dark:text-blue-400">
          <div className="font-medium mb-2">Stats refresh completed</div>
          <ul className="text-sm space-y-1">
            <li>Processed: {statsResult.totalProcessed} replies</li>
            <li>Updated: {statsResult.successful} successful</li>
            {statsResult.failed > 0 && <li>Failed: {statsResult.failed}</li>}
            {statsResult.skipped > 0 && <li>Skipped: {statsResult.skipped} (already updated today)</li>}
          </ul>
          <button
            onClick={() => setStatsResult(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {statsError !== null && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          Stats refresh failed: {statsError}
          <button
            onClick={() => setStatsError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {dailyResult && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 dark:text-green-400">
          <div className="font-medium mb-2">Daily automation completed</div>
          <ul className="text-sm space-y-1">
            {dailyResult.syncResult && (
              <li>Sync: {dailyResult.syncResult.emailsProcessed} emails, {dailyResult.syncResult.newMatches} new matches</li>
            )}
            {dailyResult.ratingResult && (
              <li>Rating: {dailyResult.ratingResult.rated} rated, {dailyResult.ratingResult.failed} failed</li>
            )}
            <li>
              Scheduling: {dailyResult.schedulingResult.totalScheduled} replies scheduled across {dailyResult.schedulingResult.instancesProcessed} instances
            </li>
            {dailyResult.schedulingResult.skippedInstances.length > 0 && (
              <li>
                Skipped instances:
                <ul className="ml-4 mt-1">
                  {dailyResult.schedulingResult.skippedInstances.map((skipped) => (
                    <li key={skipped.instanceId}>
                      {skipped.instanceTitle}: {formatSkipReason(skipped.reason)}
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
          <button
            onClick={() => setDailyResult(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {dailyError && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          Daily automation failed: {dailyError}
          <button
            onClick={() => setDailyError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
          <button
            onClick={refresh}
            className="ml-2 text-destructive underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : instances.length === 0 ? (
        <div className="py-12 text-center">
          <Bot className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <h3 className="mb-2 text-lg font-medium text-foreground">
            No automation instances yet
          </h3>
          <p className="mb-4 text-muted-foreground">
            Create your first automation instance to get started
          </p>
          <Link href="/automation/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Instance
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instances.map((instance) => (
            <InstanceCard key={instance.id} instance={instance} />
          ))}
        </div>
      )}
    </div>
  );
}
