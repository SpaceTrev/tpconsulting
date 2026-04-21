'use client';

import { useState, useEffect, useCallback, CSSProperties } from 'react';
import { getSupabase } from '@/lib/supabase';
import { relTime } from '@/lib/admin-data';
import { useIsMobile } from '@/lib/use-mobile';

const TREVOR_EMAIL = 'trevbdev@gmail.com';

// ── Types ────────────────────────────────────────────────────
interface Client {
  id: string; name: string; industry: string | null; tier: string | null;
  status: string; monthly_subscription: number | null;
}
interface DeployedAuto {
  id: string; client_id: string; name: string; status: string;
  last_run_at: string | null; error_count: number; monthly_cost: number;
  assigned_to: string | null; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  live: '#6b8e23', building: '#268bd2', testing: '#b58900',
  backlog: '#839496', paused: '#839496', failed: '#dc322f',
};

// ── Icons ────────────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor', sw = 1.75 }: {
  name: string; size?: number; color?: string; sw?: number;
}) {
  const p: Record<string, React.ReactNode> = {
    cpu:      <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></>,
    zap:      <><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></>,
    alert:    <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    dollar:   <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    lock:     <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    chevronD: <path d="M6 9l6 6 6-6"/>,
    chevronR: <path d="M9 6l6 6-6 6"/>,
    chart:    <><path d="M4 20V9M10 20V4M16 20v-7M22 20H2"/></>,
    users:    <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M21.5 19c0-2.5-2-4-4.5-4"/></>,
    refresh:  <><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 1 0 21.98 14.3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {p[name] ?? null}
    </svg>
  );
}

