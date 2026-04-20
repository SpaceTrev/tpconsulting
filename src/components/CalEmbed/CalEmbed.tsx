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
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: mode === 'full' ? '48px 24px' : '32px 20px',
        background: 'var(--bg-inset)', borderRadius: 12,
        minHeight: mode === 'full' ? 320 : 180,
        gap: 12,
      }}>
        <span style={{ fontSize: 32 }}>📅</span>
        {title && (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: mode === 'full' ? 22 : 16, fontWeight: 500, color: 'var(--fg-1)', margin: 0 }}>
            {title}
          </p>
        )}
        {subtitle && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)', margin: 0, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)', margin: 0 }}>
          Calendario próximamente
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
