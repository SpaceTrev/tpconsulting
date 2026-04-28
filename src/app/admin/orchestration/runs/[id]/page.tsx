'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { useIsMobile } from '@/lib/use-mobile';
import { faclaw, type FaclawWorkflowRun, type FaclawWorkflowStep } from '@/lib/faclaw';

const TREVOR_EMAIL = 'trevbdev@gmail.com';

const STATUS_COLOR: Record<string, string> = {
  pending: '#b58900', running: '#268bd2',
  awaiting_approval: '#cb4b16', completed: '#6b8e23',
  approved: '#6b8e23', rejected: '#dc322f',
  failed: '#dc322f', cancelled: '#839496',
  paused: '#839496', skipped: '#839496',
};

function StatusPill({ status }: { status: string }) {
  const c = STATUS_COLOR[status] ?? '#839496';
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: c, background: c + '22', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{status.replace('_', ' ')}</span>;
}

function dur(ms: number | null): string {
  if (!ms) return '—';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

interface RunData {
  run: FaclawWorkflowRun & { workflow_definition?: unknown };
  steps: FaclawWorkflowStep[];
}

export default function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isMobile = useIsMobile();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [data, setData] = useState<RunData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return setAuthed(false);
    sb.auth.getSession().then(({ data }) => {
      setAuthed(data.session?.user.email === TREVOR_EMAIL);
    });
  }, []);

  const load = useCallback(async () => {
    try { setData(await faclaw.getRun(id)); setErr(null); }
    catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
  }, [id]);
  useEffect(() => {
    if (!authed) return;
    void load();
    const handle = setInterval(load, 3000);
    return () => clearInterval(handle);
  }, [authed, load]);

  if (authed === null) return null;
  if (!authed) return <div style={{ padding: 32, fontFamily: 'var(--font-body)', color: 'var(--fg-3)' }}>Acceso restringido</div>;
  if (err) return <div style={{ padding: 32, fontFamily: 'var(--font-body)', color: 'var(--danger)' }}>Error: {err}</div>;
  if (!data) return <div style={{ padding: 32, fontFamily: 'var(--font-ui)', color: 'var(--fg-3)' }}>Loading…</div>;

  const { run, steps } = data;

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/admin/orchestration/workflows" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', textDecoration: 'none' }}>← Workflows</Link>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)' }}>{run.workflow_name ?? 'Workflow run'}</h2>
        <StatusPill status={run.status} />
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{run.id.slice(0, 8)}</div>
      </div>

      {/* Run metadata */}
      <div style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: '16px 20px', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16 }}>
        <Stat label="Trigger" value={run.trigger_kind} />
        <Stat label="Started" value={run.started_at ? new Date(run.started_at).toLocaleString() : '—'} />
        <Stat label="Completed" value={run.completed_at ? new Date(run.completed_at).toLocaleString() : '—'} />
        <Stat label="Current step" value={run.current_step_id ?? '—'} mono />
      </div>

      {run.error && (
        <div style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: 16, border: '1px solid var(--danger)' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Error</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-1)', whiteSpace: 'pre-wrap' }}>{run.error}</div>
        </div>
      )}

      {/* Step timeline */}
      <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--bg-inset)' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Steps ({steps.length})</span>
        </div>
        {steps.length === 0
          ? <div style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>No steps yet — runner is bootstrapping</div>
          : steps.map((s) => <StepRow key={s.id} step={s} />)
        }
      </div>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 13, color: 'var(--fg-1)' }}>{value}</div>
    </div>
  );
}

function StepRow({ step }: { step: FaclawWorkflowStep }) {
  const [open, setOpen] = useState(step.status === 'running' || step.status === 'awaiting_approval');
  const outputText = (step.output as { text?: string; summary?: string; decision?: string; edited?: string | null } | null)?.text
    ?? (step.output as { summary?: string } | null)?.summary
    ?? '';
  const inputText = (step.input as { rendered?: string; summary?: string } | null)?.rendered
    ?? (step.input as { summary?: string } | null)?.summary
    ?? '';

  return (
    <div style={{ borderBottom: '1px solid var(--bg-inset)' }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', cursor: 'pointer' }}>
        <StatusPill status={step.status} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', flex: 1 }}>{step.name}</span>
        {step.agent_id && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>{step.agent_id}</span>}
        {step.approval_required && !step.agent_id && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--warning)' }}>approval gate</span>}
        {step.duration_ms && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{dur(step.duration_ms)}</span>}
        {step.cost_usd && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>${parseFloat(step.cost_usd).toFixed(4)}</span>}
      </div>
      {open && (
        <div style={{ padding: '0 20px 16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {step.prompt_ref && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>prompt: {step.prompt_ref}</div>}
          {inputText && (
            <details>
              <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Input</summary>
              <pre style={{ marginTop: 8, padding: 12, background: 'var(--bg-canvas)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)', whiteSpace: 'pre-wrap', maxHeight: 240, overflow: 'auto' }}>{inputText}</pre>
            </details>
          )}
          {outputText && (
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Output</div>
              <pre style={{ padding: 12, background: 'var(--bg-canvas)', border: '1px solid var(--outline-variant)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-1)', whiteSpace: 'pre-wrap', maxHeight: 480, overflow: 'auto' }}>{outputText}</pre>
            </div>
          )}
          {step.approval_required && step.status === 'awaiting_approval' && (
            <div style={{ padding: 12, background: 'var(--accent-primary-container, var(--bg-canvas))', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-1)' }}>
              ⏳ Waiting for approval. Check Discord DMs for the approval card with Approve / Reject / Edit buttons.
            </div>
          )}
          {step.approval_reply && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
              decision: <span style={{ color: 'var(--fg-1)', fontWeight: 600 }}>{step.approval_reply.startsWith('edit:') ? 'edit' : step.approval_reply}</span>
              {step.approved_at && ` at ${new Date(step.approved_at).toLocaleTimeString()}`}
            </div>
          )}
          {step.error && (
            <pre style={{ padding: 12, background: 'var(--bg-canvas)', border: '1px solid var(--danger)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--danger)', whiteSpace: 'pre-wrap' }}>{step.error}</pre>
          )}
        </div>
      )}
    </div>
  );
}
