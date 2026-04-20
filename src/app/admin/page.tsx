'use client';

import { useMemo, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import {
  DIAGNOSTICS, LEADS, CONTACTS, PIPELINE_STAGES, TIERS,
  relTime, formatMXNshort,
} from '@/lib/admin-data';

// ── Shared primitives ────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75 }: {
  name: string; size?: number; color?: string; strokeWidth?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    clipboard:<><rect x="6" y="4" width="12" height="17" rx="1.5"/><path d="M9 4v-1h6v1"/><path d="M9 10h6M9 14h4"/></>,
    mail:     <><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></>,
    arrow:    <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    note:     <><path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4M8 9h8M8 13h5"/></>,
    arrowUp:  <path d="M12 19V5M6 11l6-6 6 6"/>,
    arrowDown:<path d="M12 5v14M6 13l6 6 6-6"/>,
    plus:     <><path d="M12 5v14M5 12h14"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19h16"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths[name] ?? null}
    </svg>
  );
}

function Dot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
      background: color, flexShrink: 0,
      boxShadow: pulse ? `0 0 0 3px ${color}33` : 'none',
    }} />
  );
}

function Card({ children, style, padded = true }: {
  children: React.ReactNode; style?: CSSProperties; padded?: boolean;
}) {
  return (
    <div style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: padded ? 20 : 0, ...style }}>
      {children}
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────
function KpiCard({ label, value, unit, delta, warning, mono, accent, onClick }: {
  label: string; value: string | number; unit: string;
  delta?: number; warning?: boolean; mono?: boolean; accent?: string; onClick?: () => void;
}) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--bg-raised)', borderRadius: 12, padding: 20, minHeight: 124,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500, color: 'var(--fg-3)', letterSpacing: '0.02em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
        <span style={{
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
          fontSize: mono ? 32 : 40, fontWeight: 500,
          color: warning ? 'var(--warning)' : (accent ?? 'var(--fg-1)'),
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>{value}</span>
        {delta != null && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
            color: delta >= 0 ? 'var(--success)' : 'var(--danger)',
          }}>
            <Icon name={delta >= 0 ? 'arrowUp' : 'arrowDown'} size={12} />
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 10 }}>{unit}</div>
    </div>
  );
}

// ── Activity Row ─────────────────────────────────────────────
type ActivityItem = { kind: string; ts: number; title: string; detail: string; onClick: () => void };

function ActivityRow({ item }: { item: ActivityItem }) {
  const iconMap: Record<string, string> = { diag: 'clipboard', contact: 'mail', stage: 'arrow', note: 'note' };
  const colorMap: Record<string, string> = {
    diag: 'var(--accent-primary)', contact: 'var(--info)',
    stage: 'var(--accent-secondary)', note: 'var(--fg-2)',
  };
  return (
    <button onClick={item.onClick} style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      width: '100%', padding: '14px 24px',
      background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
      transition: 'background 180ms',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, borderRadius: 8, background: 'var(--bg-inset)', flexShrink: 0, marginTop: 1,
      }}>
        <Icon name={iconMap[item.kind] ?? 'note'} size={14} color={colorMap[item.kind] ?? 'var(--fg-2)'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', lineHeight: 1.4 }}>{item.title}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-3)', marginTop: 3, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</div>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', flexShrink: 0, marginTop: 2 }}>{relTime(item.ts)}</span>
    </button>
  );
}

