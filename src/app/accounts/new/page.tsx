'use client';

import { Header } from '@/components/layout';
import { AccountForm } from '@/components/accounts';
import { api } from '@/lib/api';
import type { CreateAccountInput } from '@/lib/types';

export default function NewAccountPage() {
  const handleSubmit = async (data: CreateAccountInput) => {
    await api.accounts.create(data);
  };

  return (
    <div>
      <Header
        title="Add Account"
        description="Add a new Reddit account to manage"
      />

      <div className="max-w-2xl">
        <AccountForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
