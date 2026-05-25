export interface Account {
  id: string;
  username: string;
  password: string;
  proxyHost: string | null;
  proxyPort: number | null;
  proxyUsername: string | null;
  proxyPassword: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  lastActionAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActionLog {
  id: string;
  accountId: string;
  actionType: string;
  success: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface CreateAccountInput {
  username: string;
  password: string;
  proxyHost?: string;
  proxyPort?: number;
  proxyUsername?: string;
  proxyPassword?: string;
}

export interface UpdateAccountInput {
  username?: string;
  password?: string;
  proxyHost?: string;
  proxyPort?: number;
  proxyUsername?: string;
  proxyPassword?: string;
  isActive?: boolean;
}

export interface ExecuteReplyInput {
  targetUrl: string;
  replyText: string;
}
