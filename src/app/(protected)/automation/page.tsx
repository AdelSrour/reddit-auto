'use client';

import Link from 'next/link';
import { Bot, Plus } from 'lucide-react';
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
            <Button>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Instance
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
          <button
            onClick={refresh}
            className="ml-2 text-destructive underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : instances.length === 0 ? (
        <div className="py-12 text-center">
          <Bot className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <h3 className="mb-2 text-lg font-medium text-foreground">
            No automation instances yet
          </h3>
          <p className="mb-4 text-muted-foreground">
            Create your first automation instance to get started
          </p>
          <Link href="/automation/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Instance
            </Button>
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
