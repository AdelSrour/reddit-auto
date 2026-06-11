'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type {
  ReplyHistoryEntry,
  ReplyHistoryQueryParams,
  PaginationMeta,
} from '@/lib/types';

interface UseReplyHistoryReturn {
  entries: ReplyHistoryEntry[];
  meta: PaginationMeta | null;
  loading: boolean;
  exporting: boolean;
  error: string | null;
  params: ReplyHistoryQueryParams;
  setParams: (params: ReplyHistoryQueryParams) => void;
  setPage: (page: number) => void;
  searchInput: string;
  setSearchInput: (search: string) => void;
  refresh: () => Promise<void>;
  exportCsv: () => Promise<void>;
}

export function useReplyHistory(
  initialParams?: ReplyHistoryQueryParams,
): UseReplyHistoryReturn {
  const [entries, setEntries] = useState<ReplyHistoryEntry[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ReplyHistoryQueryParams>(
    initialParams ?? { page: 1, limit: 20, sortBy: 'completedAt', sortOrder: 'desc' },
  );
  const [searchInput, setSearchInput] = useState(params.search ?? '');
  const mountedRef = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => {
        const next = { ...prev, page: 1 };
        if (searchInput.trim() === '') {
          delete next.search;
        } else {
          next.search = searchInput.trim();
        }
        return next;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.automation.getReplyHistory(params);
      if (mountedRef.current) {
        setEntries(response.data);
        setMeta(response.meta);
      }
    } catch (err) {
      if (mountedRef.current) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch reply history');
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [params]);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch with cleanup guard
    void fetchHistory();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchHistory]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(async () => {
    await fetchHistory();
  }, [fetchHistory]);

  const exportCsv = useCallback(async () => {
    setExporting(true);
    setError(null);
    try {
      await api.automation.exportReplyHistory(params);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to export reply history');
      }
    } finally {
      setExporting(false);
    }
  }, [params]);

  return {
    entries,
    meta,
    loading,
    exporting,
    error,
    params,
    setParams,
    setPage,
    searchInput,
    setSearchInput,
    refresh,
    exportCsv,
  };
}
