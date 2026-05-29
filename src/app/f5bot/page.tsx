'use client';

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
            {syncing ? 'Syncing...' : 'Sync Mailbox'}
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {syncResult && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
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
