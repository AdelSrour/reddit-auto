'use client';

import { useState, useEffect, useRef } from 'react';

export type ActionStreamStatus = 'idle' | 'connecting' | 'running' | 'success' | 'error';

interface ActionStreamState {
  screenshot: string | null;
  status: ActionStreamStatus;
  error: string | null;
}

const initialState: ActionStreamState = {
  screenshot: null,
  status: 'idle',
  error: null,
};

export function useActionStream(actionId: string | null): ActionStreamState {
  const [state, setState] = useState<ActionStreamState>(
    actionId ? { ...initialState, status: 'connecting' } : initialState
  );
  const prevActionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevActionIdRef.current !== actionId) {
      prevActionIdRef.current = actionId;
      if (!actionId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state on actionId change is intentional for SSE subscription lifecycle
        setState(initialState);
        return;
      }
      setState({ ...initialState, status: 'connecting' });
    }

    if (!actionId) {
      return;
    }

    const eventSource = new EventSource(`/api/action-stream/${actionId}`);

    eventSource.addEventListener('screenshot', (e: MessageEvent) => {
      setState((prev) => ({
        ...prev,
        screenshot: `data:image/jpeg;base64,${e.data}`,
        status: 'running',
      }));
    });

    eventSource.addEventListener('complete', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { success: boolean; error?: string };
        setState((prev) => ({
          ...prev,
          status: data.success ? 'success' : 'error',
          error: data.error ?? null,
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: 'Failed to parse completion event',
        }));
      }
      eventSource.close();
    });

    eventSource.addEventListener('error', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { error: string };
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: data.error,
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: 'Action not found',
        }));
      }
      eventSource.close();
    });

    eventSource.onerror = () => {
      setState((prev) => {
        if (prev.status === 'success' || prev.status === 'error') {
          return prev;
        }
        if (prev.status === 'connecting') {
          return {
            ...prev,
            status: 'error',
            error: 'Failed to connect to live stream',
          };
        }
        return prev;
      });
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [actionId]);

  return state;
}
