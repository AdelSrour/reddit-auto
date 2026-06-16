'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui';
import type { ReplyHistoryEntry } from '@/lib/types';
import { ExternalLink } from 'lucide-react';
import { TileHealthMentionBadge } from '@/components/automation/TileHealthMentionBadge';

interface ReplyHistoryTableProps {
  entries: ReplyHistoryEntry[];
  isLoading: boolean;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function formatStat(value: number | null): string {
  return value === null ? '-' : value.toLocaleString();
}

function LoadingSkeleton(): React.ReactNode {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

export function ReplyHistoryTable({
  entries,
  isLoading,
}: ReplyHistoryTableProps): React.ReactNode {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Recent Successful Replies</h2>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No reply history found</p>
            <p className="text-xs mt-1">
              Completed replies are archived here permanently
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Account</TableHead>
                  <TableHead className="w-[120px]">Subreddit</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead className="hidden md:table-cell">Reply Preview</TableHead>
                  <TableHead className="w-[110px]">Tile Health</TableHead>
                  <TableHead className="w-[70px] text-right">Views</TableHead>
                    <TableHead className="w-[70px] text-right">Upvotes</TableHead>
                    <TableHead className="w-[70px] text-right">Replies</TableHead>
                    <TableHead className="w-[80px]">Time</TableHead>
                  <TableHead className="w-[80px] text-right">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">{entry.accountUsername}</TableCell>
                    <TableCell>
                      <Badge variant="info">r/{entry.subreddit}</Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary line-clamp-1 text-sm"
                        title={entry.title}
                      >
                        {truncateText(entry.title, 50)}
                      </a>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({entry.sourceType})
                      </span>
                    </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p
                          className="text-sm text-muted-foreground line-clamp-1"
                          title={entry.replyText}
                        >
                          {truncateText(entry.replyText, 60)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <TileHealthMentionBadge
                          mentionsTileHealth={entry.mentionsTileHealth}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground text-right">
                        {formatStat(entry.views)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground text-right">
                        {formatStat(entry.upvotes)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground text-right">
                        {formatStat(entry.replies)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                      {formatRelativeTime(entry.completedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.replyUrl ? (
                        <a
                          href={entry.replyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary/80"
                          title="View reply on Reddit"
                        >
                          <ExternalLink size={16} />
                        </a>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
