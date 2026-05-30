'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Accounts" description="Manage your Reddit accounts" />
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
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
            <Button>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Add Account
            </Button>
          </Link>
        }
      />

      <AccountList accounts={accounts} onDelete={handleDelete} />
    </div>
  );
}
