'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { useIsMobile } from '@/lib/use-mobile';
import { faclaw, type FaclawMemory, type FaclawDecayRun } from '@/lib/faclaw';

const TREVOR_EMAIL = 'trevbdev@gmail.com';

function Pill({ value, color }: { value: string | number; color?: string }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: color ?? 'var(--fg-2)', background: (color ?? 'var(--fg-3)') + '22', padding: '2px 6px', borderRadius: 4 }}>{value}</span>;
}

export default function MemoryPage() {
  const isMobile = useIsMobile();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [memories, setMemories] = useState<FaclawMemory[]>([]);
  const [decayRuns, setDecayRuns] = useState<FaclawDecayRun[]>([]);
  const [filter, setFilter] = useState<'all' | 'pinned' | 'consolidated'>('all');

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return setAuthed(false);
    sb.auth.getSession().then(({ data }) => {
      setAuthed(data.session?.user.email === TREVOR_EMAIL);
    });
  }, []);

  const load = useCallback(async () => {
    try {
      const [m, d] = await Promise.all([faclaw.listMemory({ limit: 200 }), faclaw.decayRuns(7)]);
      setMemories(m);
      setDecayRuns(d);
    } catch { /* swallow */ }
  }, []);
  useEffect(() => { if (authed) void load(); }, [authed, load]);

  if (authed === null) return null;
  if (!authed) return <div style={{ padding: 32, fontFamily: 'var(--font-body)', color: 'var(--fg-3)' }}>Acceso restringido</div>;

  const filtered = memories.filter((m) => {
    if (filter === 'pinned') return m.pinned;
    if (filter === 'consolidated') return m.consolidated;
    return true;
  });

  // Summary stats
  const total = memories.length;
  const pinned = memories.filter((m) => m.pinned).length;
  const consolidated = memories.filter((m) => m.consolidated).length;
  const avgImportance = total > 0 ? (memories.reduce((s, m) => s + m.importance, 0) / total) : 0;

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/admin/orchestration" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', textDecoration: 'none' }}>← Orquestación</Link>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)' }}>Memory</h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16 }}>
        <Stat label="Total active" value={total} />
        <Stat label="Pinned" value={pinned} />
        <Stat label="Consolidated" value={consolidated} />
        <Stat label="Avg importance" value={avgImportance.toFixed(2)} />
      </div>

      {/* Memory timeline */}
      <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--bg-inset)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Timeline ({filtered.length})</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {(['all', 'pinned', 'consolidated'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '4px 10px', borderRadius: 4, border: 0, background: filter === f ? 'var(--accent-primary)' : 'var(--bg-inset)', color: filter === f ? 'var(--fg-on-accent)' : 'var(--fg-2)', fontFamily: 'var(--font-ui)', fontSize: 12, cursor: 'pointer' }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>No memories</div>
          ) : (
            filtered.map((m) => (
              <div key={m.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--bg-inset)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {m.pinned && <Pill value="📌 pinned" color="var(--warning)" />}
                  <Pill value={`imp ${m.importance.toFixed(2)}`} color={m.importance > 0.7 ? '#6b8e23' : m.importance > 0.4 ? '#b58900' : '#839496'} />
                  <Pill value={`peak ${m.importance_peak.toFixed(2)}`} />
                  <Pill value={`sal ${m.salience}`} />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>{m.agent_id}</span>
                  {m.consolidated && <Pill value="✓ consolidated" color="#6b8e23" />}
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                {m.summary && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{m.summary}</div>}
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)', whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Decay runs */}
      <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--bg-inset)' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Decay runs (7d, {decayRuns.length})</span>
        </div>
        <div style={{ maxHeight: 240, overflowY: 'auto' }}>
          {decayRuns.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>No decay runs yet</div>
          ) : (
            decayRuns.map((r, i) => (
              <div key={i} style={{ padding: '8px 20px', borderBottom: '1px solid var(--bg-inset)', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                <span style={{ color: 'var(--fg-3)', minWidth: 70 }}>tier {r.tier}</span>
                <span style={{ color: 'var(--fg-1)' }}>{r.touched_count}↓</span>
                <span style={{ color: 'var(--warning)' }}>{r.floor_saves}⚓ saved</span>
                <span style={{ color: '#6b8e23' }}>{r.archived_count} archived</span>
                <span style={{ marginLeft: 'auto', color: 'var(--fg-3)' }}>{new Date(r.started_at).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ padding: '20px 24px', background: 'var(--bg-raised)', borderRadius: 12 }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--fg-1)' }}>{value}</div>
    </div>
  );
}
