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
  const {
    account,
    logs,
    loading,
    error,
    executeLogin,
    executeRegister,
    executeReplyManual,
  } = useAccount(id);

  if (loading) {
    return (
      <div>
        <Header title="Account Details" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div>
        <Header title="Account Details" />
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
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
              <h2 className="text-lg font-semibold text-gray-900">
                Account Info
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Username</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {account.username}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd>
                  <Badge variant={account.isActive ? 'success' : 'error'}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Proxy</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {account.proxyHost
                    ? `${account.proxyHost}:${account.proxyPort}`
                    : 'None'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Last Login</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {account.lastLoginAt
                    ? new Date(account.lastLoginAt).toLocaleString()
                    : 'Never'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Last Action</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {account.lastActionAt
                    ? new Date(account.lastActionAt).toLocaleString()
                    : 'Never'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm font-medium text-gray-900">
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
            onReplyManual={executeReplyManual}
            logs={logs}
          />
        </div>
      </div>
    </div>
  );
}
