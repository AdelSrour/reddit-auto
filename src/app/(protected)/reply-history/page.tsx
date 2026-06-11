'use client';

import { Download } from 'lucide-react';
import { Header } from '@/components/layout';
import { Button, Pagination } from '@/components/ui';
import { ReplyHistoryFilters, ReplyHistoryTable } from '@/components/reply-history';
import { useReplyHistory } from '@/hooks';

export default function ReplyHistoryPage(): React.ReactNode {
  const {
    entries,
    meta,
    loading,
    exporting,
    error,
    params,
    searchInput,
    setParams,
    setPage,
    setSearchInput,
    exportCsv,
  } = useReplyHistory();

  return (
    <div>
      <Header
        title="Reply History"
        description="Permanent log of all completed replies, preserved even after account deletion"
        actions={
          <Button
            onClick={() => void exportCsv()}
            loading={exporting}
            disabled={loading}
            variant="secondary"
          >
            {!exporting && <Download className="mr-2 h-4 w-4" aria-hidden="true" />}
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
        </div>
      )}

      <ReplyHistoryFilters
        params={params}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onParamsChange={setParams}
      />

      <ReplyHistoryTable entries={entries} isLoading={loading} />

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 border border-border rounded-lg bg-card">
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
