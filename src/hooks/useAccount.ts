'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/lib/api';
import type { Account, ActionLog, ActionResult } from '@/lib/types';

interface UseAccountReturn {
  account: Account | null;
  logs: ActionLog[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  executeLogin: () => Promise<ActionResult>;
  executeRegister: () => Promise<ActionResult>;
}

export function useAccount(id: string): UseAccountReturn {
  const [account, setAccount] = useState<Account | null>(null);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [accountData, logsData] = await Promise.all([
        api.accounts.get(id),
        api.accounts.getLogs(id),
      ]);
      setAccount(accountData);
      setLogs(logsData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to load account: ${err.message}`);
      } else {
        setError('Failed to load account');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchAccount();
  }, [fetchAccount]);

  const executeLogin = useCallback(async (): Promise<ActionResult> => {
    const result = await api.actions.login(id);
    await fetchAccount();
    return result;
  }, [id, fetchAccount]);

  const executeRegister = useCallback(async (): Promise<ActionResult> => {
    const result = await api.actions.register(id);
    await fetchAccount();
    return result;
  }, [id, fetchAccount]);

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
