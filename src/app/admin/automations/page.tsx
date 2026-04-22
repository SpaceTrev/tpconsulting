'use client';

import { useState, useEffect, useCallback, useMemo, CSSProperties } from 'react';
import { ASSIGNEES, relTime } from '@/lib/admin-data';
import { getSupabase } from '@/lib/supabase';
import { useRealtimeTable } from '@/lib/use-realtime';
import { useIsMobile } from '@/lib/use-mobile';
import { useClientContext } from '@/lib/client-context';

// ── Types ────────────────────────────────────────────────────
interface Client { id: string; name: string; }

interface CatalogItem {
  id: string; name: string; description: string | null; category: string | null;
  complexity: string | null; avg_deploy_hours: number | null;
  monthly_cost_estimate: number | null; is_template: boolean; tech_stack: string | null;
}

interface DeployedAuto {
  id: string; client_id: string; project_id: string | null;
  catalog_id: string | null; name: string; status: string;
  assigned_to: string | null; last_run_at: string | null;
  error_count: number; monthly_cost: number; notes: string | null;
  created_at: string;
  client?: Client;
}

// ── Constants ────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'lead_gen',    label: 'Lead Gen',    color: '#268bd2' },
  { id: 'whatsapp',   label: 'WhatsApp',    color: '#25D366' },
  { id: 'crm',        label: 'CRM',         color: '#b45309' },
  { id: 'invoicing',  label: 'Facturación', color: '#b58900' },
  { id: 'marketing',  label: 'Marketing',   color: '#d33682' },
  { id: 'operations', label: 'Operaciones', color: '#6c71c4' },
  { id: 'custom',     label: 'Custom',      color: '#586e75' },
];

const COMPLEXITY = {
  simple:  { label: 'Simple',   color: '#6b8e23' },
  medium:  { label: 'Medio',    color: '#b58900' },
  complex: { label: 'Complejo', color: '#dc322f' },
};

const DEPLOY_STATUS = [
  { id: 'backlog',   label: 'Backlog',   color: '#839496' },
  { id: 'building',  label: 'Building',  color: '#268bd2' },
  { id: 'testing',   label: 'Testing',   color: '#b58900' },
  { id: 'live',      label: 'Live',      color: '#6b8e23' },
  { id: 'paused',    label: 'Pausado',   color: '#839496' },
  { id: 'failed',    label: 'Fallido',   color: '#dc322f' },
];

// ── Icons ────────────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor', sw = 1.75 }: {
  name: string; size?: number; color?: string; sw?: number;
}) {
  const p: Record<string, React.ReactNode> = {
    x:       <><path d="M6 6l12 12M18 6L6 18"/></>,
    plus:    <><path d="M12 5v14M5 12h14"/></>,
    zap:     <><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></>,
    grid:    <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    table:   <><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/></>,
    search:  <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>,
    clock:   <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></>,
    cpu:     <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></>,
    deploy:  <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    book:    <><path d="M4 19V5a2 2 0 012-2h13v16H6a2 2 0 000 4h13"/><path d="M4 19a2 2 0 002 2"/></>,
    check:   <><path d="M20 6L9 17l-5-5"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {p[name] ?? null}
    </svg>
  );
}

function Avatar({ id, size = 24 }: { id: string; size?: number }) {
  const a = ASSIGNEES.find(x => x.id === id);
  if (!a) return null;
  return (
    <span title={a.name} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: 6, background: a.color, color: '#fdf6e3',
      fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 10, letterSpacing: '0.04em', flexShrink: 0,
    }}>{a.id}</span>
  );
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 6,
      background: color + '22', color,
      fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 11,
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>{label}</span>
  );
}

