// src/lib/faclaw.ts
// Typed HTTP client for the FAC Agent OS orchestration backend
// (faclaw, the Hono server running at NEXT_PUBLIC_FACLAW_URL).
//
// Requires:
//   NEXT_PUBLIC_FACLAW_URL=http://localhost:3141
//   NEXT_PUBLIC_FACLAW_TOKEN=<DASHBOARD_TOKEN from faclaw/.env>
//
// All mutation endpoints want X-User-Id (the system.app_users.id of the
// caller). Reads work without it. Use useFaclawUser() to fetch /api/me
// for the current user.

const URL = process.env.NEXT_PUBLIC_FACLAW_URL || 'http://localhost:3141';
const TOKEN = process.env.NEXT_PUBLIC_FACLAW_TOKEN || '';

// ─── shared types ──────────────────────────────────────────────────────────

export interface FaclawAgent {
  id: string;
  persona: string;
  model: string;
  mcp_servers: string[];
}

export interface FaclawHive {
  id: number;
  agent_id: string;
  user_id: string | null;
  client_id: string | null;
  action_type: string;
  summary: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface FaclawMission {
  id: string;
  name: string;
  agent_id: string;
  prompt: string;
  priority: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
  result: string | null;
  error: string | null;
  retry_count: number;
  client_id: string | null;
  created_by_user_id: string | null;
  created_at: string;
}

export interface FaclawScheduled {
  id: string;
  name: string;
  cron: string;
  agent_id: string;
  prompt: string;
  chat_id: string | null;
  enabled: boolean;
  priority: number;
  last_run_at: string | null;
  next_run_at: string;
  client_id: string | null;
  created_by_user_id: string | null;
  created_at: string;
}

export interface FaclawMemory {
  id: string;
  agent_id: string;
  content: string;
  summary: string | null;
  importance: number;
  importance_peak: number;
  salience: number;
  pinned: boolean;
  consolidated: boolean;
  last_accessed_at: string | null;
  created_at: string;
}

export interface FaclawCandidate {
  id: string;
  signal: 'usage_threshold' | 'pattern_recurrence' | 'engagement_closure' | 'explicit_reaction' | 'owner_initiated';
  source_client_id: string | null;
  source_engagement_id: string | null;
  suggested_slug: string;
  suggested_title: string;
  suggested_category: string | null;
  tags: string[];
  content_path: string;
  snippet: string | null;
  status: 'pending' | 'accepted' | 'dismissed' | 'edited';
  created_at: string;
}

export interface FaclawDecayRun {
  tier: number;
  started_at: string;
  ended_at: string | null;
  scanned_count: number;
  touched_count: number;
  archived_count: number;
  floor_saves: number;
}

export interface FaclawTokenUsage {
  day: string;
  agent_id: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: string;
}

export interface FaclawTurnResult {
  reply: string;
  session_id: string;
  cost_usd: number;
  turns: number;
  input_tokens: number;
  output_tokens: number;
  is_error: boolean;
  memory_hits: number;
  nudged: boolean;
}

export interface FaclawMe {
  id: string;
  role: 'owner' | 'operator' | 'observer';
  display_name: string;
}

// ─── core fetcher ──────────────────────────────────────────────────────────

interface RequestOpts {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  userId?: string | null;
  signal?: AbortSignal;
}

async function api<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  if (!TOKEN) {
    throw new FaclawError('NEXT_PUBLIC_FACLAW_TOKEN not set in env');
  }
  const url = new globalThis.URL(path, URL);
  url.searchParams.set('token', TOKEN);
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (opts.userId) headers['x-user-id'] = opts.userId;

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });
  const text = await res.text();
  let parsed: unknown;
  try { parsed = text ? JSON.parse(text) : {}; } catch { parsed = { raw: text }; }
  if (!res.ok) {
    const msg = (parsed as { error?: string })?.error || `HTTP ${res.status}`;
    throw new FaclawError(msg, res.status);
  }
  return parsed as T;
}

export class FaclawError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'FaclawError';
  }
}

// ─── public API ────────────────────────────────────────────────────────────

