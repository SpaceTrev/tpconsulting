'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { useIsMobile } from '@/lib/use-mobile';
import { faclaw, type FaclawCandidate, type FaclawMe } from '@/lib/faclaw';

const TREVOR_EMAIL = 'trevbdev@gmail.com';

const SIGNAL_LABELS: Record<FaclawCandidate['signal'], string> = {
  usage_threshold: 'Used 3+ times',
  pattern_recurrence: 'Recurring pattern',
  engagement_closure: 'Engagement closed',
  explicit_reaction: 'You marked save',
  owner_initiated: 'You nominated',
};

export default function SkillsPage() {
  const isMobile = useIsMobile();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [me, setMe] = useState<FaclawMe | null>(null);
  const [tab, setTab] = useState<FaclawCandidate['status']>('pending');
  const [rows, setRows] = useState<FaclawCandidate[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

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
    try { setRows(await faclaw.listCandidates(tab)); } catch { /* swallow */ }
  }, [tab]);
  useEffect(() => { if (authed) void load(); }, [authed, tab, load]);

  if (authed === null) return null;
  if (!authed) return <div style={{ padding: 32, fontFamily: 'var(--font-body)', color: 'var(--fg-3)' }}>Acceso restringido</div>;
  if (!me) return <div style={{ padding: 32, fontFamily: 'var(--font-ui)', color: 'var(--fg-3)' }}>Connecting…</div>;

  const accept = async (id: string) => {
    setBusyId(id);
    try { await faclaw.acceptCandidate(id, me.id); void load(); }
    catch (err) { alert(err instanceof Error ? err.message : String(err)); }
    finally { setBusyId(null); }
  };
  const dismiss = async (id: string) => {
    const reason = prompt('Reason (optional):') || undefined;
    setBusyId(id);
    try { await faclaw.dismissCandidate(id, me.id, reason); void load(); }
    catch (err) { alert(err instanceof Error ? err.message : String(err)); }
    finally { setBusyId(null); }
  };

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/admin/orchestration" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', textDecoration: 'none' }}>← Orquestación</Link>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)' }}>Skill candidates</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {(['pending', 'accepted', 'dismissed'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '6px 12px', borderRadius: 6, border: 0, background: tab === t ? 'var(--accent-primary)' : 'var(--bg-raised)', color: tab === t ? 'var(--fg-on-accent)' : 'var(--fg-2)', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
        {rows.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>
            No {tab} candidates
          </div>
        ) : (
          rows.map((c) => (
            <div key={c.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg-inset)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700, color: 'var(--fg-1)' }}>{c.suggested_title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{c.suggested_slug}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)', background: 'var(--accent-primary-container)', padding: '2px 6px', borderRadius: 4 }}>{SIGNAL_LABELS[c.signal]}</span>
                {c.suggested_category && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>· {c.suggested_category}</span>}
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{new Date(c.created_at).toLocaleString()}</span>
              </div>
              {c.snippet && <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)', whiteSpace: 'pre-wrap', maxHeight: 120, overflow: 'auto' }}>{c.snippet}</div>}
              {c.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {c.tags.map((t) => <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', background: 'var(--bg-inset)', padding: '2px 6px', borderRadius: 4 }}>#{t}</span>)}
                </div>
              )}
              {tab === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => void accept(c.id)} disabled={busyId === c.id}
                    style={{ padding: '6px 14px', borderRadius: 6, border: 0, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', cursor: busyId === c.id ? 'default' : 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                    {busyId === c.id ? '…' : 'Accept → publish to marketplace'}
                  </button>
                  <button onClick={() => void dismiss(c.id)} disabled={busyId === c.id}
                    style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid var(--danger)', background: 'transparent', color: 'var(--danger)', cursor: busyId === c.id ? 'default' : 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
