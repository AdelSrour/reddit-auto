'use client';

import { RefreshCw, Star, BookOpen } from 'lucide-react';
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
    rating,
    fetchingRules,
    error,
    syncResult,
    rateResult,
    fetchRulesResult,
    params,
    setParams,
    setPage,
    sync,
    rate,
    fetchRules,
  } = useF5botMatches();

  return (
    <div>
      <Header
        title="F5Bot Matches"
        description="View and manage Reddit posts and comments from F5Bot"
        actions={
          <div className="flex gap-2">
            <Button onClick={sync} loading={syncing} disabled={loading || rating || fetchingRules}>
              {!syncing && <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />}
              {syncing ? 'Syncing...' : 'Sync Mailbox'}
            </Button>
            <Button onClick={rate} loading={rating} disabled={loading || syncing || fetchingRules} variant="secondary">
              {!rating && <Star className="mr-2 h-4 w-4" aria-hidden="true" />}
              {rating ? 'Rating...' : 'Rate Unrated'}
            </Button>
            <Button onClick={fetchRules} loading={fetchingRules} disabled={loading || syncing || rating} variant="secondary">
              {!fetchingRules && <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />}
              {fetchingRules ? 'Fetching...' : 'Fetch Rules'}
            </Button>
          </div>
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

      {rateResult && (
        <div className="mb-4 p-4 bg-accent border border-border rounded-lg text-accent-foreground">
          Rating completed: {rateResult.rated} rated out of {rateResult.totalUnrated} unrated
          {rateResult.failed > 0 && `, ${rateResult.failed} failed`}
        </div>
      )}

      {fetchRulesResult && (
        <div className="mb-4 p-4 bg-accent border border-border rounded-lg text-accent-foreground">
          {fetchRulesResult.message}
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
