'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type { AutomationReply, PaginationMeta, ReplyStats } from '@/lib/types';

interface UseDashboardDataReturn {
  replies: AutomationReply[];
  meta: PaginationMeta | null;
  stats: ReplyStats | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [replies, setReplies] = useState<AutomationReply[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [stats, setStats] = useState<ReplyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.automation.getAllReplies(page, 10);
      if (mountedRef.current) {
        setReplies(response.data);
        setMeta(response.meta);
        setStats(response.stats);
      }
    } catch (err) {
      if (mountedRef.current) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch dashboard data');
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [page]);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch with cleanup guard
    void fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    replies,
    meta,
    stats,
    loading,
    error,
    page,
    setPage,
    refresh,
  };
}
