'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type { Account, ActionLog, OpenBrowserResponse } from '@/lib/types';

interface LoginResult {
  success: boolean;
  message?: string;
}

interface UseAccountReturn {
  account: Account | null;
  logs: ActionLog[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  verifyLogin: () => Promise<LoginResult>;
  openBrowser: () => Promise<OpenBrowserResponse>;
}

function waitForActionCompletion(actionId: string): Promise<LoginResult> {
  return new Promise((resolve) => {
    const eventSource = new EventSource(`/api/action-stream/${actionId}`);

    const cleanup = () => {
      eventSource.close();
    };

    eventSource.addEventListener('complete', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { success: boolean; error?: string };
        cleanup();
        resolve({
          success: data.success,
          message: data.error,
        });
      } catch {
        cleanup();
        resolve({ success: false, message: 'Failed to parse result' });
      }
    });

    eventSource.addEventListener('error', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { error: string };
        cleanup();
        resolve({ success: false, message: data.error });
      } catch {
        cleanup();
        resolve({ success: false, message: 'Action failed' });
      }
    });

    eventSource.onerror = () => {
      cleanup();
      resolve({ success: false, message: 'Connection lost' });
    };

    setTimeout(() => {
      cleanup();
      resolve({ success: false, message: 'Verification timed out' });
    }, 120000);
  });
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

  const verifyLogin = useCallback(async (): Promise<LoginResult> => {
    const { actionId } = await api.actions.login(id);
    return waitForActionCompletion(actionId);
  }, [id]);

  const openBrowser = useCallback(async (): Promise<OpenBrowserResponse> => {
    return api.accounts.openBrowser(id);
  }, [id]);

  return {
    account,
    logs,
    loading,
    error,
    refresh: fetchAccount,
    verifyLogin,
    openBrowser,
  };
}
