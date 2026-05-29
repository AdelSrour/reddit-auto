'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui';

interface SubredditSelectorProps {
  availableSubreddits: string[];
  selectedSubreddits: string[];
  onChange: (subreddits: string[]) => void;
  disabled?: boolean;
}

export function SubredditSelector({
  availableSubreddits,
  selectedSubreddits,
  onChange,
  disabled = false,
}: SubredditSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredSubreddits = useMemo(() => {
    if (!search) return availableSubreddits;
    const lowerSearch = search.toLowerCase();
    return availableSubreddits.filter((s) =>
      s.toLowerCase().includes(lowerSearch)
    );
  }, [availableSubreddits, search]);

  const handleToggle = (subreddit: string) => {
    if (disabled) return;
    if (selectedSubreddits.includes(subreddit)) {
      onChange(selectedSubreddits.filter((s) => s !== subreddit));
    } else {
      onChange([...selectedSubreddits, subreddit]);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    onChange(filteredSubreddits);
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search subreddits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
          className="flex-1"
        />
        <button
          type="button"
          onClick={handleSelectAll}
          disabled={disabled}
          className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          Select All
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          disabled={disabled}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      {selectedSubreddits.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSubreddits.map((subreddit) => (
            <span
              key={subreddit}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              r/{subreddit}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleToggle(subreddit)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
        {filteredSubreddits.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No subreddits found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredSubreddits.map((subreddit) => {
              const isSelected = selectedSubreddits.includes(subreddit);
              return (
                <label
                  key={subreddit}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(subreddit)}
                    disabled={disabled}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">r/{subreddit}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500">
        {selectedSubreddits.length} subreddit{selectedSubreddits.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  );
}
