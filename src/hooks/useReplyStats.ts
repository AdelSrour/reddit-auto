'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type { ReplyStats } from '@/lib/types';

interface UseReplyStatsReturn {
  stats: ReplyStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useReplyStats(): UseReplyStatsReturn {
  const [stats, setStats] = useState<ReplyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.automation.getReplyStats();
      if (mountedRef.current) {
        setStats(response);
      }
    } catch (err) {
      if (mountedRef.current) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch reply stats');
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch with cleanup guard
    void fetchStats();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchStats]);

  const refresh = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}
