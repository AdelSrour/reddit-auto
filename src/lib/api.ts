import type {
  Account,
  ActionLog,
  ActionResult,
  ActionStartResponse,
  CreateAccountInput,
  UpdateAccountInput,
  ExecuteReplyInput,
  F5botMatch,
  F5botQueryParams,
  F5botSyncResult,
  F5botRateResult,
  PaginatedResponse,
  AutomationInstance,
  CreateInstanceInput,
  UpdateInstanceInput,
  AvailablePost,
  AutomationReply,
  ScheduledReply,
  ScheduleReplyInput,
  ExecuteAutoReplyInput,
  ReplyOutput,
  AvailableAccount,
  AllRepliesResponse,
  DailyAutomationResult,
} from './types';

const API_BASE_URL = '/api/proxy';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  accounts: {
    list: (): Promise<Account[]> => fetchApi('/accounts'),

    get: (id: string): Promise<Account> => fetchApi(`/accounts/${id}`),

    create: (data: CreateAccountInput): Promise<Account> =>
      fetchApi('/accounts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateAccountInput): Promise<Account> =>
      fetchApi(`/accounts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<void> =>
      fetchApi(`/accounts/${id}`, {
        method: 'DELETE',
      }),

    getLogs: (id: string): Promise<ActionLog[]> =>
      fetchApi(`/accounts/${id}/logs`),
  },

  actions: {
    login: (accountId: string): Promise<ActionStartResponse> =>
      fetchApi(`/accounts/${accountId}/actions/login`, {
        method: 'POST',
      }),

    register: (accountId: string): Promise<ActionStartResponse> =>
      fetchApi(`/accounts/${accountId}/actions/register`, {
        method: 'POST',
      }),

    reply: (
      accountId: string,
      input: ExecuteReplyInput,
    ): Promise<ActionStartResponse> =>
      fetchApi(`/accounts/${accountId}/actions/reply`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  },

  f5bot: {
    list: (params?: F5botQueryParams): Promise<PaginatedResponse<F5botMatch>> => {
      const searchParams = new URLSearchParams();
      if (params?.page !== undefined) searchParams.set('page', String(params.page));
      if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
      if (params?.keyword !== undefined && params.keyword !== '') searchParams.set('keyword', params.keyword);
      if (params?.sourceType !== undefined) searchParams.set('sourceType', params.sourceType);
      if (params?.subreddit !== undefined && params.subreddit !== '') searchParams.set('subreddit', params.subreddit);
      if (params?.minRating !== undefined) searchParams.set('minRating', String(params.minRating));
      if (params?.fromDate !== undefined) searchParams.set('fromDate', params.fromDate);
      if (params?.toDate !== undefined) searchParams.set('toDate', params.toDate);
      const query = searchParams.toString();
      return fetchApi(`/f5bot/matches${query ? `?${query}` : ''}`);
    },

    get: (id: string): Promise<F5botMatch> => fetchApi(`/f5bot/matches/${id}`),

    sync: (): Promise<F5botSyncResult> =>
      fetchApi('/f5bot/sync', {
        method: 'POST',
      }),

    rate: (): Promise<F5botRateResult> =>
      fetchApi('/f5bot/rate', {
        method: 'POST',
      }),
  },

  automation: {
    getAllReplies: (page?: number, limit?: number): Promise<AllRepliesResponse> => {
      const searchParams = new URLSearchParams();
      if (page !== undefined) searchParams.set('page', String(page));
      if (limit !== undefined) searchParams.set('limit', String(limit));
      const query = searchParams.toString();
      return fetchApi(`/automation/replies${query ? `?${query}` : ''}`);
    },

    instances: {
      list: (): Promise<AutomationInstance[]> =>
        fetchApi('/automation/instances'),

      get: (id: string): Promise<AutomationInstance> =>
        fetchApi(`/automation/instances/${id}`),

      create: (data: CreateInstanceInput): Promise<AutomationInstance> =>
        fetchApi('/automation/instances', {
          method: 'POST',
          body: JSON.stringify(data),
        }),

      update: (id: string, data: UpdateInstanceInput): Promise<AutomationInstance> =>
        fetchApi(`/automation/instances/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),

      delete: (id: string): Promise<void> =>
        fetchApi(`/automation/instances/${id}`, {
          method: 'DELETE',
        }),

      getPosts: (id: string, page?: number, limit?: number): Promise<PaginatedResponse<AvailablePost>> => {
        const searchParams = new URLSearchParams();
        if (page !== undefined) searchParams.set('page', String(page));
        if (limit !== undefined) searchParams.set('limit', String(limit));
        const query = searchParams.toString();
        return fetchApi(`/automation/instances/${id}/posts${query ? `?${query}` : ''}`);
      },

      getCompleted: (id: string, page?: number, limit?: number): Promise<PaginatedResponse<AutomationReply>> => {
        const searchParams = new URLSearchParams();
        if (page !== undefined) searchParams.set('page', String(page));
        if (limit !== undefined) searchParams.set('limit', String(limit));
        const query = searchParams.toString();
        return fetchApi(`/automation/instances/${id}/completed${query ? `?${query}` : ''}`);
      },

      getScheduled: (id: string, page?: number, limit?: number): Promise<PaginatedResponse<ScheduledReply>> => {
        const searchParams = new URLSearchParams();
        if (page !== undefined) searchParams.set('page', String(page));
        if (limit !== undefined) searchParams.set('limit', String(limit));
        const query = searchParams.toString();
        return fetchApi(`/automation/instances/${id}/scheduled${query ? `?${query}` : ''}`);
      },

      reply: (id: string, input: ExecuteAutoReplyInput): Promise<ActionResult<ReplyOutput>> =>
        fetchApi(`/automation/instances/${id}/reply`, {
          method: 'POST',
          body: JSON.stringify(input),
        }),

      schedule: (id: string, input: ScheduleReplyInput): Promise<ScheduledReply> =>
        fetchApi(`/automation/instances/${id}/schedule`, {
          method: 'POST',
          body: JSON.stringify(input),
        }),
    },

    availableAccounts: (): Promise<AvailableAccount[]> =>
      fetchApi('/automation/accounts/available'),

    cancelScheduled: (id: string): Promise<void> =>
      fetchApi(`/automation/scheduled/${id}`, {
        method: 'DELETE',
      }),

    runDaily: (): Promise<DailyAutomationResult> =>
      fetchApi('/automation/run-daily', {
        method: 'POST',
      }),
  },
};

export { ApiError };
