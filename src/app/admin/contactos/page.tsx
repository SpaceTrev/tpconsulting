'use client';

import { useState, useMemo, CSSProperties } from 'react';
import { CONTACTS, LEADS, DIAGNOSTICS, TIERS, INDUSTRIES, relTime } from '@/lib/admin-data';

// ── Primitives ───────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75 }: {
  name: string; size?: number; color?: string; strokeWidth?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>,
    mail:     <><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></>,
    whatsapp: <><path d="M3 21l1.7-5.1a9 9 0 113.4 3.3z"/><path d="M8.5 9.5c.5 2 2 3.5 4 4l1.5-1 2.5 1-1 2.5c-3.5 0-8-4.5-8-8l2.5-1 1 2.5z" fill="currentColor" stroke="none"/></>,
    check:    <path d="M5 13l4 4L19 7"/>,
    arrow:    <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    arrowUp:  <path d="M12 19V5M6 11l6-6 6 6"/>,
    arrowDown:<path d="M12 5v14M6 13l6 6 6-6"/>,
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

function Chip({ children, color, bg }: { children: React.ReactNode; color?: string; bg?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px',
      fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
      color: color ?? 'var(--fg-2)', background: bg ?? 'var(--bg-inset)',
      borderRadius: 4, lineHeight: 1.4,
    }}>{children}</span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return <div style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: 20, ...style }}>{children}</div>;
}

// ── Status map ────────────────────────────────────────────────
const STATUS = {
  nuevo:      { bg: 'rgba(180,83,9,0.15)',  fg: '#b45309', label: 'Nuevo' },
  respondido: { bg: 'rgba(38,139,210,0.15)',fg: '#268bd2', label: 'Respondido' },
  convertido: { bg: 'rgba(107,142,35,0.15)',fg: '#6b8e23', label: 'Convertido' },
} as const;

