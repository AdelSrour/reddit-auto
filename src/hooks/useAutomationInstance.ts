'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type {
  AutomationInstance,
  AvailablePost,
  AutomationReply,
  ScheduledReply,
  PaginationMeta,
  ActionResult,
  ReplyOutput,
  UpdateInstanceInput,
  F5botQueryParams,
} from '@/lib/types';

interface UseAutomationInstanceReturn {
  instance: AutomationInstance | null;
  posts: AvailablePost[];
  postsMeta: PaginationMeta | null;
  completedReplies: AutomationReply[];
  completedMeta: PaginationMeta | null;
  scheduledReplies: ScheduledReply[];
  scheduledMeta: PaginationMeta | null;
  loading: boolean;
  postsLoading: boolean;
  replying: boolean;
  scheduling: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshPosts: () => Promise<void>;
  postsParams: F5botQueryParams;
  setPostsParams: (params: F5botQueryParams) => void;
  setPostsPage: (page: number) => void;
  setCompletedPage: (page: number) => void;
  setScheduledPage: (page: number) => void;
  executeReply: (matchId: string) => Promise<ActionResult<ReplyOutput>>;
  scheduleReply: (matchId: string, delayMinutes: number) => Promise<void>;
  cancelScheduled: (scheduledId: string) => Promise<void>;
  updateInstance: (data: UpdateInstanceInput) => Promise<void>;
}

export function useAutomationInstance(id: string): UseAutomationInstanceReturn {
  const [instance, setInstance] = useState<AutomationInstance | null>(null);
  const [posts, setPosts] = useState<AvailablePost[]>([]);
  const [postsMeta, setPostsMeta] = useState<PaginationMeta | null>(null);
  const [completedReplies, setCompletedReplies] = useState<AutomationReply[]>([]);
  const [completedMeta, setCompletedMeta] = useState<PaginationMeta | null>(null);
  const [scheduledReplies, setScheduledReplies] = useState<ScheduledReply[]>([]);
  const [scheduledMeta, setScheduledMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [replying, setReplying] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postsParams, setPostsParams] = useState<F5botQueryParams>({
    page: 1,
    limit: 20,
  });
  const [completedPage, setCompletedPage] = useState(1);
  const [scheduledPage, setScheduledPage] = useState(1);
  const mountedRef = useRef(true);

  const fetchInstance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.automation.instances.get(id);
      if (mountedRef.current) {
        setInstance(data);
      }
    } catch (err) {
      if (mountedRef.current) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch instance');
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [id]);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const response = await api.automation.instances.getPosts(id, postsParams);
      if (mountedRef.current) {
        setPosts(response.data);
        setPostsMeta(response.meta);
      }
    } catch (err) {
      if (mountedRef.current && err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      if (mountedRef.current) {
        setPostsLoading(false);
      }
    }
  }, [id, postsParams]);

  const setPostsPage = useCallback((page: number) => {
    setPostsParams((prev) => ({ ...prev, page }));
  }, []);

  const fetchCompleted = useCallback(async () => {
    try {
      const response = await api.automation.instances.getCompleted(id, completedPage, 10);
      if (mountedRef.current) {
        setCompletedReplies(response.data);
        setCompletedMeta(response.meta);
      }
    } catch (err) {
      if (mountedRef.current && err instanceof ApiError) {
        setError(err.message);
      }
    }
  }, [id, completedPage]);

  const fetchScheduled = useCallback(async () => {
    try {
      const response = await api.automation.instances.getScheduled(id, scheduledPage, 10);
      if (mountedRef.current) {
        setScheduledReplies(response.data);
        setScheduledMeta(response.meta);
      }
    } catch (err) {
      if (mountedRef.current && err instanceof ApiError) {
        setError(err.message);
      }
    }
  }, [id, scheduledPage]);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch with cleanup guard
    void fetchInstance();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchInstance]);

  useEffect(() => {
    if (instance) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Dependent data fetch after instance loads
      void fetchPosts();
      void fetchCompleted();
      void fetchScheduled();
    }
  }, [instance, fetchPosts, fetchCompleted, fetchScheduled]);

  const refresh = useCallback(async () => {
    await fetchInstance();
  }, [fetchInstance]);

  const refreshPosts = useCallback(async () => {
    await Promise.all([fetchPosts(), fetchCompleted(), fetchScheduled()]);
  }, [fetchPosts, fetchCompleted, fetchScheduled]);

  const executeReply = useCallback(async (matchId: string): Promise<ActionResult<ReplyOutput>> => {
    setReplying(true);
    setError(null);
    try {
      const result = await api.automation.instances.reply(id, { matchId });
      if (result.success) {
        await refreshPosts();
      }
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
      return { success: false, error: { code: 'UNKNOWN', message: 'Request failed' } };
    } finally {
      setReplying(false);
    }
  }, [id, refreshPosts]);

  const scheduleReply = useCallback(async (matchId: string, delayMinutes: number) => {
    setScheduling(true);
    setError(null);
    try {
      await api.automation.instances.schedule(id, { matchId, delayMinutes });
      await refreshPosts();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
      throw err;
    } finally {
      setScheduling(false);
    }
  }, [id, refreshPosts]);

  const cancelScheduled = useCallback(async (scheduledId: string) => {
    try {
      await api.automation.cancelScheduled(scheduledId);
      await fetchScheduled();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
      throw err;
    }
  }, [fetchScheduled]);

  const updateInstance = useCallback(async (data: UpdateInstanceInput) => {
    try {
      const updated = await api.automation.instances.update(id, data);
      setInstance(updated);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
      throw err;
    }
  }, [id]);

  return {
    instance,
    posts,
    postsMeta,
    completedReplies,
    completedMeta,
    scheduledReplies,
    scheduledMeta,
    loading,
    postsLoading,
    replying,
    scheduling,
    error,
    refresh,
    refreshPosts,
    postsParams,
    setPostsParams,
    setPostsPage,
    setCompletedPage,
    setScheduledPage,
    executeReply,
    scheduleReply,
    cancelScheduled,
    updateInstance,
  };
}
