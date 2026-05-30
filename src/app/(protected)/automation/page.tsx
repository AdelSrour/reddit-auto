'use client';

import Link from 'next/link';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui';
import { InstanceCard } from '@/components/automation';
import { useAutomationInstances } from '@/hooks';

export default function AutomationPage() {
  const { instances, loading, error, refresh } = useAutomationInstances();

  return (
    <div>
      <Header
        title="Automation"
        description="Manage your automation instances"
        actions={
          <Link href="/automation/new">
            <Button>Create Instance</Button>
          </Link>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button
            onClick={refresh}
            className="ml-2 text-red-600 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : instances.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No automation instances yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first automation instance to get started
          </p>
          <Link href="/automation/new">
            <Button>Create Instance</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instances.map((instance) => (
            <InstanceCard key={instance.id} instance={instance} />
          ))}
        </div>
      )}
    </div>
  );
}
