'use client';

import { ExternalLink } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from '@/components/ui';
import type { F5botMatch } from '@/lib/types';

interface F5botTableProps {
  matches: F5botMatch[];
  loading?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function getRatingVariant(rating: number | null): 'success' | 'warning' | 'error' | 'default' {
  if (rating === null) return 'default';
  if (rating >= 7) return 'success';
  if (rating >= 4) return 'warning';
  return 'error';
}

export function F5botTable({ matches, loading }: F5botTableProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="ml-2 text-muted-foreground">Loading matches...</span>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No matches found</p>
          <p className="text-sm mt-1">Try adjusting your filters or sync the mailbox for new matches.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Subreddit</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>
                <Badge variant="info">{match.keyword}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={match.sourceType === 'POST' ? 'default' : 'warning'}>
                  {match.sourceType}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">r/{match.subreddit}</TableCell>
              <TableCell className="max-w-xs">
                <span title={match.title}>{truncate(match.title, 50)}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">u/{match.author}</TableCell>
              <TableCell>
                {match.rating !== null ? (
                  <Badge variant={getRatingVariant(match.rating)}>{match.rating}/10</Badge>
                ) : (
                  <span className="text-muted-foreground/70">-</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                {formatDate(match.createdAt)}
              </TableCell>
              <TableCell>
                <a
                  href={match.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  View
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
