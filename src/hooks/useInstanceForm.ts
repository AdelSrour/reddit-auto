'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/lib/api';
import type { AvailableAccount } from '@/lib/types';

interface UseInstanceFormReturn {
  availableAccounts: AvailableAccount[];
  availableSubreddits: string[];
  loading: boolean;
  error: string | null;
}

export function useInstanceForm(): UseInstanceFormReturn {
  const [availableAccounts, setAvailableAccounts] = useState<AvailableAccount[]>([]);
  const [availableSubreddits, setAvailableSubreddits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accounts, subreddits] = await Promise.all([
        api.automation.availableAccounts(),
        api.automation.subreddits(),
      ]);
      setAvailableAccounts(accounts);
      setAvailableSubreddits(subreddits);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load form data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    availableAccounts,
    availableSubreddits,
    loading,
    error,
  };
}
