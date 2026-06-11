'use client';

import { Input, Select } from '@/components/ui';
import type { ReplyHistoryQueryParams, ReplyHistorySortBy, SortOrder } from '@/lib/types';

interface ReplyHistoryFiltersProps {
  params: ReplyHistoryQueryParams;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onParamsChange: (params: ReplyHistoryQueryParams) => void;
}

const SORT_BY_OPTIONS: Array<{ value: ReplyHistorySortBy; label: string }> = [
  { value: 'completedAt', label: 'Date' },
  { value: 'subreddit', label: 'Subreddit' },
  { value: 'accountUsername', label: 'Account' },
  { value: 'title', label: 'Post Title' },
  { value: 'views', label: 'Views' },
  { value: 'upvotes', label: 'Upvotes' },
  { value: 'replies', label: 'Replies' },
];

const SORT_ORDER_OPTIONS: Array<{ value: SortOrder; label: string }> = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export function ReplyHistoryFilters({
  params,
  searchInput,
  onSearchChange,
  onParamsChange,
}: ReplyHistoryFiltersProps): React.ReactNode {
  const handleChange = (key: keyof ReplyHistoryQueryParams, value: string) => {
    const newParams = { ...params, page: 1 };

    if (value === '') {
      delete newParams[key];
    } else if (key === 'sortBy') {
      newParams.sortBy = value as ReplyHistorySortBy;
    } else if (key === 'sortOrder') {
      newParams.sortOrder = value as SortOrder;
    } else {
      (newParams as Record<string, unknown>)[key] = value;
    }

    onParamsChange(newParams);
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Input
          label="Search"
          placeholder="Search replies, posts, accounts..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Input
          label="Subreddit"
          placeholder="Filter by subreddit"
          value={params.subreddit ?? ''}
          onChange={(e) => handleChange('subreddit', e.target.value)}
        />

        <Input
          label="Account"
          placeholder="Filter by account"
          value={params.accountUsername ?? ''}
          onChange={(e) => handleChange('accountUsername', e.target.value)}
        />

        <Select
          label="Sort By"
          options={SORT_BY_OPTIONS}
          value={params.sortBy ?? 'completedAt'}
          onChange={(e) => handleChange('sortBy', e.target.value)}
        />

        <Select
          label="Sort Order"
          options={SORT_ORDER_OPTIONS}
          value={params.sortOrder ?? 'desc'}
          onChange={(e) => handleChange('sortOrder', e.target.value)}
        />

        <Input
          label="From Date"
          type="date"
          value={params.fromDate ?? ''}
          onChange={(e) => handleChange('fromDate', e.target.value)}
        />

        <Input
          label="To Date"
          type="date"
          value={params.toDate ?? ''}
          onChange={(e) => handleChange('toDate', e.target.value)}
        />
      </div>
    </div>
  );
}
