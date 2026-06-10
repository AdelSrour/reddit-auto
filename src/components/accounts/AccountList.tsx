'use client';

import Link from 'next/link';
import { Eye, Pencil, Trash2, Users } from 'lucide-react';
import { Account } from '@/lib/types';
import { Badge } from '@/components/ui';

interface AccountListProps {
  accounts: Account[];
  onDelete: (id: string) => void;
}

export function AccountList({ accounts, onDelete }: AccountListProps) {
  if (accounts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card py-12 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">No accounts yet.</p>
        <Link
          href="/accounts/new"
          className="mt-2 inline-block text-primary hover:text-primary/80"
        >
          Add your first account
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              GoLogin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Proxy
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {accounts.map((account) => (
            <tr key={account.id} className="hover:bg-muted">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/accounts/${account.id}`}
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  {account.username}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  {account.isBanned ? (
                    <Badge variant="error">Banned</Badge>
                  ) : (
                    <Badge variant={account.isActive ? 'success' : 'warning'}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={account.gologinProfileId ? 'success' : 'warning'}>
                  {account.gologinProfileId ? 'Linked' : 'Not Linked'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {account.proxyHost
                  ? `${account.proxyHost}:${account.proxyPort}`
                  : 'None'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {account.lastLoginAt
                  ? new Date(account.lastLoginAt).toLocaleDateString()
                  : 'Never'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/accounts/${account.id}`}
                  className="mr-4 inline-flex items-center gap-1 text-primary hover:text-primary/80"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  View
                </Link>
                <Link
                  href={`/accounts/${account.id}/edit`}
                  className="mr-4 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(account.id)}
                  className="inline-flex items-center gap-1 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
