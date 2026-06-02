'use client';

import { use, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout';
import { Button, Badge, Card, CardContent, LiveBrowserModal } from '@/components/ui';
import {
  AvailablePostsTable,
  ScheduledRepliesTable,
  CompletedRepliesTable,
} from '@/components/automation';
import { useAutomationInstance } from '@/hooks';
import { api } from '@/lib/api';
import type { AutomationStatus } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<AutomationStatus, 'success' | 'warning' | 'error'> = {
  ACTIVE: 'success',
  PAUSED: 'warning',
  OFF: 'error',
};

const statusLabels: Record<AutomationStatus, string> = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  OFF: 'Off',
};

export default function InstanceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [lastReplyError, setLastReplyError] = useState<string | null>(null);

  const {
    instance,
    posts,
    postsMeta,
    completedReplies,
    completedMeta,
    scheduledReplies,
    scheduledMeta,
    loading,
    postsLoading,
    replying,
    error,
    refresh,
    setPostsPage,
    setCompletedPage,
    setScheduledPage,
    startStreamingReply,
    onStreamingReplyComplete,
    scheduleReply,
    cancelScheduled,
    updateInstance,
  } = useAutomationInstance(id);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this instance?')) return;
    setDeleting(true);
    try {
      await api.automation.instances.delete(id);
      router.push('/automation');
    } catch {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: AutomationStatus) => {
    setStatusChanging(true);
    try {
      await updateInstance({ status: newStatus });
    } finally {
      setStatusChanging(false);
    }
  };

  const handleReply = async (matchId: string) => {
    setLastReplyError(null);
    const actionId = await startStreamingReply(matchId);
    if (actionId) {
      setActiveActionId(actionId);
    }
  };

  const handleModalClose = useCallback(() => {
    setActiveActionId(null);
  }, []);

  const handleModalComplete = useCallback(async (success: boolean, errorMessage: string | null) => {
    await onStreamingReplyComplete(success);
    if (!success && errorMessage) {
      setLastReplyError(errorMessage);
    }
  }, [onStreamingReplyComplete]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Instance not found
        </h3>
        <Link href="/automation" className="text-primary hover:underline">
          Back to Automation
        </Link>
      </div>
    );
  }

  return (
    <div>
      <LiveBrowserModal
        actionId={activeActionId}
        onClose={handleModalClose}
        onComplete={handleModalComplete}
        title="Reply in Progress"
      />

      <Header
        title={instance.title}
        description={instance.description ?? undefined}
        actions={
          <div className="flex items-center gap-2">
            {instance.status === 'ACTIVE' ? (
              <Button
                variant="secondary"
                onClick={() => handleStatusChange('PAUSED')}
                loading={statusChanging}
              >
                Pause
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => handleStatusChange('ACTIVE')}
                loading={statusChanging}
              >
                Activate
              </Button>
            )}
            <Link href={`/automation/${id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
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

      {lastReplyError && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          Reply failed: {lastReplyError}
          <button
            onClick={() => setLastReplyError(null)}
            className="ml-2 text-destructive underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <Badge variant={statusColors[instance.status]}>
              {statusLabels[instance.status]}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Account</div>
            <div className="font-medium">u/{instance.accountUsername}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Replies/Day</div>
            <div className="font-medium">{instance.repliesPerDay}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-2">Subreddits</div>
          <div className="flex flex-wrap gap-2">
            {instance.subreddits.map((sub) => (
              <span
                key={sub}
                className="px-2 py-1 bg-muted text-foreground rounded text-sm"
              >
                r/{sub}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Available Posts
          </h2>
          <Card>
            <CardContent className="p-4">
              <AvailablePostsTable
                posts={posts}
                meta={postsMeta}
                loading={postsLoading}
                replying={replying}
                onPageChange={setPostsPage}
                onReply={handleReply}
                onSchedule={scheduleReply}
              />
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Scheduled Replies
          </h2>
          <Card>
            <CardContent className="p-4">
              <ScheduledRepliesTable
                scheduled={scheduledReplies}
                meta={scheduledMeta}
                onPageChange={setScheduledPage}
                onCancel={cancelScheduled}
              />
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Completed Replies
          </h2>
          <Card>
            <CardContent className="p-4">
              <CompletedRepliesTable
                replies={completedReplies}
                meta={completedMeta}
                onPageChange={setCompletedPage}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
