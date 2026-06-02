'use client';

import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { Button, Card, CardHeader, CardContent, Badge, LiveBrowserModal } from '@/components/ui';
import type { ActionLog, ActionStartResponse } from '@/lib/types';

interface AccountActionsProps {
  onLogin: () => Promise<ActionStartResponse>;
  onRegister: () => Promise<ActionStartResponse>;
  onActionComplete?: () => Promise<void>;
  logs: ActionLog[];
}

export function AccountActions({
  onLogin,
  onRegister,
  onActionComplete,
  logs,
}: AccountActionsProps) {
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [actionTitle, setActionTitle] = useState('');

  const handleLogin = async () => {
    setLoginLoading(true);
    setLastResult(null);
    setActionTitle('Logging in...');
    try {
      const { actionId } = await onLogin();
      setActiveActionId(actionId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start login';
      setLastResult({ success: false, message });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegisterLoading(true);
    setLastResult(null);
    setActionTitle('Registering...');
    try {
      const { actionId } = await onRegister();
      setActiveActionId(actionId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to start registration';
      setLastResult({ success: false, message });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleStreamComplete = async (
    success: boolean,
    errorMessage: string | null,
  ): Promise<void> => {
    await onActionComplete?.();
    setLastResult({
      success,
      message: errorMessage ?? undefined,
    });
  };

  const handleModalClose = () => {
    setActiveActionId(null);
  };

  const isAnyLoading = loginLoading || registerLoading;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleLogin}
              loading={loginLoading}
              disabled={isAnyLoading && !loginLoading}
            >
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              Login
            </Button>
            <Button
              onClick={handleRegister}
              loading={registerLoading}
              disabled={isAnyLoading && !registerLoading}
              variant="secondary"
            >
              <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Register
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
                <p className="mt-1 text-sm text-destructive">{lastResult.message}</p>
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

      <LiveBrowserModal
        actionId={activeActionId}
        onClose={handleModalClose}
        onComplete={handleStreamComplete}
        title={actionTitle}
      />
    </div>
  );
}
