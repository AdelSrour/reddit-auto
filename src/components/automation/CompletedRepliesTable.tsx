'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Pagination,
} from '@/components/ui';
import type { AutomationReply, PaginationMeta } from '@/lib/types';

interface CompletedRepliesTableProps {
  replies: AutomationReply[];
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

export function CompletedRepliesTable({
  replies,
  meta,
  onPageChange,
}: CompletedRepliesTableProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  if (replies.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No completed replies yet
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subreddit</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reply URL</TableHead>
            <TableHead>Completed At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {replies.map((reply) => (
            <TableRow key={reply.id}>
              <TableCell>r/{reply.subreddit}</TableCell>
              <TableCell>
                <a
                  href={reply.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary line-clamp-1"
                  title={reply.title}
                >
                  {reply.title}
                </a>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    reply.status === 'COMPLETED'
                      ? 'success'
                      : reply.status === 'FAILED'
                        ? 'error'
                        : 'warning'
                  }
                >
                  {reply.status}
                </Badge>
              </TableCell>
              <TableCell>
                {reply.replyUrl ? (
                  <a
                    href={reply.replyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View Reply
                  </a>
                ) : (
                  <span className="text-muted-foreground/70">-</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(reply.completedAt)}
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
    </div>
  );
}
