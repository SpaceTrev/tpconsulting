'use client';

import { useEffect, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

// Set NEXT_PUBLIC_CAL_LINK in .env.local to activate: e.g. "trevbdev/consulta-fac"
const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? null;

const BRAND_COLOR_LIGHT = '#b45309';
const BRAND_COLOR_DARK  = '#f59e0b';

interface CalEmbedProps {
  mode?: 'sidebar' | 'full';
  title?: string;
  subtitle?: string;
}

export default function CalEmbed({ mode = 'sidebar', title, subtitle }: CalEmbedProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme');
    setTheme(t === 'dark' ? 'dark' : 'light');

    const observer = new MutationObserver(() => {
      const next = document.documentElement.getAttribute('data-theme');
      setTheme(next === 'dark' ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!CAL_LINK) return;
    getCalApi({}).then(cal => {
      cal('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
        theme,
        cssVarsPerTheme: {
          light: { 'cal-brand': BRAND_COLOR_LIGHT },
          dark:  { 'cal-brand': BRAND_COLOR_DARK },
        },
      });
    });
  }, [theme]);

  if (!CAL_LINK) {
    const waMsg = encodeURIComponent('Hola, quiero agendar una llamada exploratoria gratuita de 30 minutos.');
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: mode === 'full' ? '56px 24px' : '36px 20px',
        background: 'var(--bg-inset)', borderRadius: 12,
        minHeight: mode === 'full' ? 360 : 200,
        gap: 16,
      }}>
        {title && (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: mode === 'full' ? 22 : 16, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>
            {title}
          </p>
        )}
        {subtitle && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', margin: 0, lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}
        <a
          href={`https://wa.me/13038299013?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '14px 28px', borderRadius: 10,
            background: '#25D366', color: '#fff',
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
            textDecoration: 'none', letterSpacing: '-0.01em',
            boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Envíanos un WhatsApp para agendar
        </a>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', margin: 0 }}>
          30 min · sin costo · respuesta en menos de 24 h
        </p>
      </div>
    );
  }

  const minHeight = mode === 'full' ? '600px' : '500px';

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', minHeight }}>
      {title && (
        <div style={{ paddingBottom: 16 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: mode === 'full' ? 24 : 18, fontWeight: 500, color: 'var(--fg-1)', margin: '0 0 4px' }}>
            {title}
          </p>
          {subtitle && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)', margin: 0, lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <Cal
        calLink={CAL_LINK}
        style={{ width: '100%', height: minHeight, overflow: 'scroll' }}
        config={{
          layout: 'month_view',
          theme,
          brandColor: theme === 'dark' ? BRAND_COLOR_DARK : BRAND_COLOR_LIGHT,
        }}
      />
    </div>
  );
}
