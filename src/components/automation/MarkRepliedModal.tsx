'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import type { AvailablePost } from '@/lib/types';

interface MarkRepliedModalProps {
  post: AvailablePost;
  onClose: () => void;
  onMarkReplied: (replyUrl: string) => Promise<void>;
}

function isRedditUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('reddit.com');
  } catch {
    return false;
  }
}

export function MarkRepliedModal({ post, onClose, onMarkReplied }: MarkRepliedModalProps) {
  const [replyUrl, setReplyUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRedditUrl(replyUrl)) {
      setError('Please enter a valid Reddit URL');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onMarkReplied(replyUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as replied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Mark As Replied
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {post.title}
          </p>

          {error && (
            <div className="mb-4 rounded border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="replyUrl"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Reply URL
              </label>
              <Input
                id="replyUrl"
                type="url"
                value={replyUrl}
                onChange={(e) => setReplyUrl(e.target.value)}
                placeholder="https://www.reddit.com/r/.../comments/..."
                required
              />
              <p className="mt-1 text-sm text-muted-foreground">
                Paste the URL of your reply comment on Reddit
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Mark As Replied
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
