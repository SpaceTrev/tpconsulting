'use client';

import { useState, useEffect, useCallback, CSSProperties } from 'react';
import { ASSIGNEES, relTime } from '@/lib/admin-data';
import { getSupabase } from '@/lib/supabase';
import { useRealtimeTable } from '@/lib/use-realtime';
import { useIsMobile } from '@/lib/use-mobile';

// ── Types ────────────────────────────────────────────────────
interface Client {
  id: string; name: string; contact_name: string | null; industry: string | null;
  tier: string | null; status: string; monthly_subscription: number | null;
}
interface Project {
  id: string; client_id: string; name: string; description: string | null;
  status: string; assigned_to: string | null; start_date: string | null;
  target_date: string | null; hours_spent: number; notes: string | null;
  created_at: string;
  client?: Client;
}
interface DeployedAuto {
  id: string; name: string; status: string; error_count: number;
  monthly_cost: number; last_run_at: string | null; assigned_to: string | null;
}

// ── Constants ────────────────────────────────────────────────
const PROJECT_STATUSES = [
  { id: 'planning',    label: 'Planeación',  color: '#7a9ba3' },
  { id: 'in_progress', label: 'En progreso', color: '#268bd2' },
  { id: 'testing',     label: 'Pruebas',     color: '#b58900' },
  { id: 'live',        label: 'Live',        color: '#6b8e23' },
  { id: 'paused',      label: 'Pausado',     color: '#839496' },
  { id: 'completed',   label: 'Completado',  color: '#586e75' },
];
const KANBAN_COLS = ['planning','in_progress','testing','live'];

const AUTO_STATUS_COLORS: Record<string, string> = {
  live: '#6b8e23', building: '#268bd2', testing: '#b58900',
  backlog: '#839496', paused: '#839496', failed: '#dc322f',
};

// ── Icons ────────────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor', sw = 1.75 }: {
  name: string; size?: number; color?: string; sw?: number;
}) {
  const p: Record<string, React.ReactNode> = {
    x:       <><path d="M6 6l12 12M18 6L6 18"/></>,
    plus:    <><path d="M12 5v14M5 12h14"/></>,
    folder:  <><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></>,
    zap:     <><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></>,
    clock:   <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></>,
    calendar:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    check:   <><path d="M20 6L9 17l-5-5"/></>,
    chevronD:<path d="M6 9l6 6 6-6"/>,
    chevronR:<path d="M9 6l6 6-6 6"/>,
    cpu:     <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></>,
    note:    <><path d="M4 4h16v12l-4 4H4z"/><path d="M8 9h8M8 13h5"/></>,
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
      width: size, height: size, borderRadius: 6,
      background: a.color, color: '#fdf6e3',
      fontFamily: 'var(--font-ui)', fontWeight: 600,
      fontSize: size <= 24 ? 10 : 12, letterSpacing: '0.04em', flexShrink: 0,
    }}>{a.id}</span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = PROJECT_STATUSES.find(x => x.id === status) ?? PROJECT_STATUSES[0];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px',
      borderRadius: 6, background: s.color + '22',
      fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 11,
      color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>{s.label}</span>
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
  const { data } = await sb.from('clients').select('*').order('name');
  return data ?? [];
}

async function fetchProjects(clientId?: string): Promise<Project[]> {
  const sb = getSupabase(); if (!sb) return [];
  let q = sb.from('projects').select('*, client:clients(id,name,contact_name,industry,tier,status,monthly_subscription)').order('created_at', { ascending: false });
  if (clientId) q = q.eq('client_id', clientId);
  const { data } = await q;
  return (data ?? []) as Project[];
}

async function fetchProjectAutomations(projectId: string): Promise<DeployedAuto[]> {
  const sb = getSupabase(); if (!sb) return [];
  const { data } = await sb.from('deployed_automations').select('id,name,status,error_count,monthly_cost,last_run_at,assigned_to').eq('project_id', projectId);
  return data ?? [];
}

async function createProject(payload: { client_id: string; name: string; description: string; assigned_to: string }): Promise<boolean> {
  const sb = getSupabase(); if (!sb) return false;
  const { error } = await sb.from('projects').insert([{ ...payload, status: 'planning', hours_spent: 0 }]);
  return !error;
}

async function updateProjectStatus(id: string, status: string): Promise<boolean> {
  const sb = getSupabase(); if (!sb) return false;
  const { error } = await sb.from('projects').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  return !error;
}

async function saveProjectNote(id: string, notes: string): Promise<boolean> {
  const sb = getSupabase(); if (!sb) return false;
  const { error } = await sb.from('projects').update({ notes, updated_at: new Date().toISOString() }).eq('id', id);
  return !error;
}

