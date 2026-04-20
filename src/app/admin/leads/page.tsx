'use client';

import { useState, useEffect, useMemo, CSSProperties } from 'react';
import {
  PIPELINE_STAGES, ASSIGNEES, INDUSTRIES, TIERS,
  relTime, formatMXNshort, formatMXN,
  type Lead, type Diagnostic,
} from '@/lib/admin-data';
import { fetchLeads, fetchDiagnostics, updateLeadStage, addLeadNote } from '@/lib/admin-queries';

const STAGE_ORDER = ['nuevo','contactado','respondio','diagnostico','propuesta','negociando','cliente','perdido'];
function nextStage(current: string): string | null {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx < 0 || idx >= STAGE_ORDER.indexOf('cliente')) return null;
  return STAGE_ORDER[idx + 1];
}
import { useIsMobile } from '@/lib/use-mobile';

// ── Primitives ───────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75 }: {
  name: string; size?: number; color?: string; strokeWidth?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>,
    x:        <><path d="M6 6l12 12M18 6L6 18"/></>,
    plus:     <><path d="M12 5v14M5 12h14"/></>,
    kanban:   <><rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="11" rx="1"/><rect x="17" y="4" width="4" height="8" rx="1"/></>,
    table:    <><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/></>,
    arrow:    <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    chevronR: <path d="M9 6l6 6-6 6"/>,
    note:     <><path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4M8 9h8M8 13h5"/></>,
    whatsapp: <><path d="M3 21l1.7-5.1a9 9 0 113.4 3.3z"/><path d="M8.5 9.5c.5 2 2 3.5 4 4l1.5-1 2.5 1-1 2.5c-3.5 0-8-4.5-8-8l2.5-1 1 2.5z" fill="currentColor" stroke="none"/></>,
    mail:     <><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></>,
    external: <><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M20 13v6a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h6"/></>,
    bell:     <><path d="M18 15V10a6 6 0 10-12 0v5l-2 3h16z"/><path d="M10 21h4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths[name] ?? null}
    </svg>
  );
}

function Dot({ color }: { color: string }) {
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />;
}

function Avatar({ id, size = 24 }: { id: string; size?: number }) {
  const a = ASSIGNEES.find(x => x.id === id);
  if (!a) return null;
  return (
    <span title={a.name} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: 6, background: a.color, color: '#fdf6e3',
      fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: size <= 24 ? 10 : 12, letterSpacing: '0.04em', flexShrink: 0,
    }}>{a.id}</span>
  );
}

