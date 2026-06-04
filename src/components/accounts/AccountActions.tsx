'use client';

import { useState } from 'react';
import { LogIn, ExternalLink, Info } from 'lucide-react';
import { Button, Card, CardHeader, CardContent, Badge } from '@/components/ui';
import type { ActionLog, OpenBrowserResponse } from '@/lib/types';

interface AccountActionsProps {
  onLogin: () => Promise<{ success: boolean; message?: string }>;
  onOpenBrowser: () => Promise<OpenBrowserResponse>;
  onActionComplete?: () => Promise<void>;
  logs: ActionLog[];
}

export function AccountActions({
  onLogin,
  onOpenBrowser,
  onActionComplete,
  logs,
}: AccountActionsProps) {
  const [loginLoading, setLoginLoading] = useState(false);
  const [browserLoading, setBrowserLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLastResult(null);
    try {
      const result = await onLogin();
      setLastResult(result);
      await onActionComplete?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify login';
      setLastResult({ success: false, message });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOpenBrowser = async () => {
    setBrowserLoading(true);
    setLastResult(null);
    try {
      const { liveViewUrl } = await onOpenBrowser();
      window.open(liveViewUrl, '_blank');
      setLastResult({ success: true, message: 'Browser opened in new tab' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to open browser';
      setLastResult({ success: false, message });
    } finally {
      setBrowserLoading(false);
    }
  };

  const isAnyLoading = loginLoading || browserLoading;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 rounded-lg border border-border bg-muted/50">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">GoLogin Cloud Browser</p>
                <p className="mt-1">
                  Click &quot;Open Browser&quot; to launch a cloud browser session.
                  You can login to Reddit, register new accounts, or perform any manual actions.
                  The session is saved automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleLogin}
              loading={loginLoading}
              disabled={isAnyLoading && !loginLoading}
            >
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              Verify Login
            </Button>
            <Button
              onClick={handleOpenBrowser}
              loading={browserLoading}
              disabled={isAnyLoading && !browserLoading}
              variant="secondary"
            >
              <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
              Open Browser
            </Button>
          </div>

          {lastResult && (
            <div
              className={`mt-4 rounded-lg p-3 ${
                lastResult.success
                  ? 'border border-border bg-accent'
                  : 'border border-destructive/20 bg-destructive/10'
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  lastResult.success ? 'text-accent-foreground' : 'text-destructive'
                }`}
              >
                {lastResult.success ? 'Action completed successfully' : 'Action failed'}
              </p>
              {lastResult.message && (
                <p className={`mt-1 text-sm ${lastResult.success ? 'text-muted-foreground' : 'text-destructive'}`}>
                  {lastResult.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Action History</h2>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No actions executed yet.</p>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={log.success ? 'success' : 'error'}>
                      {log.success ? 'Success' : 'Failed'}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                      {log.actionType}
                    </span>
                    {log.errorMessage && (
                      <span className="text-sm text-destructive">
                        {log.errorMessage}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
