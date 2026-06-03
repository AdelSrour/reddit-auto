'use client';

import { Input, Select } from '@/components/ui';
import type { F5botQueryParams, F5botSourceType } from '@/lib/types';

interface F5botFiltersProps {
  params: F5botQueryParams;
  onParamsChange: (params: F5botQueryParams) => void;
}

const SOURCE_TYPE_OPTIONS = [
  { value: 'POST', label: 'Posts' },
  { value: 'COMMENT', label: 'Comments' },
];

const RATING_OPTIONS = [
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
  { value: '6', label: '6+' },
  { value: '7', label: '7+' },
  { value: '8', label: '8+' },
  { value: '9', label: '9+' },
  { value: '10', label: '10' },
];

export function F5botFilters({ params, onParamsChange }: F5botFiltersProps) {
  const handleChange = (key: keyof F5botQueryParams, value: string) => {
    const newParams = { ...params, page: 1 };

    if (value === '') {
      delete newParams[key];
    } else if (key === 'minRating') {
      newParams[key] = parseInt(value, 10);
    } else if (key === 'sourceType') {
      newParams[key] = value as F5botSourceType;
    } else {
      (newParams as Record<string, unknown>)[key] = value;
    }

    onParamsChange(newParams);
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input
          label="Keyword"
          placeholder="Filter by keyword"
          value={params.keyword ?? ''}
          onChange={(e) => handleChange('keyword', e.target.value)}
        />

        <Select
          label="Type"
          placeholder="All types"
          options={SOURCE_TYPE_OPTIONS}
          value={params.sourceType ?? ''}
          onChange={(e) => handleChange('sourceType', e.target.value)}
        />

        <Input
          label="Subreddit"
          placeholder="Filter by subreddit"
          value={params.subreddit ?? ''}
          onChange={(e) => handleChange('subreddit', e.target.value)}
        />

        <Select
          label="Min Rating"
          placeholder="Any rating"
          options={RATING_OPTIONS}
          value={params.minRating?.toString() ?? ''}
          onChange={(e) => handleChange('minRating', e.target.value)}
        />

        <Input
          label="From Date"
          type="date"
          value={params.fromDate ?? ''}
          onChange={(e) => handleChange('fromDate', e.target.value)}
        />
      </div>
    </div>
  );
}
