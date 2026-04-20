'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

const ALLOWED = ['trevbdev@gmail.com', 'pabstrada@gmail.com'];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(true);

  // If already authenticated, skip straight to admin
  useEffect(() => {
    getSupabase()?.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/admin');
      else setChecking(false);
    }) ?? setChecking(false);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const sb = getSupabase();
    if (!sb) { setError('Supabase no configurado.'); setLoading(false); return; }

    const { data, error: authErr } = await sb.auth.signInWithPassword({ email, password });
    if (authErr || !data.session) {
      setError('Credenciales incorrectas.');
      setLoading(false);
      return;
    }

    if (!ALLOWED.includes(data.session.user.email ?? '')) {
      await sb.auth.signOut();
      setError('Acceso no autorizado.');
      setLoading(false);
      return;
    }

    router.replace('/admin');
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-3)' }}>Verificando sesión…</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-canvas)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 64 64">
            <g transform="translate(32 32)">
              <circle r="20" fill="none" stroke="var(--accent-primary)" strokeWidth="3.5"/>
              <circle r="3.5" fill="var(--accent-primary)"/>
              <line x1="0" y1="-20" x2="0" y2="-10" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="20" y1="0" x2="10" y2="0" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="0" y1="20" x2="0" y2="10" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="-20" y1="0" x2="-10" y2="0" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round"/>
            </g>
          </svg>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>FAC</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>CRM Admin</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-raised)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                Correo
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email" autoFocus
                placeholder="trevbdev@gmail.com"
                style={{
                  width: '100%', minHeight: 44, padding: '0 14px', boxSizing: 'border-box',
                  background: 'var(--bg-inset)', border: '1.5px solid transparent',
                  borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-1)',
                  outline: 'none', transition: 'border-color 150ms',
                } as CSSProperties}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={e => (e.target.style.borderColor = 'transparent')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                Contraseña
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: '100%', minHeight: 44, padding: '0 14px', boxSizing: 'border-box',
                  background: 'var(--bg-inset)', border: '1.5px solid transparent',
                  borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-1)',
                  outline: 'none', transition: 'border-color 150ms',
                } as CSSProperties}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={e => (e.target.style.borderColor = 'transparent')}
              />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(220,50,47,0.1)', borderRadius: 8, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{
                minHeight: 44, padding: '0 24px', background: 'var(--accent-primary)',
                color: 'var(--fg-on-accent)', border: 0, borderRadius: 8,
                fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
                opacity: (!email || !password) ? 0.55 : 1, transition: 'opacity 150ms',
              }}
            >
              {loading ? 'Entrando…' : 'Entrar al CRM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
