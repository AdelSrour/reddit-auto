'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type { AvailableAccount } from '@/lib/types';

interface UseInstanceFormReturn {
  availableAccounts: AvailableAccount[];
  loading: boolean;
  error: string | null;
}

export function useInstanceForm(): UseInstanceFormReturn {
  const [availableAccounts, setAvailableAccounts] = useState<AvailableAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accounts = await api.automation.availableAccounts();
      if (mountedRef.current) {
        setAvailableAccounts(accounts);
      }
    } catch (err) {
      if (mountedRef.current) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load form data');
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
    void fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return {
    availableAccounts,
    loading,
    error,
  };
}
