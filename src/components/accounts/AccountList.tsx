'use client';

import Link from 'next/link';
import { Account } from '@/lib/types';
import { Badge } from '@/components/ui';

interface AccountListProps {
  accounts: Account[];
  onDelete: (id: string) => void;
}

export function AccountList({ accounts, onDelete }: AccountListProps) {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No accounts yet.</p>
        <Link
          href="/accounts/new"
          className="mt-2 inline-block text-blue-600 hover:text-blue-700"
        >
          Add your first account
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proxy
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr key={account.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/accounts/${account.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {account.username}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={account.isActive ? 'success' : 'error'}>
                  {account.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {account.proxyHost
                  ? `${account.proxyHost}:${account.proxyPort}`
                  : 'None'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {account.lastLoginAt
                  ? new Date(account.lastLoginAt).toLocaleDateString()
                  : 'Never'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/accounts/${account.id}`}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  View
                </Link>
                <Link
                  href={`/accounts/${account.id}/edit`}
                  className="text-gray-600 hover:text-gray-900 mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(account.id)}
                  className="text-red-600 hover:text-red-900"
                >
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