// ── Contactos section ─────────────────────────────────────────
function ContactosSection() {
  const [q, setQ]             = useState('');
  const [status, setStatus]   = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const rows = useMemo(() => CONTACTS.filter(c => {
    if (q      && !(`${c.name} ${c.message}`.toLowerCase().includes(q.toLowerCase()))) return false;
    if (status && c.status !== status) return false;
    return true;
  }).sort((a, b) => b.submittedAt - a.submittedAt), [q, status]);

  const c = selected ? CONTACTS.find(x => x.id === selected) ?? null : null;

  return (
    <>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220, maxWidth: 360 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 12px', background: 'var(--bg-inset)', borderRadius: 8 }}>
            <Icon name="search" size={16} color="var(--fg-3)" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar nombre o mensaje…"
              style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', padding: '8px 0', minWidth: 0 }} />
          </div>
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{
          minHeight: 40, padding: '0 32px 0 12px', background: 'var(--bg-inset)', color: 'var(--fg-1)',
          fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500,
          border: 0, borderRadius: 8, outline: 'none', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23586e75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', cursor: 'pointer',
        }}>
          <option value="">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="respondido">Respondido</option>
          <option value="convertido">Convertido</option>
        </select>
        <button onClick={() => { setQ(''); setStatus(''); }} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 12px', minHeight: 40, background: 'transparent', color: 'var(--fg-2)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14 }}>
          Limpiar
        </button>
      </div>

      {/* Two-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16, alignItems: 'start' }}>

        {/* List */}
        <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
          {rows.map(r => {
            const sc = STATUS[r.status] ?? STATUS.nuevo;
            return (
              <button key={r.id} onClick={() => setSelected(r.id)} style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                width: '100%', padding: '14px 18px',
                background: selected === r.id ? 'var(--bg-inset)' : 'transparent',
                border: 0, cursor: 'pointer', textAlign: 'left',
                transition: 'background 140ms', position: 'relative',
              }}
              onMouseEnter={e => { if (selected !== r.id) e.currentTarget.style.background = 'var(--bg-inset)'; }}
              onMouseLeave={e => { if (selected !== r.id) e.currentTarget.style.background = 'transparent'; }}>
                {r.status === 'nuevo' && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2, background: 'var(--accent-primary)' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{relTime(r.submittedAt)}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.message}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Chip bg={sc.bg} color={sc.fg}>{sc.label}</Chip>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>{r.industry}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.source}</span>
                </div>
              </button>
            );
          })}
          {rows.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)', fontFamily: 'var(--font-body)' }}>Sin mensajes que coincidan.</div>
          )}
        </div>

        {/* Detail */}
        {c ? (
          <Card style={{ position: 'sticky', top: 88 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
                  {c.id} · {new Date(c.submittedAt).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                <h2 style={{ margin: '4px 0 2px', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>{c.name}</h2>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-3)' }}>{c.industry}</div>
              </div>
              <Chip bg={STATUS[c.status].bg} color={STATUS[c.status].fg}>{STATUS[c.status].label}</Chip>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
              <div style={{ padding: 12, background: 'var(--bg-inset)', borderRadius: 8 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Email</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-1)', wordBreak: 'break-all' }}>{c.email}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg-inset)', borderRadius: 8 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>WhatsApp</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)' }}>{c.whatsapp}</div>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: 16, background: 'var(--bg-inset)', borderRadius: 10 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Mensaje</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.55 }}>&ldquo;{c.message}&rdquo;</div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                <Icon name="arrow" size={14} color="var(--fg-on-accent)" /> Convertir a lead
              </button>
              <button onClick={() => window.open(`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'var(--bg-inset)', color: 'var(--fg-1)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                <Icon name="whatsapp" size={14} /> WhatsApp
              </button>
              <button onClick={() => window.open(`mailto:${c.email}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'var(--bg-inset)', color: 'var(--fg-1)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                <Icon name="mail" size={14} /> Email
              </button>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'transparent', color: 'var(--fg-2)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                <Icon name="check" size={14} /> Marcar respondido
              </button>
            </div>
          </Card>
        ) : (
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, textAlign: 'center', position: 'sticky', top: 88 }}>
            <Icon name="mail" size={36} color="var(--fg-muted)" />
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)', marginTop: 12 }}>Selecciona un mensaje para verlo aquí.</div>
          </Card>
        )}
      </div>
    </>
  );
}

// ── Métricas section ──────────────────────────────────────────
function MetricasSection() {
  const weeks = Array.from({ length: 12 }).map((_, i) => ({
    label: `S${12 - i}`,
    leads: Math.round(6 + Math.sin(i * 0.7) * 3 + i * 0.4),
    diagnosticos: Math.round(3 + Math.cos(i * 0.5) * 2 + i * 0.25),
    clientes: Math.max(0, Math.round((6 + Math.sin(i * 0.7) * 3 + i * 0.4) * 0.25)),
  })).reverse();

  const tierMix = TIERS.map(t => ({ ...t, count: DIAGNOSTICS.filter(d => d.tier === t.id).length }));
  const totalTier = tierMix.reduce((s, t) => s + t.count, 0);

  const industryMix = INDUSTRIES.map(i => ({
    name: i, count: LEADS.filter(l => l.industry === i).length,
  })).filter(x => x.count > 0).sort((a, b) => b.count - a.count).slice(0, 8);
  const topCount = industryMix[0]?.count || 1;

  const totalL    = LEADS.length;
  const contacted = LEADS.filter(l => !['nuevo'].includes(l.stage)).length;
  const responded = LEADS.filter(l => !['nuevo','contactado'].includes(l.stage)).length;
  const diag      = LEADS.filter(l => ['diagnostico','propuesta','negociando','cliente'].includes(l.stage)).length;
  const proposed  = LEADS.filter(l => ['propuesta','negociando','cliente'].includes(l.stage)).length;
  const clients   = LEADS.filter(l => l.stage === 'cliente').length;
  const funnel    = [
    { label: 'Leads', count: totalL },
    { label: 'Contactados', count: contacted },
    { label: 'Respondieron', count: responded },
    { label: 'Diagnóstico', count: diag },
    { label: 'Propuesta', count: proposed },
    { label: 'Clientes', count: clients },
  ];
  const totalRev = DIAGNOSTICS.reduce((s, d) => s + (TIERS.find(t => t.id === d.tier)?.price ?? 0), 0);
  const max = Math.max(...weeks.flatMap(w => [w.leads, w.diagnosticos, w.clientes]));

  return (
    <>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[
          { label: 'Ingresos diagnósticos', value: `$${(totalRev / 1000).toFixed(0)}K`, unit: 'últimas 12 sem', delta: 18 },
          { label: 'Leads totales', value: totalL, unit: 'en pipeline', delta: 12 },
          { label: 'Contacto→respuesta', value: `${Math.round(responded / contacted * 100)}%`, unit: 'promedio', delta: -4 },
          { label: 'Ticket promedio', value: `$${Math.round(totalRev / DIAGNOSTICS.length / 1000)}K`, unit: 'por diagnóstico', delta: 6 },
        ].map(({ label, value, unit, delta }) => (
          <div key={label} style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500, color: 'var(--fg-3)' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 500, color: 'var(--fg-1)', letterSpacing: '-0.02em' }}>{value}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: delta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                <Icon name={delta >= 0 ? 'arrowUp' : 'arrowDown'} size={11} />{Math.abs(delta)}%
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>{unit}</div>
          </div>
        ))}
      </div>

      {/* Bar chart + Tier mix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tendencia</div>
              <h3 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--fg-1)' }}>Leads · diagnósticos · clientes</h3>
            </div>
            <div style={{ display: 'flex', gap: 14, fontFamily: 'var(--font-ui)', fontSize: 12 }}>
              {[['var(--accent-primary)', 'Leads'], ['var(--info)', 'Diagnósticos'], ['var(--success)', 'Clientes']].map(([color, label]) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--fg-2)' }}>
                  <Dot color={color} /> {label}
                </span>
              ))}
            </div>
          </div>
          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 200, padding: '0 4px' }}>
            {weeks.map((w, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 170, width: '100%', justifyContent: 'center' }}>
                  <div title={`${w.leads} leads`} style={{ width: '28%', height: `${w.leads / max * 100}%`, background: 'var(--accent-primary)', borderRadius: '3px 3px 0 0' }} />
                  <div title={`${w.diagnosticos} diag`} style={{ width: '28%', height: `${w.diagnosticos / max * 100}%`, background: 'var(--info)', borderRadius: '3px 3px 0 0' }} />
                  <div title={`${w.clientes} clientes`} style={{ width: '28%', height: `${w.clientes / max * 100}%`, background: 'var(--success)', borderRadius: '3px 3px 0 0' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Mix</div>
          <h3 style={{ margin: '6px 0 18px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--fg-1)' }}>Diagnósticos por tier</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tierMix.map(t => (
              <div key={t.id}>
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', flex: 1 }}>{t.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-2)' }}>{t.count}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginLeft: 6 }}>{Math.round(t.count / totalTier * 100)}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-inset)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${t.count / totalTier * 100}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel + Industry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
        <div style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Embudo</div>
          <h3 style={{ margin: '6px 0 18px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--fg-1)' }}>Conversión de leads</h3>
          {funnel.map((f, i) => {
            const pct = f.count / funnel[0].count;
            const drop = i > 0 ? Math.round((1 - f.count / funnel[i - 1].count) * 100) : 0;
            return (
              <div key={f.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', flex: 1 }}>{f.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{f.count}</span>
                  {i > 0 && drop > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--danger)', marginLeft: 8 }}>−{drop}%</span>}
                </div>
                <div style={{ height: 22, background: 'var(--bg-inset)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct * 100}%`, background: 'linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))', opacity: 0.3 + i * 0.12 }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Industrias</div>
          <h3 style={{ margin: '6px 0 18px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--fg-1)' }}>Leads por vertical</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {industryMix.map(ind => (
              <div key={ind.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-1)', width: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ind.name}</span>
                <div style={{ flex: 1, height: 6, background: 'var(--bg-inset)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${ind.count / topCount * 100}%`, background: 'var(--accent-secondary)' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', width: 24, textAlign: 'right' }}>{ind.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function ContactosPage() {
  const [section, setSection] = useState<'contactos' | 'metricas'>('contactos');

  return (
    <div style={{ padding: '0 28px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 4, padding: '0 0 4px', borderBottom: '1px solid var(--bg-inset)' }}>
        {(['contactos', 'metricas'] as const).map(s => (
          <button key={s} onClick={() => setSection(s)} style={{
            padding: '10px 16px', background: 'transparent', border: 0,
            borderBottom: section === s ? '2px solid var(--accent-primary)' : '2px solid transparent',
            fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
            color: section === s ? 'var(--fg-1)' : 'var(--fg-3)', cursor: 'pointer', marginBottom: -1,
          }}>
            {s === 'contactos' ? 'Contactos' : 'Métricas'}
          </button>
        ))}
      </div>

      {section === 'contactos' ? <ContactosSection /> : <MetricasSection />}
    </div>
  );
}
