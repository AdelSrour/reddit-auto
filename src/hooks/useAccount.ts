'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type { Account, ActionLog, ActionStartResponse } from '@/lib/types';

interface UseAccountReturn {
  account: Account | null;
  logs: ActionLog[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  executeLogin: () => Promise<ActionStartResponse>;
  executeRegister: () => Promise<ActionStartResponse>;
}

export function useAccount(id: string): UseAccountReturn {
  const [account, setAccount] = useState<Account | null>(null);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [accountData, logsData] = await Promise.all([
        api.accounts.get(id),
        api.accounts.getLogs(id),
      ]);
      if (mountedRef.current) {
        setAccount(accountData);
        setLogs(logsData);
      }
    } catch (err) {
      if (mountedRef.current) {
        if (err instanceof ApiError) {
          setError(`Failed to load account: ${err.message}`);
        } else {
          setError('Failed to load account');
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch with cleanup guard
    void fetchAccount();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchAccount]);

  const executeLogin = useCallback(async (): Promise<ActionStartResponse> => {
    return api.actions.login(id);
  }, [id]);

  const executeRegister = useCallback(async (): Promise<ActionStartResponse> => {
    return api.actions.register(id);
  }, [id]);

  return {
    account,
    logs,
    loading,
    error,
    refresh: fetchAccount,
    executeLogin,
    executeRegister,
  };
}
