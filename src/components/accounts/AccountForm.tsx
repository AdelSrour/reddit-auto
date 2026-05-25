'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardContent } from '@/components/ui';
import type { Account, CreateAccountInput, UpdateAccountInput } from '@/lib/types';

type AccountFormSubmitData = CreateAccountInput & Partial<UpdateAccountInput>;

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: AccountFormSubmitData) => Promise<void>;
  isEdit?: boolean;
}

export function AccountForm({
  account,
  onSubmit,
  isEdit = false,
}: AccountFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: account?.username ?? '',
    password: '',
    proxyHost: account?.proxyHost ?? '',
    proxyPort: account?.proxyPort?.toString() ?? '',
    proxyUsername: account?.proxyUsername ?? '',
    proxyPassword: account?.proxyPassword ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data: AccountFormSubmitData = {
        username: formData.username,
        password: formData.password || '',
        ...(formData.proxyHost && { proxyHost: formData.proxyHost }),
        ...(formData.proxyPort && { proxyPort: parseInt(formData.proxyPort, 10) }),
        ...(formData.proxyUsername && { proxyUsername: formData.proxyUsername }),
        ...(formData.proxyPassword && { proxyPassword: formData.proxyPassword }),
      };

      await onSubmit(data);
      router.push('/accounts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">
          {isEdit ? 'Edit Account' : 'Add New Account'}
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">
              Reddit Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required={!isEdit}
                placeholder="Reddit username"
              />
              <Input
                label={isEdit ? 'New Password (optional)' : 'Password'}
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!isEdit}
                placeholder="Reddit password"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">
              Proxy Configuration (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Proxy Host"
                value={formData.proxyHost}
                onChange={(e) =>
                  setFormData({ ...formData, proxyHost: e.target.value })
                }
                placeholder="proxy.example.com"
              />
              <Input
                label="Proxy Port"
                type="number"
                value={formData.proxyPort}
                onChange={(e) =>
                  setFormData({ ...formData, proxyPort: e.target.value })
                }
                placeholder="1080"
              />
              <Input
                label="Proxy Username"
                value={formData.proxyUsername}
                onChange={(e) =>
                  setFormData({ ...formData, proxyUsername: e.target.value })
                }
                placeholder="Optional"
              />
              <Input
                label="Proxy Password"
                type="password"
                value={formData.proxyPassword}
                onChange={(e) =>
                  setFormData({ ...formData, proxyPassword: e.target.value })
                }
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/accounts')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create Account'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
