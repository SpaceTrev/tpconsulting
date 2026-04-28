'use client';

import { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { relTime } from '@/lib/admin-data';
import { useIsMobile } from '@/lib/use-mobile';
import { useClientContext } from '@/lib/client-context';
import {
  faclaw,
  type FaclawAgent,
  type FaclawMission,
  type FaclawScheduled,
  type FaclawHive,
  type FaclawTurnResult,
  type FaclawMe,
} from '@/lib/faclaw';

const TREVOR_EMAIL = 'trevbdev@gmail.com';

// ── Types (existing automations view) ─────────────────────────
interface Client {
  id: string; name: string; industry: string | null; tier: string | null;
  status: string; monthly_subscription: number | null;
}
interface DeployedAuto {
  id: string; client_id: string; name: string; status: string;
  last_run_at: string | null; error_count: number; monthly_cost: number;
  assigned_to: string | null; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  live: '#6b8e23', building: '#268bd2', testing: '#b58900',
  backlog: '#839496', paused: '#839496', failed: '#dc322f',
  pending: '#b58900', running: '#268bd2', completed: '#6b8e23', cancelled: '#839496',
};

// ── Icon ─────────────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor', sw = 1.75 }: {
  name: string; size?: number; color?: string; sw?: number;
}) {
  const p: Record<string, React.ReactNode> = {
    cpu:      <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></>,
    zap:      <path d="M13 2L3 14h9l-1 8 10-12h-9z"/>,
    alert:    <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    dollar:   <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    lock:     <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    chevronD: <path d="M6 9l6 6 6-6"/>,
    chevronR: <path d="M9 6l6 6-6 6"/>,
    users:    <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M21.5 19c0-2.5-2-4-4.5-4"/></>,
    refresh:  <><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 1 0 21.98 14.3"/></>,
    send:     <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    play:     <polygon points="6 4 20 12 6 20 6 4"/>,
    pause:    <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2"/></>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>{p[name] ?? null}</svg>
  );
}

// ── Section card ─────────────────────────────────────────────
function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--bg-inset)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
        <div style={{ marginLeft: 'auto' }}>{action}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ── Status pill ──────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? '#839496';
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color, background: color + '22', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{status}</span>
  );
}

// ── Agent Console (chat with any agent) ──────────────────────
interface ChatEntry {
  id: string;
  who: 'user' | string;          // 'user' or agent_id
  text: string;
  meta?: string;                  // cost / tokens line
}