function FilterSelect({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder: string;
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
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ── Supabase queries ─────────────────────────────────────────
async function fetchClients(): Promise<Client[]> {
  const sb = getSupabase(); if (!sb) return [];
  const { data } = await sb.from('clients').select('id,name').order('name');
  return data ?? [];
}

async function fetchCatalog(): Promise<CatalogItem[]> {
  const sb = getSupabase(); if (!sb) return [];
  const { data } = await sb.from('automation_catalog').select('*').order('name');
  return data ?? [];
}

async function fetchDeployed(): Promise<DeployedAuto[]> {
  const sb = getSupabase(); if (!sb) return [];
  const { data } = await sb.from('deployed_automations')
    .select('*, client:clients(id,name)')
    .order('created_at', { ascending: false });
  return (data ?? []) as DeployedAuto[];
}

async function addToCatalog(payload: Partial<CatalogItem>): Promise<boolean> {
  const sb = getSupabase(); if (!sb) return false;
  const { error } = await sb.from('automation_catalog').insert([{ ...payload, is_template: true }]);
  return !error;
}

async function deployAutomation(payload: { client_id: string; catalog_id: string; name: string; assigned_to: string }): Promise<boolean> {
  const sb = getSupabase(); if (!sb) return false;
  const { error } = await sb.from('deployed_automations').insert([{ ...payload, status: 'backlog', error_count: 0, monthly_cost: 0 }]);
  return !error;
}

async function updateDeployedStatus(id: string, status: string): Promise<boolean> {
  const sb = getSupabase(); if (!sb) return false;
  const { error } = await sb.from('deployed_automations').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  return !error;
}

// ── Deploy Modal ─────────────────────────────────────────────
function DeployModal({ item, clients, onClose, onDeployed }: {
  item: CatalogItem; clients: Client[]; onClose: () => void; onDeployed: () => void;
}) {
  const [clientId, setClientId] = useState('');
  const [name, setName] = useState(item.name);
  const [assignedTo, setAssignedTo] = useState('TB');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) { setErr('Selecciona un cliente'); return; }
    setSaving(true);
    const ok = await deployAutomation({ client_id: clientId, catalog_id: item.id, name: name.trim(), assigned_to: assignedTo });
    if (ok) { onDeployed(); onClose(); }
    else { setErr('Error al deployar'); setSaving(false); }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,22,29,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 130 } as CSSProperties} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 460, maxWidth: '95vw', background: 'var(--bg-canvas)', borderRadius: 16, padding: '28px 24px', zIndex: 140, boxShadow: '0 24px 64px rgba(0,22,29,0.24)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Deployar automatización</div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--fg-1)' }}>{item.name}</h3>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 0, background: 'var(--bg-inset)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Cliente</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ width: '100%', minHeight: 40, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-ui)', fontSize: 14, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Seleccionar cliente…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Nombre (personalizable)</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', minHeight: 40, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Responsable</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {ASSIGNEES.map(a => (
                <button key={a.id} type="button" onClick={() => setAssignedTo(a.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, border: 0,
                  background: assignedTo === a.id ? a.color + '22' : 'var(--bg-raised)',
                  color: assignedTo === a.id ? a.color : 'var(--fg-2)',
                  fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}>
                  <Avatar id={a.id} size={20} />{a.name}
                </button>
              ))}
            </div>
          </div>
          {err && <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: 13, color: '#dc322f' }}>{err}</p>}
          <button type="submit" disabled={saving} style={{
            marginTop: 4, minHeight: 42, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            border: 0, borderRadius: 10, fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14,
            cursor: saving ? 'wait' : 'pointer',
          }}>
            {saving ? 'Deployando…' : 'Deployar a cliente'}
          </button>
        </form>
      </div>
    </>
  );
}

