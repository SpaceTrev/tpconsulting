'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ASSIGNEES } from '@/lib/admin-data';

// ── Icons ────────────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75 }: {
  name: string; size?: number; color?: string; strokeWidth?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    home:     <><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></>,
    clipboard:<><rect x="6" y="4" width="12" height="17" rx="1.5"/><path d="M9 4v-1h6v1"/><path d="M9 10h6M9 14h4"/></>,
    users:    <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M21.5 19c0-2.5-2-4-4.5-4"/></>,
    mail:     <><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></>,
    chart:    <><path d="M4 20V9M10 20V4M16 20v-7M22 20H2"/></>,
    gear:     <><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    external: <><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M20 13v6a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h6"/></>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>,
    sun:      <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    moon:     <path d="M20 14A8 8 0 119.9 3.8 7 7 0 0020 14z"/>,
    chevronR: <path d="M9 6l6 6-6 6"/>,
    chevronL: <path d="M15 6l-9 6 9 6"/>,
    bell:     <><path d="M18 15V10a6 6 0 10-12 0v5l-2 3h16z"/><path d="M10 21h4"/></>,
    arrow:    <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths[name] ?? null}
    </svg>
  );
}

// ── Avatar ───────────────────────────────────────────────────
function Avatar({ id, size = 24 }: { id: string; size?: number }) {
  const a = ASSIGNEES.find(x => x.id === id);
  if (!a) return null;
  return (
    <span title={a.name} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: 6,
      background: a.color, color: '#fdf6e3',
      fontFamily: 'var(--font-ui)', fontWeight: 600,
      fontSize: size <= 24 ? 10 : 12, letterSpacing: '0.04em',
      flexShrink: 0,
    }}>{a.id}</span>
  );
}

// ── NavItem ──────────────────────────────────────────────────
function NavItem({ href, icon, label, count, active, collapsed, accent }: {
  href: string; icon: string; label: string; count?: number;
  active: boolean; collapsed: boolean; accent?: boolean;
}) {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => router.push(href)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', minHeight: 40, padding: collapsed ? '0 10px' : '0 12px',
        background: active ? 'var(--bg-raised)' : (hover ? 'var(--bg-inset)' : 'transparent'),
        color: active ? 'var(--fg-1)' : 'var(--fg-2)',
        border: 0, borderRadius: 8, cursor: 'pointer',
        fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: active ? 600 : 500,
        textAlign: 'left',
        transition: 'background 180ms cubic-bezier(.22,1,.36,1)',
      }}
    >
      {active && (
        <span style={{
          position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)',
          width: 3, height: 20, borderRadius: 2, background: 'var(--accent-primary)',
        }} />
      )}
      <Icon name={icon} size={18} color={active ? 'var(--accent-primary)' : 'currentColor'} />
      {!collapsed && (
        <>
          <span style={{ flex: 1 }}>{label}</span>
          {count != null && count > 0 && (
            <span style={{
              minWidth: 20, padding: '1px 6px', borderRadius: 4,
              background: accent && count > 0 ? 'var(--accent-primary)' : 'var(--bg-inset)',
              color: accent && count > 0 ? 'var(--fg-on-accent)' : 'var(--fg-2)',
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, textAlign: 'center',
            }}>{count}</span>
          )}
        </>
      )}
    </button>
  );
}

