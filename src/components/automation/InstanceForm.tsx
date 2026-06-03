'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardContent, Select } from '@/components/ui';
import { api, ApiError } from '@/lib/api';
import type { AutomationInstance, AvailableAccount } from '@/lib/types';

interface InstanceFormProps {
  instance?: AutomationInstance;
  availableAccounts: AvailableAccount[];
  mode: 'create' | 'edit';
}

export function InstanceForm({
  instance,
  availableAccounts,
  mode,
}: InstanceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(instance?.title ?? '');
  const [description, setDescription] = useState(instance?.description ?? '');
  const [accountId, setAccountId] = useState(instance?.accountId ?? '');
  const [repliesPerDay, setRepliesPerDay] = useState(
    instance?.repliesPerDay ?? 5
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        await api.automation.instances.create({
          title,
          description: description || undefined,
          accountId,
          repliesPerDay,
        });
        router.push('/automation');
      } else if (instance) {
        await api.automation.instances.update(instance.id, {
          title,
          description: description || undefined,
          repliesPerDay,
        });
        router.push(`/automation/${instance.id}`);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to save instance');
      }
    } finally {
      setLoading(false);
    }
  };

  const accountOptions = availableAccounts.map((acc) => ({
    value: acc.id,
    label: `u/${acc.username}`,
  }));

  if (mode === 'edit' && instance) {
    accountOptions.unshift({
      value: instance.accountId,
      label: `u/${instance.accountUsername}`,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Title *
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Automation Instance"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Description
            </label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div>
            <label
              htmlFor="account"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Account *
            </label>
            <Select
              id="account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              options={accountOptions}
              placeholder="Select an account"
              required
              disabled={mode === 'edit'}
            />
            {mode === 'edit' && (
              <p className="mt-1 text-sm text-muted-foreground">
                Account cannot be changed after creation
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="repliesPerDay"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Replies per Day
            </label>
            <Input
              id="repliesPerDay"
              type="number"
              min={1}
              max={100}
              value={repliesPerDay}
              onChange={(e) => setRepliesPerDay(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!title || !accountId || loading}
            >
              {mode === 'create' ? 'Create Instance' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
