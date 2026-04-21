'use client';

import { useState } from 'react';
import DiagnosticForm from '@/components/DiagnosticForm/DiagnosticForm';

export default function CollapsibleForm({ initialTier }: { initialTier?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--bg-inset)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: 'var(--space-6)',
          background: 'var(--bg-raised)',
          border: 0,
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            marginBottom: 6,
          }}>
            Opcional — antes de la llamada
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--fg-1)',
            letterSpacing: '-0.01em',
          }}>
            ¿Quieres que lleguemos más preparados?
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            color: 'var(--fg-3)',
            marginTop: 4,
          }}>
            Llena esto antes de la llamada y llegamos con ideas concretas para tu negocio.
          </div>
        </div>
        <span style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'var(--bg-inset)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '1.125rem',
          color: 'var(--fg-2)',
          transition: 'transform 200ms',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>
          +
        </span>
      </button>

      {open && (
        <div style={{ padding: 'var(--space-8)', background: 'var(--bg-canvas)' }}>
          <DiagnosticForm initialTier={initialTier} />
        </div>
      )}
    </div>
  );
}
