'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/lib/api';
import type { Account, CreateAccountInput, UpdateAccountInput } from '@/lib/types';

interface UseAccountsReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createAccount: (data: CreateAccountInput) => Promise<Account>;
  updateAccount: (id: string, data: UpdateAccountInput) => Promise<Account>;
  deleteAccount: (id: string) => Promise<void>;
}

export function useAccounts(): UseAccountsReturn {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.accounts.list();
      setAccounts(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to load accounts: ${err.message}`);
      } else {
        setError('Failed to load accounts');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const createAccount = useCallback(
    async (data: CreateAccountInput): Promise<Account> => {
      const account = await api.accounts.create(data);
      setAccounts((prev) => [account, ...prev]);
      return account;
    },
    [],
  );

  const updateAccount = useCallback(
    async (id: string, data: UpdateAccountInput): Promise<Account> => {
      const account = await api.accounts.update(id, data);
      setAccounts((prev) =>
        prev.map((a) => (a.id === id ? account : a)),
      );
      return account;
    },
    [],
  );

  const deleteAccount = useCallback(async (id: string): Promise<void> => {
    await api.accounts.delete(id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    accounts,
    loading,
    error,
    refresh: fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}