// ── Add to Catalog Modal ─────────────────────────────────────
function AddCatalogModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [complexity, setComplexity] = useState('medium');
  const [hours, setHours] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [techStack, setTechStack] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await addToCatalog({
      name: name.trim(), description: description.trim() || null,
      category: category || null, complexity: complexity as CatalogItem['complexity'],
      avg_deploy_hours: hours ? parseFloat(hours) : null,
      monthly_cost_estimate: monthlyCost ? parseFloat(monthlyCost) : null,
      tech_stack: techStack.trim() || null,
    });
    onAdded(); onClose();
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,22,29,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 130 } as CSSProperties} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 520, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-canvas)', borderRadius: 16, padding: '28px 24px', zIndex: 140, boxShadow: '0 24px 64px rgba(0,22,29,0.24)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--fg-1)' }}>Agregar al Catálogo</h3>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 0, background: 'var(--bg-inset)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Nombre *', value: name, setter: setName, placeholder: 'ej. Bot de WhatsApp para citas' },
            { label: 'Tech stack', value: techStack, setter: setTechStack, placeholder: 'n8n, Python, GitHub Actions…' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{f.label}</label>
              <input value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} style={{ width: '100%', boxSizing: 'border-box', minHeight: 40, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14 }} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Categoría</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', minHeight: 40, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-ui)', fontSize: 14, appearance: 'none', cursor: 'pointer' }}>
                <option value="">— ninguna —</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Complejidad</label>
              <select value={complexity} onChange={e => setComplexity(e.target.value)} style={{ width: '100%', minHeight: 40, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-ui)', fontSize: 14, appearance: 'none', cursor: 'pointer' }}>
                {Object.entries(COMPLEXITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Horas promedio</label>
              <input type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="24" style={{ width: '100%', boxSizing: 'border-box', minHeight: 40, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Costo/mes estimado</label>
              <input type="number" value={monthlyCost} onChange={e => setMonthlyCost(e.target.value)} placeholder="500" style={{ width: '100%', boxSizing: 'border-box', minHeight: 40, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14 }} />
            </div>
          </div>
          <button type="submit" disabled={saving || !name.trim()} style={{
            marginTop: 4, minHeight: 42, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            border: 0, borderRadius: 10, fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14,
            cursor: (saving || !name.trim()) ? 'not-allowed' : 'pointer', opacity: !name.trim() ? 0.5 : 1,
          }}>{saving ? 'Guardando…' : 'Agregar al catálogo'}</button>
        </form>
      </div>
    </>
  );
}

// ── Deployed Drawer ───────────────────────────────────────────
function DeployedDrawer({ auto, onClose, onRefresh }: {
  auto: DeployedAuto; onClose: () => void; onRefresh: () => void;
}) {
  const isMobile = useIsMobile();
  const [saving, setSaving] = useState(false);
  const statusObj = DEPLOY_STATUS.find(s => s.id === auto.status) ?? DEPLOY_STATUS[0];

  async function handleStatusChange(newStatus: string) {
    setSaving(true);
    await updateDeployedStatus(auto.id, newStatus);
    onRefresh(); onClose();
    setSaving(false);
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,22,29,0.4)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', zIndex: 110 } as CSSProperties} />
      <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: isMobile ? '100vw' : 520, maxWidth: '95vw', background: 'var(--bg-canvas)', zIndex: 120, overflowY: 'auto', boxShadow: '-24px 0 48px rgba(0,22,29,0.12)' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 2, padding: '24px 28px 20px', background: 'var(--frost-bg)', backdropFilter: 'var(--frost-blur)' } as CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{auto.client?.name ?? '—'}</div>
              <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.2 }}>{auto.name}</h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 6, background: statusObj.color + '22', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 11, color: statusObj.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{statusObj.label}</span>
                {auto.error_count > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#dc322f', background: '#dc322f22', padding: '2px 8px', borderRadius: 6 }}>{auto.error_count} errores</span>}
                {auto.monthly_cost > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>${auto.monthly_cost}/mes</span>}
              </div>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, border: 0, background: 'var(--bg-raised)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {DEPLOY_STATUS.filter(s => s.id !== auto.status).map(s => (
              <button key={s.id} onClick={() => handleStatusChange(s.id)} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 12px', minHeight: 32, background: s.color + '22', color: s.color, border: 0, borderRadius: 8, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 12, cursor: saving ? 'wait' : 'pointer' }}>{s.label}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: '20px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Último run', value: auto.last_run_at ? relTime(new Date(auto.last_run_at).getTime()) : 'Nunca' },
              { label: 'Costo mensual', value: auto.monthly_cost > 0 ? `$${auto.monthly_cost} MXN` : '—' },
              { label: 'Errores', value: auto.error_count.toString() },
              { label: 'Responsable', value: auto.assigned_to ? ASSIGNEES.find(a => a.id === auto.assigned_to)?.name ?? auto.assigned_to : '—' },
            ].map(f => (
              <div key={f.label} style={{ padding: '14px 16px', background: 'var(--bg-raised)', borderRadius: 8 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16, color: 'var(--fg-1)' }}>{f.value}</div>
              </div>
            ))}
          </div>
          {auto.notes && (
            <div style={{ marginTop: 20, padding: '16px', background: 'var(--bg-raised)', borderRadius: 8 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Notas</div>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7 }}>{auto.notes}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function AutomationsPage() {
  const isMobile = useIsMobile();
  const { clients: ctxClients, selectedClientId, setSelectedClientId } = useClientContext();
  const [view, setView] = useState<'catalog' | 'deployed'>('catalog');
  const [clients, setClients] = useState<Client[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [deployed, setDeployed] = useState<DeployedAuto[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deployItem, setDeployItem] = useState<CatalogItem | null>(null);
  const [addCatalogOpen, setAddCatalogOpen] = useState(false);
  const [openAutoId, setOpenAutoId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, cat, dep] = await Promise.all([fetchClients(), fetchCatalog(), fetchDeployed()]);
    setClients(c); setCatalog(cat); setDeployed(dep);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useRealtimeTable('automation_catalog', load);
  useRealtimeTable('deployed_automations', load);

  const filteredCatalog = useMemo(() => catalog.filter(c => {
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (filterCategory && c.category !== filterCategory) return false;
    return true;
  }), [catalog, q, filterCategory]);

  const filteredDeployed = useMemo(() => deployed.filter(d => {
    if (q && !d.name.toLowerCase().includes(q.toLowerCase()) && !(d.client?.name ?? '').toLowerCase().includes(q.toLowerCase())) return false;
    if (selectedClientId && d.client_id !== selectedClientId) return false;
    if (filterStatus && d.status !== filterStatus) return false;
    return true;
  }), [deployed, q, selectedClientId, filterStatus]);

  const liveCount = deployed.filter(d => d.status === 'live').length;
  const totalMonthlyCost = deployed.filter(d => d.status === 'live').reduce((s, d) => s + (d.monthly_cost || 0), 0);
  const openAuto = deployed.find(d => d.id === openAutoId) ?? null;

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '28px 32px' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: '0 0 2px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)' }}>Automatizaciones</h2>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>
            {liveCount} live · {catalog.length} en catálogo · ${totalMonthlyCost.toLocaleString('es-MX')}/mes
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-inset)', borderRadius: 8, padding: 3, gap: 2 }}>
            {([['catalog', 'Catálogo', 'book'], ['deployed', 'Deployadas', 'zap']] as const).map(([v, label, icon]) => (
              <button key={v} onClick={() => setView(v)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: 0,
                background: view === v ? 'var(--bg-raised)' : 'transparent',
                color: view === v ? 'var(--fg-1)' : 'var(--fg-3)',
                fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                transition: 'background 150ms',
              }}>
                <Icon name={icon} size={14} />
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: 'var(--bg-raised)', borderRadius: 8, minHeight: 40 }}>
            <Icon name="search" size={15} color="var(--fg-3)" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar…" style={{ background: 'transparent', border: 0, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', width: 160 }} />
          </div>
          {view === 'catalog' && (
            <>
              <FilterSelect value={filterCategory} onChange={setFilterCategory} options={CATEGORIES.map(c => ({ value: c.id, label: c.label }))} placeholder="Categoría" />
              <button onClick={() => setAddCatalogOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 16px', minHeight: 40, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: 0, borderRadius: 8, fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                <Icon name="plus" size={16} color="var(--fg-on-accent)" />
                Agregar
              </button>
            </>
          )}
          {view === 'deployed' && (
            <>
              <FilterSelect value={selectedClientId} onChange={setSelectedClientId} options={(ctxClients.length > 0 ? ctxClients : clients).map(c => ({ value: c.id, label: c.name }))} placeholder="Cliente" />
              <FilterSelect value={filterStatus} onChange={setFilterStatus} options={DEPLOY_STATUS.map(s => ({ value: s.id, label: s.label }))} placeholder="Estado" />
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', fontFamily: 'var(--font-ui)', color: 'var(--fg-3)' }}>Cargando…</div>
      ) : view === 'catalog' ? (
        /* ── Catalog Grid ──────────────────────────────── */
        filteredCatalog.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', background: 'var(--bg-raised)', borderRadius: 12 }}>
            <Icon name="book" size={40} color="var(--fg-3)" />
            <p style={{ margin: '16px 0 0', fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-3)' }}>Catálogo vacío. Agrega la primera automatización.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filteredCatalog.map(item => {
              const cat = CATEGORIES.find(c => c.id === item.category);
              const cplx = item.complexity ? COMPLEXITY[item.complexity as keyof typeof COMPLEXITY] : null;
              return (
                <div key={item.id} style={{ padding: '20px', background: 'var(--bg-raised)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {cat && <Chip label={cat.label} color={cat.color} />}
                    {cplx && <Chip label={cplx.label} color={cplx.color} />}
                    {item.is_template && <Chip label="Template" color="#6c71c4" />}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 6 }}>{item.name}</div>
                    {item.description && <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>{item.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {item.avg_deploy_hours != null && (
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="clock" size={12} color="var(--fg-3)" />
                        ~{item.avg_deploy_hours}h deploy
                      </span>
                    )}
                    {item.monthly_cost_estimate != null && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>${item.monthly_cost_estimate}/mes</span>
                    )}
                    {item.tech_stack && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{item.tech_stack}</span>
                    )}
                  </div>
                  <button onClick={() => setDeployItem(item)} style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '0 16px', minHeight: 38, marginTop: 'auto',
                    background: 'var(--bg-inset)', color: 'var(--fg-1)', border: 0, borderRadius: 8,
                    fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    transition: 'background 150ms',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-primary)', e.currentTarget.style.color = 'var(--fg-on-accent)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-inset)', e.currentTarget.style.color = 'var(--fg-1)')}
                  >
                    <Icon name="deploy" size={14} />
                    Deploy a cliente
                  </button>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ── Deployed Table ────────────────────────────── */
        filteredDeployed.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', background: 'var(--bg-raised)', borderRadius: 12 }}>
            <Icon name="zap" size={40} color="var(--fg-3)" />
            <p style={{ margin: '16px 0 0', fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-3)' }}>Sin automatizaciones deployadas.</p>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 100px 120px 80px 90px', gap: 0, padding: '10px 20px', borderBottom: '1px solid var(--bg-inset)', background: 'var(--bg-canvas)' }}>
              {['Automatización','Cliente','Estado','Último run','Errores','Costo/mes'].map(h => (
                <span key={h} style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
              ))}
            </div>
            {filteredDeployed.map((d, i) => {
              const sc = DEPLOY_STATUS.find(s => s.id === d.status);
              return (
                <div key={d.id} onClick={() => setOpenAutoId(d.id)}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 100px 120px 80px 90px', gap: 0, padding: '14px 20px', borderBottom: i < filteredDeployed.length - 1 ? '1px solid var(--bg-inset)' : 'none', cursor: 'pointer', transition: 'background 120ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, color: 'var(--fg-1)' }}>{d.name}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)' }}>{d.client?.name ?? '—'}</div>
                  <div>{sc && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 5, background: sc.color + '22', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 11, color: sc.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sc.label}</span>}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>{d.last_run_at ? relTime(new Date(d.last_run_at).getTime()) : '—'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: d.error_count > 0 ? '#dc322f' : 'var(--fg-3)' }}>{d.error_count}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-2)' }}>{d.monthly_cost > 0 ? `$${d.monthly_cost}` : '—'}</div>
                </div>
              );
            })}
          </div>
        )
      )}

      {openAuto && <DeployedDrawer auto={openAuto} onClose={() => setOpenAutoId(null)} onRefresh={load} />}
      {deployItem && <DeployModal item={deployItem} clients={clients} onClose={() => setDeployItem(null)} onDeployed={load} />}
      {addCatalogOpen && <AddCatalogModal onClose={() => setAddCatalogOpen(false)} onAdded={load} />}
    </div>
  );
}
