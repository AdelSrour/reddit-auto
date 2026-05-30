'use client';

import { useState } from 'react';
import { LogIn, MessageSquareReply, UserPlus } from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Badge,
  Input,
} from '@/components/ui';
import type {
  ActionResult,
  ActionLog,
  ExecuteReplyManualInput,
  ReplyManualOutput,
} from '@/lib/types';

interface AccountActionsProps {
  onLogin: () => Promise<ActionResult>;
  onRegister: () => Promise<ActionResult>;
  onReplyManual: (
    input: ExecuteReplyManualInput,
  ) => Promise<ActionResult<ReplyManualOutput>>;
  logs: ActionLog[];
}

export function AccountActions({
  onLogin,
  onRegister,
  onReplyManual,
  logs,
}: AccountActionsProps) {
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [replyManualLoading, setReplyManualLoading] = useState(false);
  const [replyUrl, setReplyUrl] = useState('');
  const [lastResult, setLastResult] = useState<ActionResult<unknown> | null>(
    null,
  );

  const handleLogin = async () => {
    setLoginLoading(true);
    setLastResult(null);
    try {
      const result = await onLogin();
      setLastResult(result);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegisterLoading(true);
    setLastResult(null);
    try {
      const result = await onRegister();
      setLastResult(result);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleReplyManual = async () => {
    if (!replyUrl.trim()) return;

    setReplyManualLoading(true);
    setLastResult(null);
    try {
      const result = await onReplyManual({ url: replyUrl.trim() });
      setLastResult(result);
      if (result.success) {
        setReplyUrl('');
      }
    } finally {
      setReplyManualLoading(false);
    }
  };

  const isAnyLoading = loginLoading || registerLoading || replyManualLoading;

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

          <div className="mt-4 pt-4 border-t border-border">
            <label className="block text-sm font-medium text-foreground mb-2">
              Reply to Post/Comment
            </label>
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="https://www.reddit.com/r/subreddit/comments/..."
                value={replyUrl}
                onChange={(e) => setReplyUrl(e.target.value)}
                disabled={isAnyLoading}
                className="flex-1"
              />
              <Button
                onClick={handleReplyManual}
                loading={replyManualLoading}
                disabled={(isAnyLoading && !replyManualLoading) || !replyUrl.trim()}
                variant="secondary"
              >
                <MessageSquareReply className="mr-2 h-4 w-4" aria-hidden="true" />
                Open Reply
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Opens the post in a browser for manual reply
            </p>
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
              {lastResult.error && (
                <p className="mt-1 text-sm text-destructive">
                  {lastResult.error.code}: {lastResult.error.message}
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
