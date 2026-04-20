'use client';

import { useState } from 'react';
import { submitIntake } from '@/lib/intake-queries';

// ─────────────────────────────────────────────────────────────
// Pedro Zalpa intake form
// Route: /diagnostico/pedro-zalpa
// Submits to Supabase table: intake_submissions
//   Required columns: id (uuid), created_at (timestamptz),
//   client_slug (text), answers (jsonb),
//   completed_count (int), submitted_at (timestamptz)
// ─────────────────────────────────────────────────────────────

interface Answers {
  [key: string]: string | string[] | number;
}

export default function PedroZalpaForm({ slug }: { slug: string }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(key: string, value: string | string[] | number) {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const { ok, error } = await submitIntake({
      client_slug: slug,
      answers,
      completed_count: Object.keys(answers).length,
    });
    if (!ok) {
      setErrorMsg(error ?? 'Error al enviar. Intenta de nuevo.');
      setStatus('error');
    } else {
      setStatus('success');
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-canvas)', padding: 24,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, color: 'var(--fg-1)', margin: '0 0 12px' }}>
            ¡Formulario enviado!
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--fg-3)', lineHeight: 1.6 }}>
            Gracias Pedro, ya recibimos tus respuestas. Te contactaremos pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-canvas)', padding: '48px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 640 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 8 }}>
            Diagnóstico personalizado
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 500, color: 'var(--fg-1)', margin: 0, letterSpacing: '-0.02em' }}>
            Hola, Pedro
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--fg-3)', marginTop: 12, lineHeight: 1.6 }}>
            Este cuestionario nos ayuda a entender Zalpa y diseñar la solución correcta para ti.
            Toma unos 10 minutos.
          </p>
        </div>

        {/* Placeholder notice — remove when real form is inserted */}
        <div style={{
          padding: '20px 24px', background: 'rgba(180,83,9,0.08)', borderRadius: 10,
          borderLeft: '3px solid var(--accent-primary)', marginBottom: 32,
        }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-2)', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--fg-1)' }}>Formulario en construcción.</strong> Reemplaza este
            componente con el contenido real de <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg-inset)', padding: '1px 5px', borderRadius: 3 }}>PedroIntakeForm</code>.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Sample question — replace with real questions */}
          <div style={{ background: 'var(--bg-raised)', borderRadius: 12, padding: 24 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--fg-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
              Pregunta de ejemplo
            </label>
            <input
              type="text"
              value={(answers['sample'] as string) ?? ''}
              onChange={e => set('sample', e.target.value)}
              placeholder="Respuesta…"
              style={{
                width: '100%', minHeight: 44, padding: '0 14px', boxSizing: 'border-box',
                background: 'var(--bg-inset)', border: '1.5px solid transparent',
                borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-1)',
                outline: 'none', transition: 'border-color 150ms',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={e => (e.target.style.borderColor = 'transparent')}
            />
          </div>

          {errorMsg && (
            <div style={{ padding: '12px 16px', background: 'rgba(220,50,47,0.1)', borderRadius: 8, fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--danger)' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              minHeight: 52, padding: '0 28px', background: 'var(--accent-primary)',
              color: 'var(--fg-on-accent)', border: 0, borderRadius: 10,
              fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 600,
              cursor: status === 'loading' ? 'wait' : 'pointer',
              transition: 'opacity 150ms',
            }}
          >
            {status === 'loading' ? 'Enviando…' : 'Enviar respuestas'}
          </button>
        </form>
      </div>
    </div>
  );
}