export const faclaw = {
  url: URL,

  // identity
  me: (userId: string) => api<FaclawMe>('/api/me', { userId }),

  // agents
  listAgents: () => api<{ rows: FaclawAgent[] }>('/api/agents').then((r) => r.rows),

  // turn (fire ad-hoc agent run)
  fireTurn: (input: {
    userId: string;
    agentId: string;
    message: string;
    sessionKey?: string;
    clientId?: string | null;
  }) =>
    api<FaclawTurnResult>('/api/turn', {
      method: 'POST',
      userId: input.userId,
      body: {
        agent_id: input.agentId,
        message: input.message,
        session_key: input.sessionKey,
        client_id: input.clientId ?? null,
      },
    }),

  // missions
  listMissions: (status?: FaclawMission['status']) => {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return api<{ rows: FaclawMission[] }>(`/api/missions${qs}`).then((r) => r.rows);
  },
  createMission: (input: {
    userId: string;
    name: string;
    agentId: string;
    prompt: string;
    priority?: number;
    scheduledFor?: string | null;
    clientId?: string | null;
    metadata?: Record<string, unknown>;
  }) =>
    api<FaclawMission>('/api/missions', {
      method: 'POST',
      userId: input.userId,
      body: {
        name: input.name,
        agent_id: input.agentId,
        prompt: input.prompt,
        priority: input.priority,
        scheduled_for: input.scheduledFor,
        client_id: input.clientId ?? null,
        metadata: input.metadata,
      },
    }),
  cancelMission: (id: string, userId: string) =>
    api<{ ok: true }>(`/api/missions/${id}/cancel`, { method: 'POST', userId }),

  // scheduled
  listScheduled: (enabledOnly = false) => {
    const qs = enabledOnly ? '?enabled_only=true' : '';
    return api<{ rows: FaclawScheduled[] }>(`/api/scheduled${qs}`).then((r) => r.rows);
  },
  createScheduled: (input: {
    userId: string;
    name: string;
    cron: string;
    agentId: string;
    prompt: string;
    chatId?: string | null;
    priority?: number;
    clientId?: string | null;
  }) =>
    api<FaclawScheduled>('/api/scheduled', {
      method: 'POST',
      userId: input.userId,
      body: {
        name: input.name,
        cron: input.cron,
        agent_id: input.agentId,
        prompt: input.prompt,
        chat_id: input.chatId ?? null,
        priority: input.priority,
        client_id: input.clientId ?? null,
      },
    }),
  setScheduledEnabled: (id: string, userId: string, enabled: boolean) =>
    api<{ ok: true }>(`/api/scheduled/${id}`, { method: 'PATCH', userId, body: { enabled } }),
  deleteScheduled: (id: string, userId: string) =>
    api<{ ok: true }>(`/api/scheduled/${id}`, { method: 'DELETE', userId }),

  // hive
  listHive: (opts: { limit?: number; sinceMin?: number; agentId?: string } = {}) => {
    const params = new URLSearchParams();
    if (opts.limit) params.set('limit', String(opts.limit));
    if (opts.sinceMin) params.set('since_min', String(opts.sinceMin));
    if (opts.agentId) params.set('agent_id', opts.agentId);
    return api<{ rows: FaclawHive[] }>(`/api/hive?${params}`).then((r) => r.rows);
  },

  // memory
  listMemory: (opts: { limit?: number; userId?: string } = {}) => {
    const params = new URLSearchParams();
    if (opts.limit) params.set('limit', String(opts.limit));
    if (opts.userId) params.set('user_id', opts.userId);
    return api<{ rows: FaclawMemory[] }>(`/api/memory/timeline?${params}`).then((r) => r.rows);
  },
  decayRuns: (days = 7) =>
    api<{ rows: FaclawDecayRun[] }>(`/api/memory/decay-runs?days=${days}`).then((r) => r.rows),

  // candidates
  listCandidates: (status: FaclawCandidate['status'] = 'pending') =>
    api<{ rows: FaclawCandidate[] }>(`/api/candidates?status=${status}`).then((r) => r.rows),
  acceptCandidate: (
    id: string,
    userId: string,
    overrides?: { title?: string; description?: string; category?: string; tags?: string[] },
  ) =>
    api<{ candidate_id: string; skill_id: string }>(`/api/candidates/${id}/accept`, {
      method: 'POST',
      userId,
      body: overrides ?? {},
    }),
  dismissCandidate: (id: string, userId: string, reason?: string) =>
    api<{ ok: true }>(`/api/candidates/${id}/dismiss`, {
      method: 'POST',
      userId,
      body: { reason },
    }),

  // usage
  usageSummary: (days = 7) =>
    api<{ rows: FaclawTokenUsage[] }>(`/api/usage/summary?days=${days}`).then((r) => r.rows),

  // SSE stream URL — caller wraps in EventSource
  eventStreamUrl: () => `${URL}/api/events?token=${encodeURIComponent(TOKEN)}`,
};
