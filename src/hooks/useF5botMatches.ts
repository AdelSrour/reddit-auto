'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type {
  F5botMatch,
  F5botQueryParams,
  F5botSyncResult,
  F5botRateResult,
  SubredditFetchRulesResult,
  PaginationMeta,
} from '@/lib/types';

interface UseF5botMatchesReturn {
  matches: F5botMatch[];
  meta: PaginationMeta | null;
  loading: boolean;
  syncing: boolean;
  rating: boolean;
  fetchingRules: boolean;
  error: string | null;
  syncResult: F5botSyncResult | null;
  rateResult: F5botRateResult | null;
  fetchRulesResult: SubredditFetchRulesResult | null;
  params: F5botQueryParams;
  setParams: (params: F5botQueryParams) => void;
  setPage: (page: number) => void;
  sync: () => Promise<void>;
  rate: () => Promise<void>;
  fetchRules: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useF5botMatches(initialParams?: F5botQueryParams): UseF5botMatchesReturn {
  const [matches, setMatches] = useState<F5botMatch[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [rating, setRating] = useState(false);
  const [fetchingRules, setFetchingRules] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<F5botSyncResult | null>(null);
  const [rateResult, setRateResult] = useState<F5botRateResult | null>(null);
  const [fetchRulesResult, setFetchRulesResult] =
    useState<SubredditFetchRulesResult | null>(null);
  const [params, setParams] = useState<F5botQueryParams>(initialParams ?? { page: 1, limit: 20 });
  const mountedRef = useRef(true);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.f5bot.list(params);
      if (mountedRef.current) {
        setMatches(response.data);
        setMeta(response.meta);
      }
    } catch (err) {
      if (mountedRef.current) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch matches');
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
    void fetchMatches();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchMatches]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const sync = useCallback(async () => {
    setSyncing(true);
    setSyncResult(null);
    setRateResult(null);
    setFetchRulesResult(null);
    setError(null);
    try {
      const result = await api.f5bot.sync();
      setSyncResult(result);
      await fetchMatches();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to sync mailbox');
      }
    } finally {
      setSyncing(false);
    }
  }, [fetchMatches]);

  const rate = useCallback(async () => {
    setRating(true);
    setRateResult(null);
    setSyncResult(null);
    setFetchRulesResult(null);
    setError(null);
    try {
      const result = await api.f5bot.rate();
      setRateResult(result);
      await fetchMatches();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to rate matches');
      }
    } finally {
      setRating(false);
    }
  }, [fetchMatches]);

  const fetchRules = useCallback(async () => {
    setFetchingRules(true);
    setFetchRulesResult(null);
    setSyncResult(null);
    setRateResult(null);
    setError(null);
    try {
      const result = await api.subreddits.fetchRules();
      setFetchRulesResult(result);
      await fetchMatches();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch subreddit rules');
      }
    } finally {
      setFetchingRules(false);
    }
  }, [fetchMatches]);

  const refresh = useCallback(async () => {
    await fetchMatches();
  }, [fetchMatches]);

  return {
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
    refresh,
  };
}
