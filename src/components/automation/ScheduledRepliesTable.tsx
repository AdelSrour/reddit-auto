'use client';

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
import type { ScheduledReply, PaginationMeta } from '@/lib/types';

interface ScheduledRepliesTableProps {
  scheduled: ScheduledReply[];
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onCancel: (id: string) => Promise<void>;
}

export function ScheduledRepliesTable({
  scheduled,
  meta,
  onPageChange,
  onCancel,
}: ScheduledRepliesTableProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getTimeUntil = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    if (diffMs <= 0) return 'Due now';

    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `in ${diffMins}m`;

    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `in ${diffHours}h ${remainingMins}m`;
  };

  if (scheduled.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        No scheduled replies
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
            <TableHead>Scheduled For</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduled.map((item) => (
            <TableRow key={item.id}>
              <TableCell>r/{item.subreddit}</TableCell>
              <TableCell>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-blue-600 line-clamp-1"
                  title={item.title}
                >
                  {item.title}
                </a>
              </TableCell>
              <TableCell>
                <div>
                  <div className="text-sm">{formatDate(item.scheduledAt)}</div>
                  <div className="text-xs text-gray-500">
                    {getTimeUntil(item.scheduledAt)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === 'PENDING'
                      ? 'warning'
                      : item.status === 'PROCESSING'
                        ? 'info'
                        : 'default'
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {item.status === 'PENDING' && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onCancel(item.id)}
                  >
                    Cancel
                  </Button>
                )}
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
