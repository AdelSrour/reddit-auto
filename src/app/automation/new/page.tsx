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
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : availableAccounts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No available accounts
          </h3>
          <p className="text-gray-500">
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
