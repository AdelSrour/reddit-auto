import type {
  Account,
  ActionLog,
  ActionResult,
  CreateAccountInput,
  UpdateAccountInput,
  ExecuteReplyInput,
  ExecuteReplyManualInput,
  ReplyManualOutput,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

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
    login: (accountId: string): Promise<ActionResult> =>
      fetchApi(`/accounts/${accountId}/actions/login`, {
        method: 'POST',
      }),

    register: (accountId: string): Promise<ActionResult> =>
      fetchApi(`/accounts/${accountId}/actions/register`, {
        method: 'POST',
      }),

    reply: (
      accountId: string,
      input: ExecuteReplyInput,
    ): Promise<ActionResult> =>
      fetchApi(`/accounts/${accountId}/actions/reply`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),

    replyManual: (
      accountId: string,
      input: ExecuteReplyManualInput,
    ): Promise<ActionResult<ReplyManualOutput>> =>
      fetchApi(`/accounts/${accountId}/actions/reply-manual`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  },
};

export { ApiError };