function FilterSelect({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[] | string[]; placeholder: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      minHeight: 40, padding: '0 32px 0 12px',
      background: 'var(--bg-inset)', color: 'var(--fg-1)',
      fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500,
      border: 0, borderRadius: 8, outline: 'none', appearance: 'none',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23586e75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`,
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', cursor: 'pointer',
    }}>
      <option value="">{placeholder}</option>
      {options.map(o => {
        const val = typeof o === 'string' ? o : o.value;
        const lbl = typeof o === 'string' ? o : o.label;
        return <option key={val} value={val}>{lbl}</option>;
      })}
    </select>
  );
}

// ── Lead Card (kanban) ────────────────────────────────────────
function LeadCard({ l, onClick }: { l: Lead; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const stale = l.daysInStage > 7;
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 8, padding: 14, width: '100%',
        background: 'var(--bg-raised)', border: 0, borderRadius: 10, cursor: 'pointer', textAlign: 'left',
        transform: hover ? 'translateY(-1px)' : 'none',
        transition: 'transform 160ms, box-shadow 160ms',
        boxShadow: hover ? '0 4px 12px rgba(0,22,29,0.08)' : 'none',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.contactName}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.businessName}</div>
        </div>
        <Avatar id={l.assignee} size={22} />
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as CSSProperties}>
        {l.lastNote}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)' }}>{formatMXNshort(l.revenueEstimate)}</span>
        <span style={{ flex: 1 }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: stale ? 'var(--danger)' : 'var(--fg-3)' }}>
          {stale && <Icon name="bell" size={11} />} {l.daysInStage}d
        </span>
      </div>
    </button>
  );
}

// ── Kanban Board ─────────────────────────────────────────────
function KanbanBoard({ leads, onOpen }: { leads: Lead[]; onOpen: (id: string) => void }) {
  const activeStages = PIPELINE_STAGES.filter(s => s.id !== 'perdido');
  return (
    <div style={{
      display: 'grid', gap: 12,
      gridTemplateColumns: `repeat(${activeStages.length}, minmax(220px, 1fr))`,
      overflowX: 'auto', paddingBottom: 8,
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
    } as CSSProperties}>
      {activeStages.map(stage => {
        const col = leads.filter(l => l.stage === stage.id);
        const total = col.reduce((s, l) => s + l.revenueEstimate, 0);
        return (
          <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, scrollSnapAlign: 'start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--bg-raised)', borderRadius: 10 }}>
              <Dot color={stage.dot} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stage.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{col.length}</span>
            </div>
            {total > 0 && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', padding: '0 4px' }}>{formatMXNshort(total)}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
              {col.map(l => <LeadCard key={l.id} l={l} onClick={() => onOpen(l.id)} />)}
              {col.length === 0 && (
                <div style={{ padding: 16, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-muted)', background: 'var(--bg-raised)', opacity: 0.4, borderRadius: 10, border: '1px dashed var(--fg-muted)' }}>Vacío</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Leads Table ──────────────────────────────────────────────
function LeadsTable({ leads, onOpen }: { leads: Lead[]; onOpen: (id: string) => void }) {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: 12 } as CSSProperties}>
    <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden', minWidth: 700 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.9fr 0.9fr 0.7fr',
        padding: '14px 20px', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)',
        background: 'var(--bg-inset)', borderRadius: '12px 12px 0 0',
      }}>
        <span>Contacto / Negocio</span><span>Etapa</span><span>Fuente</span>
        <span>Responsable</span><span>En etapa</span><span>Valor</span><span />
      </div>
      {leads.map(l => {
        const stage = PIPELINE_STAGES.find(s => s.id === l.stage);
        return (
          <button key={l.id} onClick={() => onOpen(l.id)} style={{
            display: 'grid', width: '100%',
            gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.9fr 0.9fr 0.7fr',
            alignItems: 'center', padding: '14px 20px', minHeight: 56,
            background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
            transition: 'background 140ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>{l.contactName}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{l.businessName} · {l.industry}</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)', fontWeight: 500 }}>
              {stage && <Dot color={stage.dot} />} {stage?.label}
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', textTransform: 'capitalize' }}>{l.source}</span>
            <span><Avatar id={l.assignee} size={24} /></span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: l.daysInStage > 7 ? 'var(--danger)' : 'var(--fg-2)' }}>{l.daysInStage}d</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)' }}>{formatMXNshort(l.revenueEstimate)}</span>
            <span style={{ textAlign: 'right', color: 'var(--fg-3)' }}><Icon name="chevronR" size={16} /></span>
          </button>
        );
      })}
      {leads.length === 0 && (
        <div style={{ padding: '56px 20px', textAlign: 'center', color: 'var(--fg-3)', fontFamily: 'var(--font-body)' }}>Sin leads para estos filtros.</div>
      )}
    </div>
    </div>
  );
}

// ── Timeline Item ────────────────────────────────────────────
function TimelineItem({ dot, time, children }: { dot: string; time: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', paddingBottom: 18 }}>
      <div style={{ position: 'absolute', left: -24, top: 0, width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>{children}</div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', flexShrink: 0 }}>{time}</span>
      </div>
    </div>
  );
}

// ── Lead Drawer ──────────────────────────────────────────────
function LeadDrawer({ leadId, leads, diagnostics, onRefresh, onClose }: { leadId: string; leads: Lead[]; diagnostics: Diagnostic[]; onRefresh: () => void; onClose: () => void }) {
  const l = leads.find(x => x.id === leadId);
  const [tab, setTab] = useState<'timeline' | 'info' | 'diag'>('timeline');
  const [noteDraft, setNoteDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();
  if (!l) return null;
  const stage = PIPELINE_STAGES.find(s => s.id === l.stage);
  const linkedDiag = l.linkedDiagnostic ? diagnostics.find(d => d.id === l.linkedDiagnostic) : null;
  const next = nextStage(l.stage);

  async function handleAdvanceStage() {
    if (!next) return;
    setSaving(true);
    await updateLeadStage(l!, next);
    onRefresh();
    setSaving(false);
  }

  async function handleSaveNote() {
    if (!noteDraft.trim()) return;
    setSaving(true);
    await addLeadNote(l!, noteDraft.trim(), 'TB');
    setNoteDraft('');
    onRefresh();
    setSaving(false);
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,22,29,0.4)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', zIndex: 40 } as CSSProperties} />
      <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: isMobile ? '100vw' : 680, maxWidth: isMobile ? '100vw' : '95vw', background: 'var(--bg-canvas)', zIndex: 50, overflowY: 'auto', boxShadow: '-24px 0 48px rgba(0,22,29,0.12)' }}>

        {/* Header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, padding: '24px 28px 16px', background: 'var(--frost-bg)', backdropFilter: 'var(--frost-blur)' } as CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{l.id}</span>
                <span style={{ color: 'var(--fg-muted)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', textTransform: 'capitalize' }}>
                  {l.source === 'diagnostico' && l.linkedDiagnostic ? `vía ${l.linkedDiagnostic}` : `vía ${l.source}`}
                </span>
              </div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>{l.contactName}</h2>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-2)', marginTop: 4 }}>{l.businessName} · {l.industry}</div>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, border: 0, background: 'var(--bg-raised)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Stage strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 18, padding: 4, background: 'var(--bg-raised)', borderRadius: 8, overflowX: 'auto' }}>
            {PIPELINE_STAGES.filter(s => s.id !== 'perdido').map((s, i) => {
              const activeIdx = PIPELINE_STAGES.findIndex(x => x.id === l.stage);
              const reached = i <= activeIdx;
              const current = s.id === l.stage;
              return (
                <div key={s.id} style={{
                  flex: current ? '1 1 auto' : '0 0 auto',
                  padding: '6px 10px', borderRadius: 6,
                  background: current ? 'var(--bg-canvas)' : 'transparent',
                  fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: current ? 700 : 500,
                  color: current ? s.dot : (reached ? 'var(--fg-2)' : 'var(--fg-muted)'),
                  display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  <Dot color={reached ? s.dot : '#93a1a1'} />
                  {current ? s.label : ''}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {next && (
              <button onClick={handleAdvanceStage} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: 0, borderRadius: 8, cursor: saving ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                <Icon name="arrow" size={14} color="var(--fg-on-accent)" /> → {PIPELINE_STAGES.find(s => s.id === next)?.label ?? next}
              </button>
            )}
            <button onClick={() => window.open(`https://wa.me/${l.whatsapp.replace(/\D/g, '')}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
              <Icon name="whatsapp" size={14} /> WhatsApp
            </button>
            <button onClick={() => window.open(`mailto:${l.email}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
              <Icon name="mail" size={14} /> Email
            </button>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'transparent', color: 'var(--fg-2)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
              <Icon name="note" size={14} /> Nota
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>Asignado a</span>
              <Avatar id={l.assignee} size={26} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '16px 28px 0', display: 'flex', gap: 4, borderBottom: '1px solid var(--bg-inset)' }}>
          {(['timeline', 'info', 'diag'] as const).map(k => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '10px 14px', background: 'transparent', border: 0,
              borderBottom: tab === k ? '2px solid var(--accent-primary)' : '2px solid transparent',
              fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
              color: tab === k ? 'var(--fg-1)' : 'var(--fg-3)', cursor: 'pointer', marginBottom: -1,
            }}>
              {{ timeline: 'Timeline', info: 'Datos', diag: 'Diagnóstico' }[k]}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 28px 80px' }}>
          {tab === 'timeline' && (
            <>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input value={noteDraft} onChange={e => setNoteDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveNote(); } }}
                  placeholder="Añadir una nota o actualización…"
                  style={{ flex: 1, minHeight: 44, padding: '0 14px', background: 'var(--bg-raised)', border: 0, borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', outline: 'none' }} />
                <button onClick={handleSaveNote} disabled={saving || !noteDraft.trim()} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 16px', minHeight: 44, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: 0, borderRadius: 8, cursor: saving ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, opacity: !noteDraft.trim() ? 0.5 : 1 }}>Guardar</button>
              </div>
              <div style={{ position: 'relative', paddingLeft: 24 }}>
                <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 1, background: 'var(--bg-inset)' }} />
                {[...l.notes].reverse().map((n, i) => {
                  const a = ASSIGNEES.find(x => x.id === n.author);
                  return (
                    <TimelineItem key={i} dot="var(--fg-3)" time={relTime(n.at)}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)' }}>{n.text}</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{a?.name}</div>
                    </TimelineItem>
                  );
                })}
                {[...l.timeline].reverse().map((t, i) => {
                  const s = PIPELINE_STAGES.find(x => x.id === t.stage);
                  return (
                    <TimelineItem key={'t' + i} dot={s?.dot ?? '#839496'} time={relTime(t.at)}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)' }}>Movido a <strong>{s?.label}</strong></div>
                    </TimelineItem>
                  );
                })}
              </div>
            </>
          )}

          {tab === 'info' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {([
                ['WhatsApp', <span style={{ fontFamily: 'var(--font-mono)' }}>{l.whatsapp}</span>],
                ['Email', <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{l.email}</span>],
                ['Industria', l.industry],
                ['Fuente', <span style={{ textTransform: 'capitalize' }}>{l.source}</span>],
                ['Valor estimado', <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>{formatMXN(l.revenueEstimate)}</span>],
                ['Próxima acción', l.nextAction],
              ] as [string, React.ReactNode][]).map(([label, value]) => (
                <div key={label} style={{ padding: 14, background: 'var(--bg-raised)', borderRadius: 10 }}>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500, color: 'var(--fg-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', wordBreak: 'break-word' }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'diag' && (
            l.linkedDiagnostic && linkedDiag ? (
              <div style={{ padding: 20, background: 'var(--bg-raised)', borderRadius: 12 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>Este lead vino del diagnóstico</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--fg-1)', marginBottom: 12 }}>{l.linkedDiagnostic}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', marginBottom: 16 }}>{linkedDiag.businessName} · {linkedDiag.industry}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {TIERS.filter(t => t.id === linkedDiag.tier).map(t => (
                    <span key={t.id} style={{ padding: '3px 9px', borderRadius: 4, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, background: `${t.color}22`, color: t.color }}>{t.label} · ${t.price / 1000}K</span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)', fontFamily: 'var(--font-body)' }}>Lead manual · sin diagnóstico vinculado.</div>
            )
          )}
        </div>
      </aside>
    </>
  );
}

// ── Leads Page ────────────────────────────────────────────────
export default function LeadsPage() {
  const isMobile = useIsMobile();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [view, setView]         = useState<'kanban' | 'table'>('kanban');
  const [q, setQ]               = useState('');
  const [assignee, setAssignee] = useState('');
  const [source, setSource]     = useState('');
  const [industry, setIndustry] = useState('');
  const [openId, setOpenId]     = useState<string | null>(null);

  useEffect(() => {
    fetchLeads().then(setLeads);
    fetchDiagnostics().then(setDiagnostics);
  }, []);

  // Force table view on mobile for better readability
  const activeView = isMobile ? 'table' : view;

  const filtered = useMemo(() => leads.filter(l => {
    if (q        && !(`${l.contactName} ${l.businessName}`.toLowerCase().includes(q.toLowerCase()))) return false;
    if (assignee && l.assignee !== assignee) return false;
    if (source   && l.source !== source) return false;
    if (industry && l.industry !== industry) return false;
    return true;
  }), [leads, q, assignee, source, industry]);

  return (
    <div style={{ padding: isMobile ? '0 16px 48px' : '0 28px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220, maxWidth: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 12px', background: 'var(--bg-inset)', borderRadius: 8 }}>
            <Icon name="search" size={16} color="var(--fg-3)" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar lead…"
              style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', padding: '8px 0', minWidth: 0 }} />
          </div>
        </div>
        <FilterSelect value={assignee} onChange={setAssignee} placeholder="Cualquier responsable"
          options={ASSIGNEES.map(a => ({ value: a.id, label: a.name }))} />
        <FilterSelect value={source} onChange={setSource} placeholder="Cualquier fuente"
          options={[
            { value: 'diagnostico', label: 'Diagnóstico' },
            { value: 'contacto', label: 'Formulario' },
            { value: 'manual', label: 'Manual' },
            { value: 'referido', label: 'Referido' },
          ]} />
        <FilterSelect value={industry} onChange={setIndustry} placeholder="Industria" options={INDUSTRIES} />

        {/* View toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, padding: 3, background: 'var(--bg-raised)', borderRadius: 8 }}>
          {(['kanban', 'table'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', minHeight: 32,
              background: view === v ? 'var(--bg-canvas)' : 'transparent',
              color: view === v ? 'var(--fg-1)' : 'var(--fg-3)',
              border: 0, borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
            }}>
              <Icon name={v === 'kanban' ? 'kanban' : 'table'} size={14} />
              {v === 'kanban' ? 'Kanban' : 'Tabla'}
            </button>
          ))}
        </div>

        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 16px', minHeight: 40, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14 }}>
          <Icon name="plus" size={14} color="var(--fg-on-accent)" /> Nuevo lead
        </button>
      </div>

      {activeView === 'kanban'
        ? <KanbanBoard leads={filtered} onOpen={setOpenId} />
        : <LeadsTable leads={filtered} onOpen={setOpenId} />
      }

      {openId && <LeadDrawer leadId={openId} leads={leads} diagnostics={diagnostics} onRefresh={() => fetchLeads().then(setLeads)} onClose={() => setOpenId(null)} />}
    </div>
  );
}
