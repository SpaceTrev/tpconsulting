'use client';

import { useState, useEffect, useMemo, CSSProperties } from 'react';
import {
  TIERS, INDUSTRIES, URGENCIES, type Diagnostic,
  relTime,
} from '@/lib/admin-data';
import {
  fetchDiagnostics, updateDiagnosticStatus, convertDiagnosticToLead,
} from '@/lib/admin-queries';
import { useIsMobile } from '@/lib/use-mobile';

// ── Primitives ───────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75 }: {
  name: string; size?: number; color?: string; strokeWidth?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>,
    x:        <><path d="M6 6l12 12M18 6L6 18"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19h16"/></>,
    check:    <path d="M5 13l4 4L19 7"/>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    arrow:    <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    whatsapp: <><path d="M3 21l1.7-5.1a9 9 0 113.4 3.3z"/><path d="M8.5 9.5c.5 2 2 3.5 4 4l1.5-1 2.5 1-1 2.5c-3.5 0-8-4.5-8-8l2.5-1 1 2.5z" fill="currentColor" stroke="none"/></>,
    mail:     <><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></>,
    dots:     <><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/></>,
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

// ── Color maps ────────────────────────────────────────────────
const TIER_COLORS: Record<string, { bg: string; fg: string }> = {
  escaneo:    { bg: 'rgba(107,142,35,0.15)',  fg: '#6b8e23' },
  diagnostico:{ bg: 'rgba(38,139,210,0.15)',  fg: '#268bd2' },
  plan:       { bg: 'rgba(181,137,0,0.15)',   fg: '#b58900' },
  ejecutivo:  { bg: 'rgba(180,83,9,0.15)',    fg: '#b45309' },
};
const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  nuevo:      { bg: 'rgba(180,83,9,0.15)',   fg: '#b45309' },
  revisado:   { bg: 'rgba(131,148,150,0.2)', fg: '#586e75' },
  contactado: { bg: 'rgba(38,139,210,0.15)', fg: '#268bd2' },
  convertido: { bg: 'rgba(107,142,35,0.15)', fg: '#6b8e23' },
};
const URG_COLORS: Record<string, string> = {
  asap: '#dc322f', '1-2-meses': '#b58900', explorando: '#839496',
};

// ── DiagRow ──────────────────────────────────────────────────
function DiagRow({ d, onClick }: { d: Diagnostic; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const tier = TIERS.find(t => t.id === d.tier)!;
  const urg  = URGENCIES.find(u => u.id === d.urgency)!;
  const date = new Date(d.submittedAt);
  const tc   = TIER_COLORS[d.tier] ?? TIER_COLORS.escaneo;
  const sc   = STATUS_COLORS[d.status] ?? STATUS_COLORS.nuevo;
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', width: '100%',
        gridTemplateColumns: '110px 1.8fr 1.1fr 1.1fr 0.9fr 0.9fr',
        alignItems: 'center', padding: '14px 20px', minHeight: 60,
        background: hover ? 'var(--bg-inset)' : 'transparent',
        border: 0, cursor: 'pointer', textAlign: 'left',
        transition: 'background 140ms', position: 'relative',
      }}>
      {d.status === 'nuevo' && (
        <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2, background: 'var(--accent-primary)' }} />
      )}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)' }}>
          {date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{relTime(d.submittedAt)}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.businessName}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{d.contact.name} · {d.stage1.city}</div>
      </div>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)' }}>{d.industry}</span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'center',
        padding: '3px 9px', borderRadius: 4, width: 'fit-content',
        fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
        background: tc.bg, color: tc.fg,
      }}>
        <span>{tier.label}</span>
        <span style={{ opacity: 0.7, fontFamily: 'var(--font-mono)' }}>${tier.price / 1000}K</span>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)', fontWeight: 500 }}>
        <Dot color={URG_COLORS[d.urgency] ?? '#839496'} pulse={d.urgency === 'asap'} />
        {urg?.label}
      </span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 4, width: 'fit-content',
        fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
        background: sc.bg, color: sc.fg,
      }}>
        {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
      </span>
    </button>
  );
}