function AgentConsole({ me, agents }: { me: FaclawMe; agents: FaclawAgent[] }) {
  const [agentId, setAgentId] = useState<string>('main');
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries.length, progress]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const userEntry: ChatEntry = { id: crypto.randomUUID(), who: 'user', text };
    setEntries((es) => [...es, userEntry]);
    setInput('');
    setBusy(true);
    setProgress('starting…');
    try {
      const res: FaclawTurnResult = await faclaw.fireTurn(
        {
          userId: me.id,
          agentId,
          message: text,
          sessionKey: `dashboard:${me.id}:${agentId}`,
        },
        (ev) => {
          const sec = (ev.elapsed_ms / 1000).toFixed(1);
          if (ev.kind === 'begin') {
            setProgress(`starting · ${sec}s`);
            return;
          }
          if (ev.kind !== 'progress') return;
          const inner = ev['event'] as { kind: string; sessionId?: string; resumed?: boolean; hits?: number; tool?: string; event_type?: string; chars?: number } | undefined;
          if (!inner) { setProgress(`thinking · ${sec}s`); return; }
          switch (inner.kind) {
            case 'session_init':
              setProgress(`${inner.resumed ? 'resumed' : 'new'} session · ${sec}s`); break;
            case 'memory_retrieved':
              setProgress(`retrieved ${inner.hits ?? 0} memories · ${sec}s`); break;
            case 'tool_use':
              setProgress(`using tool: ${inner.tool} · ${sec}s`); break;
            case 'agent_event':
              setProgress(`${inner.event_type ?? 'thinking'} · ${sec}s`); break;
            case 'final':
              setProgress(`finalizing · ${sec}s`); break;
            default:
              setProgress(`thinking · ${sec}s`);
          }
        },
      );
      setEntries((es) => [...es, {
        id: crypto.randomUUID(),
        who: agentId,
        text: res.reply,
        meta: `${res.turns}t · ${res.input_tokens}↓/${res.output_tokens}↑ · $${res.cost_usd.toFixed(4)} · mem hits: ${res.memory_hits}`,
      }]);
    } catch (err) {
      setEntries((es) => [...es, {
        id: crypto.randomUUID(),
        who: agentId,
        text: `error: ${err instanceof Error ? err.message : String(err)}`,
      }]);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void send(); }
  };

  return (
    <Section
      title="Agent console"
      action={
        <select value={agentId} onChange={(e) => setAgentId(e.target.value)}
          style={{ fontFamily: 'var(--font-ui)', fontSize: 12, background: 'var(--bg-inset)', color: 'var(--fg-1)', border: 0, padding: '4px 8px', borderRadius: 4 }}>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.persona} ({a.id})</option>)}
        </select>
      }
    >
      <div ref={scrollRef} style={{ maxHeight: 360, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>
            Talk to any agent. Ctrl+Enter to send.
          </div>
        )}
        {entries.map((e) => (
          <div key={e.id} style={{ display: 'flex', flexDirection: 'column', alignItems: e.who === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '8px 12px',
              borderRadius: 10,
              background: e.who === 'user' ? 'var(--accent-primary)' : 'var(--bg-inset)',
              color: e.who === 'user' ? 'var(--fg-on-accent)' : 'var(--fg-1)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>{e.text}</div>
            {e.meta && <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>{e.meta}</div>}
          </div>
        ))}
        {busy && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', animation: 'fac-pulse 1.2s ease-in-out infinite' }} />
            {progress ?? 'thinking…'}
          </div>
        )}
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--bg-inset)', display: 'flex', gap: 8 }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown}
          placeholder="Talk to the agent…"
          style={{
            flex: 1, minHeight: 40, maxHeight: 120, padding: '8px 10px',
            background: 'var(--bg-canvas)', color: 'var(--fg-1)',
            border: '1px solid var(--outline-variant)', borderRadius: 6,
            fontFamily: 'var(--font-body)', fontSize: 13, resize: 'vertical',
          }} />
        <button onClick={() => void send()} disabled={busy || !input.trim()}
          style={{
            padding: '0 16px', borderRadius: 6, border: 0,
            background: busy || !input.trim() ? 'var(--bg-inset)' : 'var(--accent-primary)',
            color: busy || !input.trim() ? 'var(--fg-3)' : 'var(--fg-on-accent)',
            cursor: busy || !input.trim() ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13,
          }}>
          <Icon name="send" size={14} color={busy || !input.trim() ? 'var(--fg-3)' : 'var(--fg-on-accent)'} />
          Send
        </button>
      </div>
    </Section>
  );
}

// ── Missions panel ───────────────────────────────────────────
function MissionsPanel({ me, agents }: { me: FaclawMe; agents: FaclawAgent[] }) {
  const [rows, setRows] = useState<FaclawMission[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', agent_id: 'main', prompt: '', priority: 3 });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [pending, running, done] = await Promise.all([
        faclaw.listMissions('pending'),
        faclaw.listMissions('running'),
        faclaw.listMissions('completed'),
      ]);
      setRows([...running, ...pending, ...done.slice(0, 10)]);
    } catch { /* swallow */ }
  }, []);

  useEffect(() => { void load(); const id = setInterval(load, 8000); return () => clearInterval(id); }, [load]);

  const create = async () => {
    if (!form.name.trim() || !form.prompt.trim()) return;
    setBusy(true);
    try {
      await faclaw.createMission({
        userId: me.id,
        name: form.name,
        agentId: form.agent_id,
        prompt: form.prompt,
        priority: form.priority,
      });
      setForm({ name: '', agent_id: 'main', prompt: '', priority: 3 });
      setShowForm(false);
      void load();
    } finally { setBusy(false); }
  };

  const cancel = async (id: string) => {
    try { await faclaw.cancelMission(id, me.id); void load(); } catch { /* swallow */ }
  };

  return (
    <Section
      title={`Missions (${rows.length})`}
      action={
        <button onClick={() => setShowForm((v) => !v)}
          style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 4, border: 0, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name={showForm ? 'x' : 'plus'} size={12} color="var(--fg-on-accent)" />
          {showForm ? 'cancel' : 'new mission'}
        </button>
      }
    >
      {showForm && (
        <div style={{ padding: 16, borderBottom: '1px solid var(--bg-inset)', display: 'grid', gridTemplateColumns: '1fr 140px 80px', gap: 8 }}>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="name"
            style={{ padding: '6px 8px', background: 'var(--bg-canvas)', color: 'var(--fg-1)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13 }} />
          <select value={form.agent_id} onChange={(e) => setForm((f) => ({ ...f, agent_id: e.target.value }))}
            style={{ padding: '6px 8px', background: 'var(--bg-canvas)', color: 'var(--fg-1)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13 }}>
            {agents.map((a) => <option key={a.id} value={a.id}>{a.id}</option>)}
          </select>
          <input type="number" min={1} max={5} value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: parseInt(e.target.value, 10) || 3 }))}
            style={{ padding: '6px 8px', background: 'var(--bg-canvas)', color: 'var(--fg-1)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13 }} />
          <textarea value={form.prompt} onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))} placeholder="prompt"
            style={{ gridColumn: '1 / -1', padding: '6px 8px', minHeight: 64, background: 'var(--bg-canvas)', color: 'var(--fg-1)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13, resize: 'vertical' }} />
          <button onClick={() => void create()} disabled={busy || !form.name || !form.prompt}
            style={{ gridColumn: '1 / -1', padding: '8px 12px', borderRadius: 6, border: 0, background: busy ? 'var(--bg-inset)' : 'var(--accent-primary)', color: 'var(--fg-on-accent)', cursor: busy ? 'default' : 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
            {busy ? 'creating…' : 'enqueue mission'}
          </button>
        </div>
      )}
      {rows.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>No active missions</div>
      ) : (
        rows.map((m) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: '1px solid var(--bg-inset)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', width: 24 }}>p{m.priority}</span>
            <StatusPill status={m.status} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>{m.agent_id}</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>{relTime(new Date(m.created_at).getTime())}</span>
            {(m.status === 'pending' || m.status === 'running') && (
              <button onClick={() => void cancel(m.id)} title="Cancel"
                style={{ width: 24, height: 24, padding: 0, border: 0, background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}>
                <Icon name="x" size={14} color="var(--danger)" />
              </button>
            )}
          </div>
        ))
      )}
    </Section>
  );
}

