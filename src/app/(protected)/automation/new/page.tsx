'use client';

import { Header } from '@/components/layout';
import { InstanceForm } from '@/components/automation';
import { useInstanceForm } from '@/hooks';

export default function NewInstancePage() {
  const { availableAccounts, availableSubreddits, loading, error } =
    useInstanceForm();

  return (
    <div>
      <Header
        title="Create Automation Instance"
        description="Set up a new automation instance for a Reddit account"
      />

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : availableAccounts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            No available accounts
          </h3>
          <p className="text-muted-foreground">
            All accounts already have automation instances. Create a new account
            or delete an existing instance first.
          </p>
        </div>
      ) : (
        <InstanceForm
          availableAccounts={availableAccounts}
          availableSubreddits={availableSubreddits}
          mode="create"
        />
      )}
    </div>
  );
}