// ── Supabase queries ─────────────────────────────────────────
async function fetchClientsWithAutomations(): Promise<{ clients: Client[]; deployed: DeployedAuto[] }> {
  const sb = getSupabase(); if (!sb) return { clients: [], deployed: [] };
  const [{ data: clients }, { data: deployed }] = await Promise.all([
    sb.from('clients').select('*').order('name'),
    sb.from('deployed_automations').select('*').order('created_at', { ascending: false }),
  ]);
  return { clients: clients ?? [], deployed: deployed ?? [] };
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, iconBg }: {
  icon: string; label: string; value: string | number; sub?: string;
  color?: string; iconBg?: string;
}) {
  return (
    <div style={{ padding: '20px 24px', background: 'var(--bg-raised)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: (iconBg ?? (color ?? 'var(--accent-primary)')) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={20} color={color ?? 'var(--accent-primary)'} />
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: color ?? 'var(--fg-1)', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── CSS Bar Chart ─────────────────────────────────────────────
function CostBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ padding: '20px 24px', background: 'var(--bg-raised)', borderRadius: 12 }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
        Costo mensual por cliente (MXN)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.length === 0 ? (
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)', textAlign: 'center', padding: 16 }}>Sin datos de costo</div>
        ) : (
          data.sort((a, b) => b.value - a.value).map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 140, flexShrink: 0, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
              <div style={{ flex: 1, height: 8, background: 'var(--bg-inset)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(d.value / max) * 100}%`, background: d.color, borderRadius: 4, transition: 'width 600ms cubic-bezier(.22,1,.36,1)' }} />
              </div>
              <div style={{ width: 80, flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', textAlign: 'right' }}>${d.value.toLocaleString('es-MX')}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Client Row ───────────────────────────────────────────────
function ClientRow({ client, autos }: { client: Client; autos: DeployedAuto[] }) {
  const [open, setOpen] = useState(false);
  const live = autos.filter(a => a.status === 'live').length;
  const errors = autos.reduce((s, a) => s + (a.error_count ?? 0), 0);
  const totalCost = autos.reduce((s, a) => s + (a.monthly_cost ?? 0), 0);

  return (
    <div style={{ borderBottom: '1px solid var(--bg-inset)' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', cursor: 'pointer', transition: 'background 120ms' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <Icon name={open ? 'chevronD' : 'chevronR'} size={14} color="var(--fg-3)" />
        <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, color: 'var(--fg-1)' }}>{client.name}</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>{autos.length} auto{autos.length !== 1 ? 's' : ''}</span>
          {live > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-ui)', fontSize: 12, color: '#6b8e23' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6b8e23' }} />{live} live</span>}
          {errors > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#dc322f', background: '#dc322f22', padding: '1px 6px', borderRadius: 4 }}>{errors} err</span>}
          {totalCost > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>${totalCost.toLocaleString('es-MX')}/mes</span>}
        </div>
      </div>
      {open && autos.length > 0 && (
        <div style={{ padding: '0 20px 16px 44px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {autos.map(a => {
            const sc = STATUS_COLORS[a.status] ?? '#839496';
            return (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-inset)', borderRadius: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc, flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)', fontWeight: 500 }}>{a.name}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: sc, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{a.status}</span>
                {a.last_run_at && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>{relTime(new Date(a.last_run_at).getTime())}</span>}
                {a.error_count > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#dc322f' }}>{a.error_count}×</span>}
              </div>
            );
          })}
        </div>
      )}
      {open && autos.length === 0 && (
        <div style={{ padding: '8px 20px 16px 44px', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>Sin automatizaciones</div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function OrchestrationPage() {
  const isMobile = useIsMobile();
  const [clients, setClients] = useState<Client[]>([]);
  const [deployed, setDeployed] = useState<DeployedAuto[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);

  // Role gate
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { setAuthed(false); return; }
    sb.auth.getSession().then(({ data }) => {
      setAuthed(data.session?.user.email === TREVOR_EMAIL);
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchClientsWithAutomations();
    setClients(result.clients);
    setDeployed(result.deployed);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  if (authed === null) return null;
  if (!authed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, padding: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lock" size={28} color="var(--fg-3)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--fg-1)' }}>Acceso restringido</h2>
          <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-3)' }}>Esta sección es solo para Trevor.</p>
        </div>
      </div>
    );
  }

  // Stats
  const totalRunning = deployed.filter(d => d.status === 'live').length;
  const totalErrors = deployed.reduce((s, d) => s + (d.error_count ?? 0), 0);
  const totalMonthlyCost = deployed.filter(d => d.status === 'live').reduce((s, d) => s + (d.monthly_cost ?? 0), 0);
  const failedCount = deployed.filter(d => d.status === 'failed').length;

  // Cost by client
  const costByClient = clients.map(c => {
    const cost = deployed.filter(d => d.client_id === c.id && d.status === 'live').reduce((s, d) => s + (d.monthly_cost ?? 0), 0);
    const hue = parseInt(c.id.slice(0, 8), 16) % 360;
    return { label: c.name, value: cost, color: `hsl(${hue},55%,45%)` };
  }).filter(c => c.value > 0);

  // Errors log
  const errorLog = deployed.filter(d => d.error_count > 0).sort((a, b) => b.error_count - a.error_count);

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '28px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ margin: '0 0 2px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)' }}>Orquestación</h2>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>Vista del sistema · Solo Trevor</div>
        </div>
        <button onClick={load} title="Actualizar" style={{ marginLeft: 'auto', width: 40, height: 40, borderRadius: 8, border: 0, background: 'var(--bg-raised)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="refresh" size={16} />
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', fontFamily: 'var(--font-ui)', color: 'var(--fg-3)' }}>Cargando…</div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16 }}>
            <StatCard icon="zap" label="Corriendo" value={totalRunning} sub="automatizaciones live" color="#6b8e23" />
            <StatCard icon="dollar" label="Costo total" value={`$${totalMonthlyCost.toLocaleString('es-MX')}`} sub="MXN/mes (live)" color="var(--accent-primary)" />
            <StatCard icon="alert" label="Errores" value={totalErrors} sub={`${failedCount} fallidas`} color={totalErrors > 0 ? '#dc322f' : 'var(--fg-3)'} />
            <StatCard icon="users" label="Clientes" value={clients.filter(c => c.status === 'active').length} sub={`${clients.length} total`} color="#268bd2" />
          </div>

          {/* Cost bar chart */}
          <CostBarChart data={costByClient} />

          {/* Per-client breakdown */}
          <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg-inset)' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Desglose por cliente ({clients.length})
              </span>
            </div>
            {clients.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>Sin clientes aún</div>
            ) : (
              clients.map(c => (
                <ClientRow key={c.id} client={c} autos={deployed.filter(d => d.client_id === c.id)} />
              ))
            )}
          </div>

          {/* Error log */}
          {errorLog.length > 0 && (
            <div style={{ background: 'var(--bg-raised)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg-inset)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="alert" size={14} color="#dc322f" />
                <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, color: '#dc322f', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Log de errores ({errorLog.length})
                </span>
              </div>
              {errorLog.map((d, i) => {
                const client = clients.find(c => c.id === d.client_id);
                return (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderBottom: i < errorLog.length - 1 ? '1px solid var(--bg-inset)' : 'none' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: '#dc322f', minWidth: 28 }}>{d.error_count}×</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, color: 'var(--fg-1)' }}>{d.name}</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)' }}>{client?.name ?? '—'}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: STATUS_COLORS[d.status] ?? '#839496', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.status}</span>
                    {d.last_run_at && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>{relTime(new Date(d.last_run_at).getTime())}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
