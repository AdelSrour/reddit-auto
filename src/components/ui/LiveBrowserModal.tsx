'use client';

import { useActionStream } from '@/hooks/useActionStream';
import { Button } from './Button';

interface LiveBrowserModalProps {
  actionId: string | null;
  onClose: () => void;
  title?: string;
}

export function LiveBrowserModal({
  actionId,
  onClose,
  title = 'Action in Progress',
}: LiveBrowserModalProps) {
  const { screenshot, status, error } = useActionStream(actionId);

  if (!actionId) return null;

  const isRunning = status === 'connecting' || status === 'running';

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget && !isRunning) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {title}
              {status === 'connecting' && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Connecting...
                </span>
              )}
              {status === 'running' && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <svg
                    className="mr-1 h-3 w-3 animate-spin"
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
                  Running
                </span>
              )}
              {status === 'success' && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  Complete
                </span>
              )}
              {status === 'error' && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                  Failed
                </span>
              )}
            </h3>
          </div>

          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {screenshot ? (
              // eslint-disable-next-line @next/next/no-img-element -- Dynamic base64 data URL, cannot use next/image
              <img
                src={screenshot}
                alt="Browser view"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg
                  className="h-8 w-8 animate-spin mb-2"
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
                <span>Connecting to browser...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button onClick={onClose} disabled={isRunning} variant="secondary">
              {isRunning ? 'Please wait...' : 'Close'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
