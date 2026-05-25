'use client';

import Link from 'next/link';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui';
import { AccountList } from '@/components/accounts';
import { useAccounts } from '@/hooks';

export default function AccountsPage() {
  const { accounts, loading, error, deleteAccount } = useAccounts();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete account');
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Accounts" description="Manage your Reddit accounts" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Accounts" description="Manage your Reddit accounts" />
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Accounts"
        description="Manage your Reddit accounts"
        actions={
          <Link href="/accounts/new">
            <Button>Add Account</Button>
          </Link>
        }
      />

      <AccountList accounts={accounts} onDelete={handleDelete} />
    </div>
  );
}
