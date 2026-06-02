'use client';

import { use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Button, Card, CardHeader, CardContent, Badge } from '@/components/ui';
import { AccountActions } from '@/components/accounts';
import { useAccount } from '@/hooks';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AccountDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { account, logs, loading, error, refresh, executeLogin, executeRegister } =
    useAccount(id);

  if (loading) {
    return (
      <div>
        <Header title="Account Details" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div>
        <Header title="Account Details" />
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error ?? 'Account not found'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={account.username}
        description="Account details and actions"
        actions={
          <div className="flex gap-3">
            <Link href={`/accounts/${id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link href="/accounts">
              <Button variant="ghost">Back to Accounts</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-foreground">
                Account Info
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">Username</dt>
                <dd className="text-sm font-medium text-foreground">
                  {account.username}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd>
                  <Badge variant={account.isActive ? 'success' : 'error'}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Proxy</dt>
                <dd className="text-sm font-medium text-foreground">
                  {account.proxyHost
                    ? `${account.proxyHost}:${account.proxyPort}`
                    : 'None'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Last Login</dt>
                <dd className="text-sm font-medium text-foreground">
                  {account.lastLoginAt
                    ? new Date(account.lastLoginAt).toLocaleString()
                    : 'Never'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Last Action</dt>
                <dd className="text-sm font-medium text-foreground">
                  {account.lastActionAt
                    ? new Date(account.lastActionAt).toLocaleString()
                    : 'Never'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Created</dt>
                <dd className="text-sm font-medium text-foreground">
                  {new Date(account.createdAt).toLocaleString()}
                </dd>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <AccountActions
            onLogin={executeLogin}
            onRegister={executeRegister}
            onActionComplete={refresh}
            logs={logs}
          />
        </div>
      </div>
    </div>
  );
}
