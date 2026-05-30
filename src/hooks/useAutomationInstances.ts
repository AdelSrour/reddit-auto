'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type { AutomationInstance } from '@/lib/types';

interface UseAutomationInstancesReturn {
  instances: AutomationInstance[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  deleteInstance: (id: string) => Promise<void>;
}

export function useAutomationInstances(): UseAutomationInstancesReturn {
  const [instances, setInstances] = useState<AutomationInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchInstances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.automation.instances.list();
      if (mountedRef.current) {
        setInstances(data);
      }
    } catch (err) {
      if (mountedRef.current) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch instances');
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void fetchInstances();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchInstances]);

  const deleteInstance = useCallback(async (id: string) => {
    try {
      await api.automation.instances.delete(id);
      setInstances((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete instance');
      }
      throw err;
    }
  }, []);

  return {
    instances,
    loading,
    error,
    refresh: fetchInstances,
    deleteInstance,
  };
}