// ── Project Drawer ───────────────────────────────────────────
function ProjectDrawer({ project, onClose, onRefresh }: {
  project: Project; onClose: () => void; onRefresh: () => void;
}) {
  const isMobile = useIsMobile();
  const [autos, setAutos] = useState<DeployedAuto[]>([]);
  const [saving, setSaving] = useState(false);
  const [noteDraft, setNoteDraft] = useState(project.notes ?? '');
  const statusObj = PROJECT_STATUSES.find(s => s.id === project.status) ?? PROJECT_STATUSES[0];

  useEffect(() => {
    fetchProjectAutomations(project.id).then(setAutos);
  }, [project.id]);

  async function handleStatusChange(newStatus: string) {
    setSaving(true);
    await updateProjectStatus(project.id, newStatus);
    onRefresh(); onClose();
    setSaving(false);
  }

  async function handleSaveNote() {
    setSaving(true);
    await saveProjectNote(project.id, noteDraft);
    setSaving(false);
    onRefresh();
  }

  const nextStatuses = PROJECT_STATUSES.filter(s => s.id !== project.status);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,22,29,0.4)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', zIndex: 110 } as CSSProperties} />
      <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: isMobile ? '100vw' : 660, maxWidth: '95vw', background: 'var(--bg-canvas)', zIndex: 120, overflowY: 'auto', boxShadow: '-24px 0 48px rgba(0,22,29,0.12)' }}>
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, padding: '24px 28px 20px', background: 'var(--frost-bg)', backdropFilter: 'var(--frost-blur)' } as CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                {project.client?.name ?? '—'}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--fg-1)', margin: '0 0 8px', lineHeight: 1.2 }}>{project.name}</h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <StatusBadge status={project.status} />
                {project.assigned_to && <Avatar id={project.assigned_to} size={22} />}
                {project.target_date && (
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="calendar" size={12} color="var(--fg-3)" />
                    {new Date(project.target_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
                {project.hours_spent > 0 && (
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="clock" size={12} color="var(--fg-3)" />
                    {project.hours_spent} h
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, border: 0, background: 'var(--bg-raised)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={16} />
            </button>
          </div>
          {/* Status actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {nextStatuses.slice(0, 4).map(s => (
              <button key={s.id} onClick={() => handleStatusChange(s.id)} disabled={saving} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 12px', minHeight: 32,
                background: s.color + '22', color: s.color, border: 0, borderRadius: 8,
                fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 12, cursor: saving ? 'wait' : 'pointer',
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 28px 40px' }}>
          {/* Description */}
          {project.description && (
            <div style={{ padding: '20px 0', borderBottom: '1px solid var(--bg-inset)' }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7 }}>{project.description}</p>
            </div>
          )}

          {/* Deployed Automations */}
          <div style={{ padding: '20px 0', borderBottom: '1px solid var(--bg-inset)' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Automatizaciones ({autos.length})
            </div>
            {autos.length === 0 ? (
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-3)' }}>Sin automatizaciones asignadas</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {autos.map(a => {
                  const sc = AUTO_STATUS_COLORS[a.status] ?? '#839496';
                  return (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-raised)', borderRadius: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: sc, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, color: 'var(--fg-1)' }}>{a.name}</span>
                      {a.error_count > 0 && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#dc322f', background: '#dc322f22', padding: '1px 6px', borderRadius: 4 }}>{a.error_count} err</span>
                      )}
                      {a.monthly_cost > 0 && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>${a.monthly_cost}/mo</span>
                      )}
                      {a.assigned_to && <Avatar id={a.assigned_to} size={20} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Notas internas
            </div>
            <textarea
              value={noteDraft}
              onChange={e => setNoteDraft(e.target.value)}
              placeholder="Notas del proyecto, decisiones técnicas, bloqueos…"
              rows={5}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '12px 14px',
                background: 'var(--bg-raised)', border: 0, borderRadius: 8, outline: 'none', resize: 'vertical',
                fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)', lineHeight: 1.6,
              }}
            />
            <button onClick={handleSaveNote} disabled={saving} style={{
              marginTop: 10, display: 'inline-flex', alignItems: 'center', padding: '0 16px', minHeight: 40,
              background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: 0, borderRadius: 8,
              cursor: saving ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14,
            }}>Guardar notas</button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ── New Project Modal ────────────────────────────────────────
function NewProjectModal({ clients, onClose, onCreated }: {
  clients: Client[]; onClose: () => void; onCreated: () => void;
}) {
  const [clientId, setClientId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('TB');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !name.trim()) { setErr('Selecciona un cliente e ingresa el nombre'); return; }
    setSaving(true);
    const ok = await createProject({ client_id: clientId, name: name.trim(), description: description.trim(), assigned_to: assignedTo });
    if (ok) { onCreated(); onClose(); }
    else { setErr('Error al crear el proyecto'); setSaving(false); }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,22,29,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 130 } as CSSProperties} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 480, maxWidth: '95vw', background: 'var(--bg-canvas)', borderRadius: 16, padding: '32px 28px', zIndex: 140, boxShadow: '0 24px 64px rgba(0,22,29,0.24)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--fg-1)' }}>Nuevo Proyecto</h3>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 0, background: 'var(--bg-inset)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Cliente</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ width: '100%', minHeight: 40, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-ui)', fontSize: 14, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Seleccionar cliente…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Nombre del proyecto</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="ej. Bot de WhatsApp v2" style={{ width: '100%', boxSizing: 'border-box', minHeight: 40, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Descripción (opcional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Alcance, objetivo, herramientas…" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Responsable</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {ASSIGNEES.map(a => (
                <button key={a.id} type="button" onClick={() => setAssignedTo(a.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, border: 0,
                  background: assignedTo === a.id ? a.color + '22' : 'var(--bg-raised)',
                  color: assignedTo === a.id ? a.color : 'var(--fg-2)',
                  fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}>
                  <Avatar id={a.id} size={20} />
                  {a.name}
                </button>
              ))}
            </div>
          </div>
          {err && <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: 13, color: '#dc322f' }}>{err}</p>}
          <button type="submit" disabled={saving} style={{
            marginTop: 4, minHeight: 44, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            border: 0, borderRadius: 10, fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15,
            cursor: saving ? 'wait' : 'pointer',
          }}>
            {saving ? 'Creando…' : 'Crear Proyecto'}
          </button>
        </form>
      </div>
    </>
  );
}

