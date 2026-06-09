'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { api } from '@/lib/api';
import type { AvailablePost } from '@/lib/types';

interface MarkRepliedModalProps {
  instanceId: string;
  post: AvailablePost;
  onClose: () => void;
  onMarkReplied: (replyUrl: string, replyText: string) => Promise<void>;
}

function isRedditUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('reddit.com');
  } catch {
    return false;
  }
}

export function MarkRepliedModal({ instanceId, post, onClose, onMarkReplied }: MarkRepliedModalProps) {
  const [replyUrl, setReplyUrl] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReply = async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await api.automation.instances.generateReply(instanceId, {
        matchId: post.id,
      });
      setReplyText(result.replyText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reply');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRedditUrl(replyUrl)) {
      setError('Please enter a valid Reddit URL');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onMarkReplied(replyUrl, replyText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as replied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full mx-4">
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

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="replyText"
                  className="block text-sm font-medium text-foreground"
                >
                  Reply Text
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleGenerateReply}
                  loading={generating}
                  disabled={loading}
                >
                  Generate Reply
                </Button>
              </div>
              <textarea
                id="replyText"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Enter the reply text you posted..."
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                The text of your reply (optional, or click Generate Reply)
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} disabled={generating}>
                Mark As Replied
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
