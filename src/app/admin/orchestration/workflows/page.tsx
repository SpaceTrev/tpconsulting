'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { useIsMobile } from '@/lib/use-mobile';
import { faclaw, type FaclawWorkflow, type FaclawWorkflowRun, type FaclawMe } from '@/lib/faclaw';

const TREVOR_EMAIL = 'trevbdev@gmail.com';

const STATUS_COLOR: Record<string, string> = {
  pending: '#b58900', running: '#268bd2',
  awaiting_approval: '#cb4b16', completed: '#6b8e23',
  failed: '#dc322f', cancelled: '#839496', paused: '#839496',
};

function StatusPill({ status }: { status: string }) {
  const c = STATUS_COLOR[status] ?? '#839496';
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: c, background: c + '22', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{status.replace('_', ' ')}</span>;
}

function relTime(ts: string | null): string {
  if (!ts) return '—';
  const ms = Date.now() - new Date(ts).getTime();
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  if (ms < 86_400_000) return `${Math.round(ms / 3_600_000)}h`;
  return `${Math.round(ms / 86_400_000)}d`;
}

export default function WorkflowsPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [me, setMe] = useState<FaclawMe | null>(null);
  const [workflows, setWorkflows] = useState<FaclawWorkflow[]>([]);
  const [runs, setRuns] = useState<FaclawWorkflowRun[]>([]);
  const [running, setRunning] = useState<string | null>(null);
  const [showRunFor, setShowRunFor] = useState<FaclawWorkflow | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return setAuthed(false);
    sb.auth.getSession().then(({ data }) => {
      const userId = data.session?.user.id;
      setAuthed(data.session?.user.email === TREVOR_EMAIL);
      if (userId) faclaw.me(userId).then(setMe).catch(() => setMe(null));
    });
  }, []);

  const load = useCallback(async () => {
    try {
      const [w, r] = await Promise.all([faclaw.listWorkflows(), faclaw.listRuns(undefined, 30)]);
      setWorkflows(w);
      setRuns(r);
    } catch { /* swallow */ }
  }, []);
  useEffect(() => { if (authed) { void load(); const id = setInterval(load, 5000); return () => clearInterval(id); } }, [authed, load]);

  if (authed === null) return null;
  if (!authed) return <div style={{ padding: 32, fontFamily: 'var(--font-body)', color: 'var(--fg-3)' }}>Acceso restringido</div>;
  if (!me) return <div style={{ padding: 32, fontFamily: 'var(--font-ui)', color: 'var(--fg-3)' }}>Connecting…</div>;

  const fireRun = async () => {
    if (!showRunFor || !me) return;
    setRunning(showRunFor.slug);
    try {
      const r = await faclaw.runWorkflow(showRunFor.slug, me.id, inputs, null);
      setShowRunFor(null);
      setInputs({});
      router.push(`/admin/orchestration/runs/${r.run_id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally { setRunning(null); }
  };

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/admin/orchestration" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', textDecoration: 'none' }}>← Orquestación</Link>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)' }}>Workflows</h2>
      </div>

      {/* Templates */}
      <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--bg-inset)' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Templates ({workflows.length})</span>
        </div>
        {workflows.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>No workflows seeded</div>
        ) : workflows.map((w) => (
          <div key={w.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--bg-inset)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, color: 'var(--fg-1)' }}>{w.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{w.slug} · v{w.version}</div>
              {w.description && <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-2)', marginTop: 4 }}>{w.description}</div>}
            </div>
            <button onClick={() => { setShowRunFor(w); setInputs({}); }}
              style={{ padding: '6px 14px', borderRadius: 6, border: 0, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
              Run
            </button>
          </div>
        ))}
      </div>

      {/* Run modal */}
      {showRunFor && (
        <div onClick={() => setShowRunFor(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--bg-canvas)', borderRadius: 12, padding: 24, maxWidth: 560, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{showRunFor.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginBottom: 16 }}>{showRunFor.slug}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* The dashboard doesn't yet know the input schema — workflow_definition isn't shipped yet. Free-form key/value entry. */}
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>Inputs (key=value pairs):</div>
              <textarea value={Object.entries(inputs).map(([k, v]) => `${k}=${v}`).join('\n')}
                onChange={(e) => {
                  const obj: Record<string, string> = {};
                  for (const line of e.target.value.split('\n')) {
                    const eq = line.indexOf('=');
                    if (eq > 0) obj[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
                  }
                  setInputs(obj);
                }}
                placeholder="lead_id=...\nlead_email=jane@example.com"
                style={{ minHeight: 120, padding: '8px 10px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 12, resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowRunFor(null)}
                  style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--outline)', background: 'transparent', color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                  Cancel
                </button>
                <button onClick={() => void fireRun()} disabled={running !== null}
                  style={{ padding: '8px 16px', borderRadius: 6, border: 0, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', cursor: running ? 'default' : 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                  {running ? 'Starting…' : 'Start run'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent runs */}
      <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--bg-inset)' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent runs ({runs.length})</span>
        </div>
        {runs.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>No runs yet</div>
        ) : runs.map((r) => (
          <Link key={r.id} href={`/admin/orchestration/runs/${r.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: '1px solid var(--bg-inset)', textDecoration: 'none', color: 'inherit' }}>
            <StatusPill status={r.status} />
            <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)' }}>{r.workflow_name ?? r.workflow_id}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{r.current_step_id ?? '—'}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{relTime(r.started_at)} ago</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
