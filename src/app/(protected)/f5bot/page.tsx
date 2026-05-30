'use client';

import { RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout';
import { Button, Pagination } from '@/components/ui';
import { F5botFilters, F5botTable } from '@/components/f5bot';
import { useF5botMatches } from '@/hooks';

export default function F5botPage() {
  const {
    matches,
    meta,
    loading,
    syncing,
    error,
    syncResult,
    params,
    setParams,
    setPage,
    sync,
  } = useF5botMatches();

  return (
    <div>
      <Header
        title="F5Bot Matches"
        description="View and manage Reddit posts and comments from F5Bot"
        actions={
          <Button onClick={sync} loading={syncing} disabled={loading}>
            {!syncing && <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />}
            {syncing ? 'Syncing...' : 'Sync Mailbox'}
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
        </div>
      )}

      {syncResult && (
        <div className="mb-4 p-4 bg-accent border border-border rounded-lg text-accent-foreground">
          Sync completed: {syncResult.emailsProcessed} emails processed,{' '}
          {syncResult.newMatches} new matches, {syncResult.skippedDuplicates} duplicates skipped
        </div>
      )}

      <F5botFilters params={params} onParamsChange={setParams} />

      <F5botTable matches={matches} loading={loading} />

      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
