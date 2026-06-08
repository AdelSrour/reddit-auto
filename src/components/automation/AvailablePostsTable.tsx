'use client';

import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Badge,
  Pagination,
} from '@/components/ui';
import { ScheduleModal } from './ScheduleModal';
import { MarkRepliedModal } from './MarkRepliedModal';
import type { AvailablePost, PaginationMeta } from '@/lib/types';

interface AvailablePostsTableProps {
  posts: AvailablePost[];
  meta: PaginationMeta | null;
  loading: boolean;
  replying: boolean;
  markingReplied: boolean;
  onPageChange: (page: number) => void;
  onReply: (matchId: string) => Promise<void>;
  onSchedule: (matchId: string, delayMinutes: number) => Promise<void>;
  onMarkReplied: (matchId: string, replyUrl: string) => Promise<void>;
}

export function AvailablePostsTable({
  posts,
  meta,
  loading,
  replying,
  markingReplied,
  onPageChange,
  onReply,
  onSchedule,
  onMarkReplied,
}: AvailablePostsTableProps) {
  const [scheduleModalPost, setScheduleModalPost] = useState<AvailablePost | null>(null);
  const [markRepliedModalPost, setMarkRepliedModalPost] = useState<AvailablePost | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const handleReply = async (post: AvailablePost) => {
    setReplyingId(post.id);
    try {
      await onReply(post.id);
    } finally {
      setReplyingId(null);
    }
  };

  const handleSchedule = async (delayMinutes: number) => {
    if (!scheduleModalPost) return;
    await onSchedule(scheduleModalPost.id, delayMinutes);
    setScheduleModalPost(null);
  };

  const handleMarkReplied = async (replyUrl: string) => {
    if (!markRepliedModalPost) return;
    await onMarkReplied(markRepliedModalPost.id, replyUrl);
    setMarkRepliedModalPost(null);
  };

  const actionsDisabled = replying || markingReplied;

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No available posts to reply to
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subreddit</TableHead>
            <TableHead>Subreddit Score</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Match Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <a
                  href={`https://reddit.com/r/${post.subreddit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  r/{post.subreddit}
                </a>
              </TableCell>
              <TableCell>
                {post.postingEaseRating !== null ? (
                  <span
                    className={`font-medium ${
                      post.postingEaseRating >= 7
                        ? 'text-green-600'
                        : post.postingEaseRating >= 4
                          ? 'text-yellow-600'
                          : 'text-destructive'
                    }`}
                  >
                    {post.postingEaseRating}/10
                  </span>
                ) : (
                  <span className="text-muted-foreground/70">-</span>
                )}
              </TableCell>
              <TableCell className="max-w-xs overflow-hidden">
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-foreground hover:text-primary"
                  title={post.title}
                >
                  {post.title}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={post.sourceType === 'POST' ? 'default' : 'info'}>
                  {post.sourceType}
                </Badge>
              </TableCell>
              <TableCell>
                <a
                  href={`https://reddit.com/u/${post.author}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  u/{post.author}
                </a>
              </TableCell>
              <TableCell>
                {post.rating !== null ? (
                  <span
                    className={`font-medium ${
                      post.rating >= 7
                        ? 'text-green-600'
                        : post.rating >= 4
                          ? 'text-yellow-600'
                          : 'text-destructive'
                    }`}
                  >
                    {post.rating}/10
                  </span>
                ) : (
                  <span className="text-muted-foreground/70">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReply(post)}
                    loading={replyingId === post.id}
                    disabled={actionsDisabled}
                  >
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setScheduleModalPost(post)}
                    disabled={actionsDisabled}
                  >
                    Schedule
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setMarkRepliedModalPost(post)}
                    disabled={actionsDisabled}
                  >
                    Mark As Replied
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {meta && meta.totalPages > 1 && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={onPageChange}
        />
      )}

      {scheduleModalPost && (
        <ScheduleModal
          post={scheduleModalPost}
          onClose={() => setScheduleModalPost(null)}
          onSchedule={handleSchedule}
        />
      )}

      {markRepliedModalPost && (
        <MarkRepliedModal
          post={markRepliedModalPost}
          onClose={() => setMarkRepliedModalPost(null)}
          onMarkReplied={handleMarkReplied}
        />
      )}
    </div>
  );
}
