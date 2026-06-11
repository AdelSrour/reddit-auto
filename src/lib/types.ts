export interface Account {
  id: string;
  username: string;
  password: string;
  gologinProfileId: string | null;
  proxyHost: string | null;
  proxyPort: number | null;
  proxyUsername: string | null;
  proxyPassword: string | null;
  isActive: boolean;
  isBanned: boolean;
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
  gologinProfileId?: string;
}

export interface GoLoginProfileInfo {
  id: string;
  name: string;
  notes: string | null;
  createdAt: string;
  isLinked: boolean;
}

export interface OpenBrowserResponse {
  liveViewUrl: string;
  profileId: string;
}

export interface UpdateAccountInput {
  username?: string;
  password?: string;
  proxyHost?: string;
  proxyPort?: number;
  proxyUsername?: string;
  proxyPassword?: string;
  isActive?: boolean;
  isBanned?: boolean;
}

export type AccountHealthStatus = 'Good' | 'Banned' | 'Error';

export interface AccountHealthItem {
  accountId: string;
  username: string;
  status: AccountHealthStatus;
  error?: string;
}

export interface AccountHealthCheckResult {
  checked: number;
  skipped: number;
  good: number;
  banned: number;
  errors: number;
  results: AccountHealthItem[];
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
  postingEaseRating: number | null;
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
  minPostingEase?: number;
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

export type SubredditFetchStatus = 'SUCCESS' | 'NO_RULES' | 'FAILED';

export interface SubredditRule {
  title: string;
  description: string;
}

export interface Subreddit {
  id: string;
  name: string;
  rules: SubredditRule[] | null;
  rulesRawText: string | null;
  fetchStatus: SubredditFetchStatus | null;
  fetchError: string | null;
  fetchedAt: string | null;
  postingEaseRating: number | null;
  postingEaseReason: string | null;
  postingEaseRatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubredditFetchRulesResult {
  started: boolean;
  totalNew: number;
  message: string;
}

export interface SubredditQueryParams {
  page?: number;
  limit?: number;
  fetchStatus?: SubredditFetchStatus;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstanceInput {
  title: string;
  description?: string;
  accountId: string;
  repliesPerDay?: number;
}

export interface UpdateInstanceInput {
  title?: string;
  description?: string;
  status?: AutomationStatus;
  repliesPerDay?: number;
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
  postingEaseRating: number | null;
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

export interface MarkRepliedInput {
  matchId: string;
  replyUrl: string;
  replyText?: string;
}

export interface GenerateReplyInput {
  matchId: string;
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

export type ReplyHistorySortBy =
  | 'completedAt'
  | 'subreddit'
  | 'accountUsername'
  | 'title'
  | 'views'
  | 'upvotes'
  | 'replies';

export type SortOrder = 'asc' | 'desc';

export interface ReplyHistoryEntry {
  id: string;
  accountUsername: string;
  replyText: string;
  replyUrl: string | null;
  sourceUrl: string;
  sourceType: string;
  subreddit: string;
  title: string;
  completedAt: string;
  createdAt: string;
  views: number | null;
  upvotes: number | null;
  replies: number | null;
  lastStatsAt: string | null;
}

export interface ReplyHistoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: ReplyHistorySortBy;
  sortOrder?: SortOrder;
  subreddit?: string;
  accountUsername?: string;
  fromDate?: string;
  toDate?: string;
}

export type PaginatedReplyHistoryResponse = PaginatedResponse<ReplyHistoryEntry>;

export interface DailyAutomationResult {
  syncResult: { emailsProcessed: number; newMatches: number } | null;
  ratingResult: { rated: number; failed: number } | null;
  schedulingResult: {
    instancesProcessed: number;
    instancesSkipped: number;
    totalScheduled: number;
  };
}

// Stats tracking types
export interface DailyStatsSnapshot {
  id: string;
  date: string;
  totalViews: number;
  totalUpvotes: number;
  totalReplies: number;
  totalShares: number;
  totalAwards: number;
  replyCount: number;
}

export interface StatsUpdateResult {
  replyId: string;
  success: boolean;
  stats?: {
    views: number;
    upvotes: number;
    upvoteRatio: number;
    replies: number;
    shares: number;
    awards: number;
  };
  error?: string;
}

export interface StatsRefreshResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  skipped: number;
  results: StatsUpdateResult[];
}
