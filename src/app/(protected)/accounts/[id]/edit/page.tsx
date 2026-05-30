'use client';

import { use } from 'react';
import { Header } from '@/components/layout';
import { AccountForm } from '@/components/accounts';
import { useAccount } from '@/hooks';
import { api } from '@/lib/api';
import type { UpdateAccountInput } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditAccountPage({ params }: PageProps) {
  const { id } = use(params);
  const { account, loading, error } = useAccount(id);

  const handleSubmit = async (data: UpdateAccountInput) => {
    await api.accounts.update(id, data);
  };

  if (loading) {
    return (
      <div>
        <Header title="Edit Account" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div>
        <Header title="Edit Account" />
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error ?? 'Account not found'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={`Edit ${account.username}`}
        description="Update account details and proxy configuration"
      />

      <div className="max-w-2xl">
        <AccountForm account={account} onSubmit={handleSubmit} isEdit />
      </div>
    </div>
  );
}