// ── Kanban Card ──────────────────────────────────────────────
function KanbanCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const overdue = project.target_date && new Date(project.target_date) < new Date();
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
        background: hover ? 'var(--bg-nest-3)' : 'var(--bg-raised)',
        transition: 'background 150ms',
      }}
    >
      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, color: 'var(--fg-1)', marginBottom: 6, lineHeight: 1.3 }}>{project.name}</div>
      {project.client && (
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>{project.client.name}</div>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {project.target_date && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: overdue ? '#dc322f' : 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Icon name="calendar" size={11} color={overdue ? '#dc322f' : 'var(--fg-3)'} />
            {new Date(project.target_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
          </span>
        )}
        {project.hours_spent > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Icon name="clock" size={11} color="var(--fg-3)" />
            {project.hours_spent}h
          </span>
        )}
        <span style={{ marginLeft: 'auto' }}>
          {project.assigned_to && <Avatar id={project.assigned_to} size={20} />}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function ProjectsPage() {
  const isMobile = useIsMobile();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, p] = await Promise.all([fetchClients(), fetchProjects(selectedClient || undefined)]);
    setClients(c);
    setProjects(p);
    setLoading(false);
  }, [selectedClient]);

  useEffect(() => { load(); }, [load]);
  useRealtimeTable('projects', load);
  useRealtimeTable('clients', load);

  const selectedProject = projects.find(p => p.id === openId) ?? null;

  const kanbanCols = KANBAN_COLS.map(colId => ({
    ...PROJECT_STATUSES.find(s => s.id === colId)!,
    items: projects.filter(p => p.status === colId),
  }));

  const otherProjects = projects.filter(p => !KANBAN_COLS.includes(p.status));

  const totalActive = projects.filter(p => ['planning','in_progress','testing','live'].includes(p.status)).length;

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '28px 32px' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: '0 0 2px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)' }}>Proyectos</h2>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>{totalActive} activo{totalActive !== 1 ? 's' : ''} · {projects.length} total</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
          <FilterSelect
            value={selectedClient}
            onChange={setSelectedClient}
            options={clients.map(c => ({ value: c.id, label: c.name }))}
            placeholder="Todos los clientes"
          />
          <button onClick={() => setNewOpen(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 16px', minHeight: 40,
            background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: 0, borderRadius: 8,
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>
            <Icon name="plus" size={16} color="var(--fg-on-accent)" />
            Nuevo Proyecto
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', fontFamily: 'var(--font-ui)', color: 'var(--fg-3)' }}>Cargando…</div>
      ) : projects.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', background: 'var(--bg-raised)', borderRadius: 12 }}>
          <Icon name="folder" size={40} color="var(--fg-3)" />
          <p style={{ margin: '16px 0 0', fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-3)' }}>No hay proyectos{selectedClient ? ' para este cliente' : ''}. Crea el primero.</p>
        </div>
      ) : (
        <>
          {/* Kanban */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: otherProjects.length > 0 ? 32 : 0,
          }}>
            {kanbanCols.map(col => (
              <div key={col.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px', marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{col.label}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', background: 'var(--bg-inset)', padding: '1px 6px', borderRadius: 4 }}>{col.items.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80, padding: '4px', background: 'var(--bg-inset)', borderRadius: 10 }}>
                  {col.items.map(p => (
                    <KanbanCard key={p.id} project={p} onClick={() => setOpenId(p.id)} />
                  ))}
                  {col.items.length === 0 && (
                    <div style={{ padding: '24px 12px', textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>—</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Paused / Completed */}
          {otherProjects.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Pausados / Completados ({otherProjects.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {otherProjects.map(p => (
                  <div key={p.id} onClick={() => setOpenId(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, cursor: 'pointer', background: 'transparent', transition: 'background 150ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-raised)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <StatusBadge status={p.status} />
                    <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, color: 'var(--fg-1)' }}>{p.name}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>{p.client?.name ?? '—'}</span>
                    {p.assigned_to && <Avatar id={p.assigned_to} size={22} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {selectedProject && (
        <ProjectDrawer project={selectedProject} onClose={() => setOpenId(null)} onRefresh={load} />
      )}
      {newOpen && (
        <NewProjectModal clients={clients} onClose={() => setNewOpen(false)} onCreated={load} />
      )}
    </div>
  );
}
