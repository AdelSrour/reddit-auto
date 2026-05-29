'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import type { AvailablePost } from '@/lib/types';

interface ScheduleModalProps {
  post: AvailablePost;
  onClose: () => void;
  onSchedule: (delayMinutes: number) => Promise<void>;
}

export function ScheduleModal({ post, onClose, onSchedule }: ScheduleModalProps) {
  const [delayMinutes, setDelayMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSchedule(delayMinutes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Schedule Reply
          </h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {post.title}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="delay"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reply in (minutes)
              </label>
              <Input
                id="delay"
                type="number"
                min={1}
                max={1440}
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Number(e.target.value))}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {delayMinutes >= 60
                  ? `${Math.floor(delayMinutes / 60)}h ${delayMinutes % 60}m from now`
                  : `${delayMinutes} minutes from now`}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Schedule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
