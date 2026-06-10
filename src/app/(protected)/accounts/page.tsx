'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, RefreshCw, Download, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui';
import { AccountList, ImportProfilesModal } from '@/components/accounts';
import { useAccounts } from '@/hooks';
import { api } from '@/lib/api';
import type { AccountHealthCheckResult } from '@/lib/types';

export default function AccountsPage() {
  const { accounts, loading, error, deleteAccount, refresh } = useAccounts();
  const [populateLoading, setPopulateLoading] = useState(false);
  const [populateResult, setPopulateResult] = useState<string | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthResult, setHealthResult] = useState<AccountHealthCheckResult | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete account');
      }
    }
  };

  const handleCheckHealth = async () => {
    setHealthLoading(true);
    setHealthResult(null);
    setHealthError(null);
    try {
      const result = await api.accounts.checkHealth();
      setHealthResult(result);
      await refresh();
    } catch (err) {
      setHealthError(
        err instanceof Error ? err.message : 'Failed to check accounts health',
      );
    } finally {
      setHealthLoading(false);
    }
  };

  const handlePopulateProfiles = async () => {
    setPopulateLoading(true);
    setPopulateResult(null);
    try {
      const result = await api.accounts.populateProfiles();
      setPopulateResult(
        result.created > 0
          ? `Created ${result.created} GoLogin profile${result.created === 1 ? '' : 's'}`
          : 'All accounts already have GoLogin profiles'
      );
      await refresh();
    } catch (err) {
      setPopulateResult(
        err instanceof Error ? err.message : 'Failed to populate profiles'
      );
    } finally {
      setPopulateLoading(false);
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

  const hasUnlinkedAccounts = accounts.some((a) => !a.gologinProfileId);

  return (
    <div>
      <Header
        title="Accounts"
        description="Manage your Reddit accounts"
        actions={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleCheckHealth}
              loading={healthLoading}
            >
              <ShieldCheck className="mr-2 h-4 w-4" aria-hidden="true" />
              Check accounts health
            </Button>
            {hasUnlinkedAccounts && (
              <Button
                variant="secondary"
                onClick={handlePopulateProfiles}
                loading={populateLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                Populate GoLogin Profiles
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setImportModalOpen(true)}
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Import from GoLogin
            </Button>
            <Link href="/accounts/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Add Account
              </Button>
            </Link>
          </div>
        }
      />

      {healthError && (
        <div className="mb-4 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-sm text-destructive">
          {healthError}
        </div>
      )}

      {healthResult && (
        <div className="mb-4 p-3 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
          <p>
            Checked {healthResult.checked} account{healthResult.checked === 1 ? '' : 's'}
            {healthResult.skipped > 0 &&
              ` (${healthResult.skipped} already banned, skipped)`}
            : {healthResult.good} Good, {healthResult.banned} Banned
            {healthResult.errors > 0 && `, ${healthResult.errors} Error${healthResult.errors === 1 ? '' : 's'}`}
          </p>
          {healthResult.results.length > 0 && (
            <ul className="mt-2 space-y-1">
              {healthResult.results.map((item) => (
                <li key={item.accountId}>
                  {item.username} ({item.status})
                  {item.error && ` — ${item.error}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {populateResult && (
        <div className="mb-4 p-3 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
          {populateResult}
        </div>
      )}

      <AccountList accounts={accounts} onDelete={handleDelete} />

      <ImportProfilesModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={refresh}
      />
    </div>
  );
}