// ── Scheduled panel ──────────────────────────────────────────
function ScheduledPanel({ me, agents }: { me: FaclawMe; agents: FaclawAgent[] }) {
  const [rows, setRows] = useState<FaclawScheduled[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', cron: '0 9 * * *', agent_id: 'main', prompt: '' });

  const load = useCallback(async () => {
    try { setRows(await faclaw.listScheduled(false)); } catch { /* swallow */ }
  }, []);
  useEffect(() => { void load(); const id = setInterval(load, 15000); return () => clearInterval(id); }, [load]);

  const create = async () => {
    if (!form.name.trim() || !form.prompt.trim() || !form.cron.trim()) return;
    try {
      await faclaw.createScheduled({
        userId: me.id,
        name: form.name,
        cron: form.cron,
        agentId: form.agent_id,
        prompt: form.prompt,
      });
      setForm({ name: '', cron: '0 9 * * *', agent_id: 'main', prompt: '' });
      setShowForm(false);
      void load();
    } catch (err) { alert(err instanceof Error ? err.message : String(err)); }
  };

  return (
    <Section
      title={`Scheduled (${rows.length})`}
      action={
        <button onClick={() => setShowForm((v) => !v)}
          style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 4, border: 0, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name={showForm ? 'x' : 'plus'} size={12} color="var(--fg-on-accent)" />
          {showForm ? 'cancel' : 'new schedule'}
        </button>
      }
    >
      {showForm && (
        <div style={{ padding: 16, borderBottom: '1px solid var(--bg-inset)', display: 'grid', gridTemplateColumns: '1fr 160px 140px', gap: 8 }}>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="name"
            style={{ padding: '6px 8px', background: 'var(--bg-canvas)', color: 'var(--fg-1)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13 }} />
          <input value={form.cron} onChange={(e) => setForm((f) => ({ ...f, cron: e.target.value }))} placeholder="cron"
            style={{ padding: '6px 8px', background: 'var(--bg-canvas)', color: 'var(--fg-1)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 12 }} />
          <select value={form.agent_id} onChange={(e) => setForm((f) => ({ ...f, agent_id: e.target.value }))}
            style={{ padding: '6px 8px', background: 'var(--bg-canvas)', color: 'var(--fg-1)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13 }}>
            {agents.map((a) => <option key={a.id} value={a.id}>{a.id}</option>)}
          </select>
          <textarea value={form.prompt} onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))} placeholder="prompt"
            style={{ gridColumn: '1 / -1', padding: '6px 8px', minHeight: 64, background: 'var(--bg-canvas)', color: 'var(--fg-1)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13, resize: 'vertical' }} />
          <button onClick={() => void create()}
            style={{ gridColumn: '1 / -1', padding: '8px 12px', borderRadius: 6, border: 0, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
            create scheduled task
          </button>
        </div>
      )}
      {rows.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>No scheduled tasks</div>
      ) : (
        rows.map((s) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: '1px solid var(--bg-inset)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.enabled ? '#6b8e23' : '#839496' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)', minWidth: 100 }}>{s.cron}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>{s.agent_id}</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>next: {new Date(s.next_run_at).toLocaleString()}</span>
            <button onClick={() => void faclaw.setScheduledEnabled(s.id, me.id, !s.enabled).then(load)} title={s.enabled ? 'pause' : 'resume'}
              style={{ width: 24, height: 24, padding: 0, border: 0, background: 'transparent', cursor: 'pointer' }}>
              <Icon name={s.enabled ? 'pause' : 'play'} size={12} color="var(--fg-2)" />
            </button>
            <button onClick={() => void faclaw.deleteScheduled(s.id, me.id).then(load)} title="delete"
              style={{ width: 24, height: 24, padding: 0, border: 0, background: 'transparent', cursor: 'pointer' }}>
              <Icon name="trash" size={12} color="var(--danger)" />
            </button>
          </div>
        ))
      )}
    </Section>
  );
}

// ── Hive feed (live SSE) ─────────────────────────────────────
function HivePanel() {
  const [rows, setRows] = useState<FaclawHive[]>([]);
  const [live, setLive] = useState(false);

  const load = useCallback(async () => {
    try { setRows(await faclaw.listHive({ limit: 50, sinceMin: 60 * 24 })); } catch { /* swallow */ }
  }, []);

  useEffect(() => {
    void load();
    const url = faclaw.eventStreamUrl();
    const es = new EventSource(url);
    es.onopen = () => setLive(true);
    es.onerror = () => setLive(false);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === 'hive_mind') void load();
      } catch { /* swallow */ }
    };
    return () => es.close();
  }, [load]);

  return (
    <Section
      title="Hive feed"
      action={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: live ? '#6b8e23' : 'var(--fg-3)' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: live ? '#6b8e23' : '#839496' }} />
        {live ? 'live' : 'reconnecting'}
      </span>}
    >
      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
        {rows.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>No recent activity</div>
        ) : (
          rows.map((h) => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '8px 20px', borderBottom: '1px solid var(--bg-inset)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', minWidth: 80 }}>{new Date(h.created_at).toLocaleTimeString()}</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600, minWidth: 80 }}>{h.agent_id}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 130 }}>{h.action_type}</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.summary}</span>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}

