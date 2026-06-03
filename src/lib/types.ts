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
  actionId?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/** Returned immediately when an action is started (result comes via SSE stream). */
export interface ActionStartResponse {
  actionId: string;
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
  matchId: string;
}

// F5Bot types
export type F5botSourceType = 'POST' | 'COMMENT';

export interface F5botMatch {
  id: string;
  keyword: string;
  sourceType: F5botSourceType;
  subreddit: string;
  title: string;
  author: string;
  sourceUrl: string;
  content: string;
  rating: number | null;
  ratingReason: string | null;
  suggestedReply: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface F5botQueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  sourceType?: F5botSourceType;
  subreddit?: string;
  minRating?: number;
  fromDate?: string;
  toDate?: string;
}

export interface F5botSyncResult {
  emailsProcessed: number;
  newMatches: number;
  skippedDuplicates: number;
}

export interface F5botRateResult {
  totalUnrated: number;
  rated: number;
  failed: number;
}

// Automation types
export type AutomationStatus = 'ACTIVE' | 'PAUSED' | 'OFF';

export interface AutomationInstance {
  id: string;
  title: string;
  description: string | null;
  accountId: string;
  accountUsername: string;
  status: AutomationStatus;
  repliesPerDay: number;
  subreddits: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstanceInput {
  title: string;
  description?: string;
  accountId: string;
  repliesPerDay?: number;
  subreddits: string[];
}

export interface UpdateInstanceInput {
  title?: string;
  description?: string;
  status?: AutomationStatus;
  repliesPerDay?: number;
  subreddits?: string[];
}

export interface AvailablePost {
  id: string;
  keyword: string;
  sourceType: F5botSourceType;
  subreddit: string;
  title: string;
  author: string;
  sourceUrl: string;
  content: string;
  rating: number | null;
  createdAt: string;
}

export interface AutomationReply {
  id: string;
  instanceId: string;
  matchId: string;
  sourceUrl: string;
  sourceType: string;
  subreddit: string;
  title: string;
  replyUrl: string | null;
  replyText: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
}

export interface ScheduledReply {
  id: string;
  instanceId: string;
  matchId: string;
  sourceUrl: string;
  sourceType: string;
  subreddit: string;
  title: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
}

export interface ScheduleReplyInput {
  matchId: string;
  delayMinutes: number;
}

export interface ExecuteAutoReplyInput {
  matchId: string;
}

export interface ReplyOutput {
  replyUrl: string | null;
  replyText: string;
}

export interface AvailableAccount {
  id: string;
  username: string;
}

export interface ReplyStats {
  totalReplies: number;
  successfulReplies: number;
  failedReplies: number;
  successRate: number;
  repliesToday: number;
  repliesThisWeek: number;
  topSubreddits: Array<{ subreddit: string; count: number }>;
}

export interface AllRepliesResponse {
  data: AutomationReply[];
  meta: PaginationMeta;
  stats: ReplyStats;
}

export interface DailyAutomationResult {
  syncResult: { emailsProcessed: number; newMatches: number } | null;
  ratingResult: { rated: number; failed: number } | null;
  schedulingResult: {
    instancesProcessed: number;
    instancesSkipped: number;
    totalScheduled: number;
  };
}
