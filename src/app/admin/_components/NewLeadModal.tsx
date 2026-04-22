'use client';

import { useState, CSSProperties } from 'react';
import { INDUSTRIES } from '@/lib/admin-data';
import { createLead } from '@/lib/admin-queries';

const LEAD_SOURCES = [
  { value: 'manual',      label: 'Manual' },
  { value: 'referido',    label: 'Referido' },
  { value: 'diagnostico', label: 'Diagnóstico' },
  { value: 'contacto',    label: 'Formulario web' },
  { value: 'linkedin',    label: 'LinkedIn' },
  { value: 'otro',        label: 'Otro' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: CSSProperties = { width: '100%', boxSizing: 'border-box', minHeight: 42, padding: '0 12px', background: 'var(--bg-raised)', color: 'var(--fg-1)', border: 0, borderRadius: 8, outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14 };
const selectStyle: CSSProperties = { ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23586e75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 32, cursor: 'pointer' };

function XIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function NewLeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [industry, setIndustry] = useState('');
  const [source, setSource] = useState('manual');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contactName.trim()) { setErr('El nombre es obligatorio'); return; }
    setSaving(true);
    const ok = await createLead({
      contactName: contactName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      industry: industry || 'General',
      source,
      estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : 0,
      notes: notes.trim(),
    });
    if (ok) { onCreated(); onClose(); }
    else { setErr('Error al guardar el lead'); setSaving(false); }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,22,29,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 130 } as CSSProperties} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 520, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-canvas)', borderRadius: 16, padding: '28px 24px', zIndex: 140, boxShadow: '0 24px 64px rgba(0,22,29,0.24)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Nuevo lead</div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--fg-1)' }}>Crear lead manual</h3>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 0, background: 'var(--bg-inset)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Nombre del contacto *">
            <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="ej. María García" autoFocus style={inputStyle} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="WhatsApp">
              <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+52 33 1234 5678" style={inputStyle} />
            </Field>
            <Field label="Email">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="maria@empresa.mx" style={inputStyle} />
            </Field>
            <Field label="Industria">
              <select value={industry} onChange={e => setIndustry(e.target.value)} style={selectStyle}>
                <option value="">— seleccionar —</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Fuente">
              <select value={source} onChange={e => setSource(e.target.value)} style={selectStyle}>
                {LEAD_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Valor estimado (MXN)">
            <input type="number" value={estimatedPrice} onChange={e => setEstimatedPrice(e.target.value)} placeholder="25000" style={inputStyle} />
          </Field>
          <Field label="Notas iniciales">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Contexto del lead, cómo llegó, qué necesita…" style={{ ...inputStyle, minHeight: 'unset', padding: '10px 12px', resize: 'vertical', lineHeight: '1.6' }} />
          </Field>
          {err && <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: 13, color: '#dc322f' }}>{err}</p>}
          <button type="submit" disabled={saving || !contactName.trim()} style={{ marginTop: 4, minHeight: 44, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: 0, borderRadius: 10, fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15, cursor: (saving || !contactName.trim()) ? 'not-allowed' : 'pointer', opacity: !contactName.trim() ? 0.5 : 1 }}>
            {saving ? 'Guardando…' : 'Crear lead'}
          </button>
        </form>
      </div>
    </>
  );
}