// ── Sidebar ──────────────────────────────────────────────────
function Sidebar({ collapsed, onToggle, pathname }: {
  collapsed: boolean; onToggle: () => void; pathname: string;
}) {
  const w = collapsed ? 64 : 232;
  const diagCount = 5;
  const leadsCount = 8;
  const contactosCount = 4;

  const items = [
    { href: '/admin',           icon: 'home',      label: 'Overview' },
    { href: '/admin/diagnosticos', icon: 'clipboard', label: 'Diagnósticos', count: diagCount, accent: true },
    { href: '/admin/leads',     icon: 'users',     label: 'Leads',        count: leadsCount },
    { href: '/admin/contactos', icon: 'mail',      label: 'Contactos',    count: contactosCount },
  ];
  const footer = [
    { href: '/admin/config',    icon: 'gear',      label: 'Configuración' },
    { href: '/',                icon: 'external',  label: 'Marketing site' },
  ];

  return (
    <aside style={{
      position: 'sticky', top: 0, alignSelf: 'flex-start',
      width: w, height: '100vh', flexShrink: 0,
      background: 'var(--bg-canvas)',
      display: 'flex', flexDirection: 'column',
      padding: '16px 12px',
      transition: 'width 240ms cubic-bezier(.22,1,.36,1)',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px', marginBottom: 24, minHeight: 40 }}>
        <svg width="24" height="24" viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
          <g transform="translate(32 32)">
            <circle r="20" fill="none" stroke="var(--accent-primary)" strokeWidth="3.5"/>
            <circle r="3.5" fill="var(--accent-primary)"/>
            <line x1="0" y1="-20" x2="0" y2="-10" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="20" y1="0" x2="10" y2="0" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="0" y1="20" x2="0" y2="10" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="-20" y1="0" x2="-10" y2="0" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round"/>
          </g>
        </svg>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>FAC</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.12em', marginTop: 3, textTransform: 'uppercase' }}>CRM</span>
          </div>
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {items.map(it => (
          <NavItem key={it.href} {...it} active={pathname === it.href} collapsed={collapsed} />
        ))}
        <div style={{ height: 1, background: 'var(--bg-inset)', margin: '16px 8px' }} />
        {footer.map(it => (
          <NavItem key={it.href} {...it} active={false} collapsed={collapsed} />
        ))}
      </nav>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', marginTop: 8, minHeight: 44 }}>
        <Avatar id="TB" size={28} />
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>Trevor B.</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>trevor@thefac.co</div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button onClick={onToggle} title={collapsed ? 'Expandir' : 'Colapsar'} style={{
        position: 'absolute', top: 28, right: -12,
        width: 24, height: 24, borderRadius: 6, border: 0,
        background: 'var(--bg-raised)', color: 'var(--fg-3)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={collapsed ? 'chevronR' : 'chevronL'} size={14} />
      </button>
    </aside>
  );
}

// ── Topbar ───────────────────────────────────────────────────
function Topbar({ pathname, theme, onTheme }: {
  pathname: string; theme: string; onTheme: () => void;
}) {
  const titles: Record<string, string> = {
    '/admin':              'Overview',
    '/admin/diagnosticos': 'Diagnósticos',
    '/admin/leads':        'Leads',
    '/admin/contactos':    'Contactos',
    '/admin/config':       'Configuración',
  };
  const subtitles: Record<string, string> = {
    '/admin':              'Vista general',
    '/admin/diagnosticos': 'Respuestas del formulario de diagnóstico',
    '/admin/leads':        'Pipeline comercial',
    '/admin/contactos':    'Mensajes desde thefac.co',
    '/admin/config':       'Ajustes generales',
  };
  const [search, setSearch] = useState('');

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 5,
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 28px',
      background: 'var(--frost-bg)',
      backdropFilter: 'var(--frost-blur)',
      WebkitBackdropFilter: 'var(--frost-blur)',
      minHeight: 72,
    } as CSSProperties}>
      <div style={{ flex: '0 0 auto' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 22, color: 'var(--fg-1)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
          {titles[pathname] ?? 'Admin'}
        </h1>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
          {subtitles[pathname] ?? ''}
        </div>
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 420, marginLeft: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 40, padding: '0 14px', background: 'var(--bg-raised)', borderRadius: 8 }}>
          <Icon name="search" size={16} color="var(--fg-3)" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar leads, negocios, diagnósticos…"
            style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)' }}
          />
          <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', padding: '2px 6px', background: 'var(--bg-inset)', borderRadius: 4 }}>/</kbd>
        </div>
      </div>

      {/* Theme toggle */}
      <button onClick={onTheme} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'} style={{
        width: 40, height: 40, borderRadius: 8, border: 0,
        background: 'var(--bg-raised)', color: 'var(--fg-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
      </button>

      {/* Notifications */}
      <button title="Notificaciones" style={{
        position: 'relative', width: 40, height: 40, borderRadius: 8, border: 0,
        background: 'var(--bg-raised)', color: 'var(--fg-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <Icon name="bell" size={18} />
        <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-primary)' }} />
      </button>
    </header>
  );
}

// ── Admin Layout ─────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('fac-theme') as 'light' | 'dark' | null;
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('fac-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <div
      data-theme={theme}
      style={{
        display: 'flex', minHeight: '100vh',
        background: 'var(--bg-canvas)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} pathname={pathname} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar pathname={pathname} theme={theme} onTheme={toggleTheme} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