// ── Stat card ────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div style={{ padding: '20px 24px', background: 'var(--bg-raised)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: (color ?? 'var(--accent-primary)') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={20} color={color ?? 'var(--accent-primary)'} />
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: color ?? 'var(--fg-1)', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Existing automations view (kept) ─────────────────────────
async function fetchClientsWithAutomations(): Promise<{ clients: Client[]; deployed: DeployedAuto[] }> {
  const sb = getSupabase(); if (!sb) return { clients: [], deployed: [] };
  const [{ data: clients }, { data: deployed }] = await Promise.all([
    sb.from('clients').select('*').order('name'),
    sb.from('deployed_automations').select('*').order('created_at', { ascending: false }),
  ]);
  return { clients: clients ?? [], deployed: deployed ?? [] };
}

function ClientRow({ client, autos, defaultOpen }: { client: Client; autos: DeployedAuto[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const live = autos.filter(a => a.status === 'live').length;
  const errors = autos.reduce((s, a) => s + (a.error_count ?? 0), 0);
  const totalCost = autos.reduce((s, a) => s + (a.monthly_cost ?? 0), 0);

  return (
    <div style={{ borderBottom: '1px solid var(--bg-inset)' }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', cursor: 'pointer' }}>
        <Icon name={open ? 'chevronD' : 'chevronR'} size={14} color="var(--fg-3)" />
        <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, color: 'var(--fg-1)' }}>{client.name}</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>{autos.length} auto{autos.length !== 1 ? 's' : ''}</span>
        {live > 0 && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#6b8e23' }}>{live} live</span>}
        {errors > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#dc322f' }}>{errors} err</span>}
        {totalCost > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>${totalCost.toLocaleString('es-MX')}/mes</span>}
      </div>
      {open && autos.map((a) => (
        <div key={a.id} style={{ padding: '6px 20px 6px 44px', display: 'flex', gap: 10, fontFamily: 'var(--font-ui)', fontSize: 12 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[a.status] ?? '#839496', alignSelf: 'center' }} />
          <span style={{ flex: 1 }}>{a.name}</span>
          <StatusPill status={a.status} />
        </div>
      ))}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function OrchestrationPage() {
  const isMobile = useIsMobile();
  const { selectedClientId } = useClientContext();

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [me, setMe] = useState<FaclawMe | null>(null);
  const [meErr, setMeErr] = useState<string | null>(null);
  const [agents, setAgents] = useState<FaclawAgent[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [deployed, setDeployed] = useState<DeployedAuto[]>([]);
  const [loadingAutomations, setLoadingAutomations] = useState(true);

  // Role gate
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { setAuthed(false); return; }
    sb.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email;
      const userId = data.session?.user.id;
      setAuthed(email === TREVOR_EMAIL);
      if (userId) {
        faclaw.me(userId)
          .then(setMe)
          .catch((err) => setMeErr(err instanceof Error ? err.message : String(err)));
      }
    });
  }, []);

  // Load agents once
  useEffect(() => {
    if (!authed) return;
    faclaw.listAgents().then(setAgents).catch(() => setAgents([]));
  }, [authed]);

  // Existing automations data
  const loadAutomations = useCallback(async () => {
    setLoadingAutomations(true);
    const result = await fetchClientsWithAutomations();
    setClients(result.clients);
    setDeployed(result.deployed);
    setLoadingAutomations(false);
  }, []);
  useEffect(() => { if (authed) void loadAutomations(); }, [authed, loadAutomations]);

  if (authed === null) return null;
  if (!authed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, padding: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lock" size={28} color="var(--fg-3)" />
        </div>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--fg-1)' }}>Acceso restringido</h2>
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-3)' }}>Esta sección es solo para Trevor.</p>
      </div>
    );
  }

  if (meErr) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ background: 'var(--bg-raised)', padding: 24, borderRadius: 12, border: `1px solid var(--danger)` }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--danger)', marginBottom: 8 }}>FAClaw backend unreachable</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)' }}>{meErr}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginTop: 16 }}>
            Check that <code>npx tsx src/index.ts</code> is running in <code>~/FAC/faclaw</code> and that <code>NEXT_PUBLIC_FACLAW_URL</code> + <code>NEXT_PUBLIC_FACLAW_TOKEN</code> are set in this app&apos;s <code>.env.local</code>.
          </div>
        </div>
      </div>
    );
  }

  if (!me) return <div style={{ padding: 32, fontFamily: 'var(--font-ui)', color: 'var(--fg-3)' }}>Connecting to FAClaw…</div>;

  // Existing automation stats
  const totalRunning = deployed.filter(d => d.status === 'live').length;
  const totalErrors = deployed.reduce((s, d) => s + (d.error_count ?? 0), 0);
  const totalMonthlyCost = deployed.filter(d => d.status === 'live').reduce((s, d) => s + (d.monthly_cost ?? 0), 0);

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ margin: '0 0 2px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)' }}>Orquestación</h2>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>
            FAClaw agent OS · {me.display_name} ({me.role})
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Link href="/admin/orchestration/workflows" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 6, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', textDecoration: 'none' }}>Workflows</Link>
          <Link href="/admin/orchestration/memory" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 6, background: 'var(--bg-raised)', color: 'var(--fg-1)', textDecoration: 'none' }}>Memory</Link>
          <Link href="/admin/orchestration/skills" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 6, background: 'var(--bg-raised)', color: 'var(--fg-1)', textDecoration: 'none' }}>Skills</Link>
        </div>
      </div>

      {/* Top row: console + hive */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        <AgentConsole me={me} agents={agents} />
        <HivePanel />
      </div>

      {/* Missions + scheduled */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        <MissionsPanel me={me} agents={agents} />
        <ScheduledPanel me={me} agents={agents} />
      </div>

      {/* Existing automations stats */}
      {!loadingAutomations && deployed.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard icon="zap" label="Corriendo" value={totalRunning} sub="automatizaciones live" color="#6b8e23" />
            <StatCard icon="dollar" label="Costo total" value={`$${totalMonthlyCost.toLocaleString('es-MX')}`} sub="MXN/mes (live)" color="var(--accent-primary)" />
            <StatCard icon="alert" label="Errores" value={totalErrors} sub={`${deployed.filter(d => d.status === 'failed').length} fallidas`} color={totalErrors > 0 ? '#dc322f' : 'var(--fg-3)'} />
            <StatCard icon="users" label="Clientes" value={clients.filter(c => c.status === 'active').length} sub={`${clients.length} total`} color="#268bd2" />
          </div>
          <Section title={`Deployed automations · ${clients.length} clients`}>
            {clients.length === 0
              ? <div style={{ padding: 24, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>Sin clientes aún</div>
              : clients.map((c) => <ClientRow key={c.id} client={c} autos={deployed.filter(d => d.client_id === c.id)} defaultOpen={!!selectedClientId && c.id === selectedClientId} />)
            }
          </Section>
        </>
      )}
    </div>
  );
}
