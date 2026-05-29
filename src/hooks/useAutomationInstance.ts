'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [postsPage, setPostsPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [scheduledPage, setScheduledPage] = useState(1);

  const fetchInstance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.automation.instances.get(id);
      setInstance(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch instance');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const response = await api.automation.instances.getPosts(id, postsPage, 20);
      setPosts(response.data);
      setPostsMeta(response.meta);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setPostsLoading(false);
    }
  }, [id, postsPage]);

  const fetchCompleted = useCallback(async () => {
    try {
      const response = await api.automation.instances.getCompleted(id, completedPage, 10);
      setCompletedReplies(response.data);
      setCompletedMeta(response.meta);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  }, [id, completedPage]);

  const fetchScheduled = useCallback(async () => {
    try {
      const response = await api.automation.instances.getScheduled(id, scheduledPage, 10);
      setScheduledReplies(response.data);
      setScheduledMeta(response.meta);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  }, [id, scheduledPage]);

  useEffect(() => {
    fetchInstance();
  }, [fetchInstance]);

  useEffect(() => {
    if (instance) {
      fetchPosts();
      fetchCompleted();
      fetchScheduled();
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
    setPostsPage,
    setCompletedPage,
    setScheduledPage,
    executeReply,
    scheduleReply,
    cancelScheduled,
    updateInstance,
  };
}
