'use client';

import { use } from 'react';
import { Header } from '@/components/layout';
import { InstanceForm } from '@/components/automation';
import { useAutomationInstance, useInstanceForm } from '@/hooks';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditInstancePage({ params }: PageProps) {
  const { id } = use(params);
  const { instance, loading: instanceLoading } = useAutomationInstance(id);
  const {
    availableAccounts,
    availableSubreddits,
    loading: formLoading,
    error,
  } = useInstanceForm();

  const loading = instanceLoading || formLoading;

  return (
    <div>
      <Header
        title="Edit Automation Instance"
        description={instance ? `Editing: ${instance.title}` : undefined}
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
      ) : !instance ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Instance not found
          </h3>
        </div>
      ) : (
        <InstanceForm
          instance={instance}
          availableAccounts={availableAccounts}
          availableSubreddits={availableSubreddits}
          mode="edit"
        />
      )}
    </div>
  );
}