// ── Overview Page ────────────────────────────────────────────
export default function AdminOverviewPage() {
  const router = useRouter();

  const kpis = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    const newLeadsThisWeek = LEADS.filter(l => l.timeline[0]?.at > weekAgo).length + 9;
    const newLeadsLastWeek = 7;
    const pct = Math.round(((newLeadsThisWeek - newLeadsLastWeek) / newLeadsLastWeek) * 100);
    const pendingDiag = DIAGNOSTICS.filter(d => d.status === 'nuevo').length;
    const activePipeline = LEADS.filter(l =>
      ['contactado','respondio','diagnostico','propuesta','negociando'].includes(l.stage)
    ).reduce((s, l) => s + l.revenueEstimate, 0);
    const clients = LEADS.filter(l => l.stage === 'cliente').length;
    const convRate = Math.round((clients / LEADS.length) * 100);
    return { newLeadsThisWeek, pct, pendingDiag, activePipeline, convRate };
  }, []);

  const activity = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];
    DIAGNOSTICS.slice(0, 8).forEach(d => items.push({
      kind: 'diag', ts: d.submittedAt,
      title: `Nuevo diagnóstico · ${d.businessName}`,
      detail: `${TIERS.find(t => t.id === d.tier)?.label ?? d.tier} · ${d.industry}`,
      onClick: () => router.push('/admin/diagnosticos'),
    }));
    CONTACTS.slice(0, 4).forEach(c => items.push({
      kind: 'contact', ts: c.submittedAt,
      title: `Mensaje de contacto · ${c.name}`,
      detail: c.message.slice(0, 80) + (c.message.length > 80 ? '…' : ''),
      onClick: () => router.push('/admin/contactos'),
    }));
    LEADS.slice(0, 6).forEach(l => items.push({
      kind: 'stage', ts: l.timeline[l.timeline.length - 1].at,
      title: `${l.contactName} → ${PIPELINE_STAGES.find(s => s.id === l.stage)?.label ?? l.stage}`,
      detail: `${l.businessName} · ${l.industry}`,
      onClick: () => router.push('/admin/leads'),
    }));
    items.push({
      kind: 'note', ts: Date.now() - 3600000 * 2,
      title: 'Pablo añadió una nota · Dental Moderno',
      detail: '"Confirmó junta el miércoles 3pm, mandar agenda."',
      onClick: () => {},
    });
    return items.sort((a, b) => b.ts - a.ts).slice(0, 12);
  }, [router]);

  const pipeline = PIPELINE_STAGES.map(s => {
    const leads = LEADS.filter(l => l.stage === s.id);
    return { ...s, count: leads.length, value: leads.reduce((sum, l) => sum + l.revenueEstimate, 0) };
  });

  return (
    <div style={{ padding: '0 28px 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <KpiCard label="Nuevos leads" value={kpis.newLeadsThisWeek} unit="esta semana" delta={kpis.pct} accent="var(--accent-primary)" />
        <KpiCard label="Diagnósticos pendientes" value={kpis.pendingDiag} unit="sin revisar" warning={kpis.pendingDiag > 5} onClick={() => router.push('/admin/diagnosticos')} />
        <KpiCard label="Pipeline activo" value={formatMXNshort(kpis.activePipeline)} mono unit="en negociación" />
        <KpiCard label="Tasa de conversión" value={`${kpis.convRate}%`} mono unit="lead → cliente" accent="var(--success)" />
      </div>

      {/* Two-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' }}>

        {/* Activity */}
        <Card padded={false}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 12px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Actividad reciente</div>
              <h3 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--fg-1)' }}>Últimos movimientos</h3>
            </div>
            <button onClick={() => {}} style={{ background: 'transparent', border: 0, color: 'var(--accent-primary)', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Ver todo <Icon name="arrow" size={14} />
            </button>
          </div>
          <div>{activity.map((it, i) => <ActivityRow key={i} item={it} />)}</div>
        </Card>

        {/* Pipeline */}
        <Card padded={false}>
          <div style={{ padding: '20px 24px 12px' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pipeline</div>
            <h3 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--fg-1)' }}>Leads por etapa</h3>
          </div>
          <div style={{ padding: '0 12px 12px' }}>
            {pipeline.map(p => (
              <button key={p.id} onClick={() => router.push('/admin/leads')} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '10px 12px', minHeight: 44,
                background: 'transparent', border: 0, borderRadius: 8, cursor: 'pointer',
                transition: 'background 180ms', textAlign: 'left',
                opacity: 'muted' in p && p.muted ? 0.55 : 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <Dot color={p.dot} />
                <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, color: 'var(--fg-1)' }}>
                  {p.label}{'icon' in p && p.icon && <span style={{ color: p.dot, marginLeft: 4 }}>{p.icon}</span>}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
                  {p.value > 0 ? formatMXNshort(p.value) : '—'}
                </span>
                <span style={{ minWidth: 24, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>{p.count}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Acciones rápidas</span>
        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
          <button onClick={() => router.push('/admin/leads')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32,
            background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13,
          }}>
            <Icon name="plus" size={14} color="var(--fg-on-accent)" /> Nuevo lead manual
          </button>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32,
            background: 'var(--bg-raised)', color: 'var(--fg-1)',
            border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13,
          }}>
            <Icon name="download" size={14} /> Exportar CSV
          </button>
          <button onClick={() => router.push('/admin/diagnosticos')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32,
            background: 'transparent', color: 'var(--fg-2)',
            border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13,
          }}>
            Ver diagnósticos →
          </button>
        </div>
        <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', padding: '3px 7px', background: 'var(--bg-inset)', borderRadius: 4 }}>n</kbd>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>nuevo lead</span>
      </Card>
    </div>
  );
}