// ── DiagSection ──────────────────────────────────────────────
function DiagSection({ title, eyebrow, children, highlight }: {
  title: string; eyebrow: string; children: React.ReactNode; highlight?: boolean;
}) {
  return (
    <section style={{ padding: 20, background: 'var(--bg-raised)', borderRadius: 12, position: 'relative' }}>
      {highlight && <span style={{ position: 'absolute', top: 20, left: 0, width: 3, height: 24, background: 'var(--accent-primary)', borderRadius: 2 }} />}
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: highlight ? 'var(--accent-primary)' : 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{eyebrow}</div>
      <h3 style={{ margin: '4px 0 14px', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </section>
  );
}

function InfoGrid({ pairs }: { pairs: [string, React.ReactNode][] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
      {pairs.map(([k, v], i) => (
        <div key={i}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500, color: 'var(--fg-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', lineHeight: 1.45 }}>{v ?? '—'}</div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500, color: 'var(--fg-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

// ── Diagnostic Drawer ────────────────────────────────────────
function DiagnosticDrawer({ diagId, diagnostics, onRefresh, onClose }: { diagId: string; diagnostics: Diagnostic[]; onRefresh: () => void; onClose: () => void }) {
  const d = diagnostics.find(x => x.id === diagId);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();
  if (!d) return null;

  async function handleMarkReviewed() {
    setSaving(true);
    await updateDiagnosticStatus(d!.id, 'revisado');
    onRefresh();
    setSaving(false);
  }

  async function handleConvertToLead() {
    setSaving(true);
    const ok = await convertDiagnosticToLead(d!);
    if (ok) { onRefresh(); onClose(); }
    setSaving(false);
  }
  const tier = TIERS.find(t => t.id === d.tier)!;
  const urg  = URGENCIES.find(u => u.id === d.urgency)!;
  const tc   = TIER_COLORS[d.tier] ?? TIER_COLORS.escaneo;
  const sc   = STATUS_COLORS[d.status] ?? STATUS_COLORS.nuevo;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,22,29,0.4)',
        backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
        zIndex: 40,
      } as CSSProperties} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: isMobile ? '100vw' : 640, maxWidth: isMobile ? '100vw' : '95vw',
        background: 'var(--bg-canvas)', zIndex: 50, overflowY: 'auto',
        boxShadow: '-24px 0 48px rgba(0,22,29,0.12)',
      }}>
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, padding: '24px 28px 20px', background: 'var(--frost-bg)', backdropFilter: 'var(--frost-blur)' } as CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{d.id}</span>
                <span style={{ color: 'var(--fg-muted)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>
                  {new Date(d.submittedAt).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.fg }}>
                  {d.status.toUpperCase()}
                </span>
              </div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>{d.businessName}</h2>
              <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                <Chip bg={tc.bg} color={tc.fg}>{tier.label} · ${tier.price / 1000}K MXN</Chip>
                <Chip bg="var(--bg-inset)"><Dot color={URG_COLORS[d.urgency] ?? '#839496'} pulse={d.urgency === 'asap'} /> {urg?.label}</Chip>
                <Chip bg="var(--bg-inset)" color={d.paymentStatus === 'pagado' ? 'var(--success)' : 'var(--warning)'}>
                  <Icon name={d.paymentStatus === 'pagado' ? 'check' : 'calendar'} size={12} />
                  Pago {d.paymentStatus}
                </Chip>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, border: 0, background: 'var(--bg-raised)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            <button onClick={handleConvertToLead} disabled={saving || d.status === 'convertido'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: 0, borderRadius: 8, cursor: saving ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, opacity: d.status === 'convertido' ? 0.5 : 1 }}>
              <Icon name="arrow" size={14} color="var(--fg-on-accent)" /> {d.status === 'convertido' ? 'Ya convertido' : 'Convertir a lead'}
            </button>
            <button onClick={() => window.open(`https://wa.me/${d.contact.whatsapp.replace(/\D/g, '')}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
              <Icon name="whatsapp" size={14} /> WhatsApp
            </button>
            <button onClick={() => window.open(`mailto:${d.contact.email}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
              <Icon name="mail" size={14} /> Email
            </button>
            {d.status === 'nuevo' && (
              <button onClick={handleMarkReviewed} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px', minHeight: 32, background: 'transparent', color: 'var(--fg-2)', border: 0, borderRadius: 8, cursor: saving ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                <Icon name="check" size={14} /> Marcar revisado
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 28px 80px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <DiagSection title="Contacto" eyebrow="PASO 0">
            <InfoGrid pairs={[
              ['Nombre', d.contact.name],
              ['WhatsApp', <span style={{ fontFamily: 'var(--font-mono)' }}>{d.contact.whatsapp}</span>],
              ['Email', <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{d.contact.email}</span>],
              ['Prefiere', d.contact.preference === 'whatsapp' ? '💬 WhatsApp' : '✉️ Email'],
            ]} />
          </DiagSection>

          <DiagSection title="Sobre el negocio" eyebrow="PASO 1">
            <InfoGrid pairs={[
              ['Industria', d.industry],
              ['Ciudad', d.stage1.city],
              ['Empleados', <span style={{ fontFamily: 'var(--font-mono)' }}>{d.stage1.employees}</span>],
              ['Antigüedad', <span style={{ fontFamily: 'var(--font-mono)' }}>{d.stage1.ageYears} años</span>],
            ]} />
          </DiagSection>

          <DiagSection title="Operación actual" eyebrow="PASO 2">
            <InfoGrid pairs={[
              ['Canales', d.stage2.channels.join(', ')],
              ['Tiempo respuesta', d.stage2.responseTime],
              ['CRM/herramientas', d.stage2.crm],
              ['Facturación CFDI', d.stage2.cfdi],
              ['Google Business', d.stage2.googleBusiness ? 'Sí' : 'No'],
            ]} />
          </DiagSection>

          <DiagSection title="Dolor & aspiración" eyebrow="PASO 3" highlight>
            <Field label="¿En qué pierde más tiempo?">
              <span style={{ color: 'var(--fg-1)', fontWeight: 500 }}>{d.stage3.timeWaste}</span>
            </Field>
            <Field label="Si pudiera cambiar UNA cosa…">
              <blockquote style={{ margin: 0, padding: '12px 16px', background: 'var(--bg-inset)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-1)', fontStyle: 'italic', lineHeight: 1.5 }}>
                &ldquo;{d.stage3.oneThing}&rdquo;
              </blockquote>
            </Field>
            <Field label="Intentos pasados">
              <span style={{ color: 'var(--fg-2)' }}>{d.stage3.pastAttempts}</span>
            </Field>
            <Field label="¿Pierde clientes por falta de seguimiento?">
              <Chip bg={d.stage3.losingCustomers ? 'rgba(220,50,47,0.12)' : 'rgba(107,142,35,0.12)'}
                color={d.stage3.losingCustomers ? 'var(--danger)' : 'var(--success)'}>
                {d.stage3.losingCustomers ? 'Sí — hay fuga' : 'No reportado'}
              </Chip>
            </Field>
            <Field label="Herramientas actuales">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {d.stage3.currentTools.map(t => <Chip key={t}>{t}</Chip>)}
              </div>
            </Field>
          </DiagSection>

          <DiagSection title="Presupuesto & contexto" eyebrow="PASO 4">
            <InfoGrid pairs={[
              ['Gasto actual en software', <span style={{ fontFamily: 'var(--font-mono)' }}>{d.stage4.currentSpend}</span>],
              ['Presupuesto', <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>{d.stage4.budget}</span>],
              ['Ingresos mensuales', <span style={{ fontFamily: 'var(--font-mono)' }}>{d.stage4.revenue}</span>],
            ]} />
            {d.stage4.notes && (
              <Field label="Notas adicionales">
                <span style={{ color: 'var(--fg-2)', fontStyle: 'italic' }}>{d.stage4.notes}</span>
              </Field>
            )}
          </DiagSection>
        </div>
      </aside>
    </>
  );
}

// ── Select + TextInput helpers ────────────────────────────────
function FilterInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 12px', background: 'var(--bg-inset)', borderRadius: 8 }}>
      <Icon name="search" size={16} color="var(--fg-3)" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', padding: '8px 0', minWidth: 0 }} />
    </div>
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
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
      cursor: 'pointer',
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

// ── Page ─────────────────────────────────────────────────────
export default function DiagnosticosPage() {
  const isMobile = useIsMobile();
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [tier, setTier]         = useState('');
  const [industry, setIndustry] = useState('');
  const [urgency, setUrgency]   = useState('');
  const [status, setStatus]     = useState('');
  const [q, setQ]               = useState('');
  const [openId, setOpenId]     = useState<string | null>(null);

  useEffect(() => { fetchDiagnostics().then(setDiagnostics); }, []);

  const filtered = useMemo(() => {
    return diagnostics.filter(d => {
      if (tier     && d.tier !== tier) return false;
      if (industry && d.industry !== industry) return false;
      if (urgency  && d.urgency !== urgency) return false;
      if (status   && d.status !== status) return false;
      if (q && !(`${d.businessName} ${d.contact.name}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    }).sort((a, b) => b.submittedAt - a.submittedAt);
  }, [diagnostics, tier, industry, urgency, status, q]);

  return (
    <div style={{ padding: isMobile ? '0 16px 48px' : '0 28px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 340 }}>
          <FilterInput value={q} onChange={setQ} placeholder="Buscar negocio o contacto…" />
        </div>
        <FilterSelect value={tier} onChange={setTier} placeholder="Todos los tiers"
          options={TIERS.map(t => ({ value: t.id, label: `${t.label} · $${t.price / 1000}K` }))} />
        <FilterSelect value={industry} onChange={setIndustry} placeholder="Industria" options={INDUSTRIES} />
        <FilterSelect value={urgency} onChange={setUrgency} placeholder="Urgencia"
          options={URGENCIES.map(u => ({ value: u.id, label: u.label }))} />
        <FilterSelect value={status} onChange={setStatus} placeholder="Estado"
          options={[
            { value: 'nuevo', label: 'Nuevo' },
            { value: 'revisado', label: 'Revisado' },
            { value: 'contactado', label: 'Contactado' },
            { value: 'convertido', label: 'Convertido' },
          ]} />
        <button onClick={() => { setTier(''); setIndustry(''); setUrgency(''); setStatus(''); setQ(''); }} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 12px', minHeight: 40, background: 'transparent', color: 'var(--fg-2)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14 }}>
          Limpiar
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 16px', minHeight: 40, background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14 }}>
            <Icon name="download" size={14} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)', paddingLeft: 4 }}>
        <span><strong style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-mono)' }}>{filtered.length}</strong> resultados</span>
        <span>·</span>
        <span><strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{diagnostics.filter(x => x.status === 'nuevo').length}</strong> sin revisar</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: 12 } as CSSProperties}>
      <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden', minWidth: 680 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '110px 1.8fr 1.1fr 1.1fr 0.9fr 0.9fr',
          padding: '14px 20px',
          fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)',
          background: 'var(--bg-inset)', borderRadius: '12px 12px 0 0',
        }}>
          <span>Fecha</span>
          <span>Negocio / Contacto</span>
          <span>Industria</span>
          <span>Tier</span>
          <span>Urgencia</span>
          <span>Estado</span>
        </div>
        {filtered.map(d => (
          <DiagRow key={d.id} d={d} onClick={() => setOpenId(d.id)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '56px 20px', textAlign: 'center', color: 'var(--fg-3)', fontFamily: 'var(--font-body)' }}>
            No hay diagnósticos que coincidan con estos filtros.
          </div>
        )}
      </div>
      </div>

      {/* Drawer */}
      {openId && <DiagnosticDrawer diagId={openId} diagnostics={diagnostics} onRefresh={() => fetchDiagnostics().then(setDiagnostics)} onClose={() => setOpenId(null)} />}
    </div>
  );
}
