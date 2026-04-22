// Mock seed data for FAC admin dashboard — mirrors data.js from design

export const INDUSTRIES = [
  'Panadería', 'Taller mecánico', 'Clínica dental', 'Notaría',
  'Restaurante', 'Ferretería', 'Gimnasio', 'Salón de belleza',
  'Consultoría', 'E-commerce', 'Inmobiliaria', 'Escuela',
];

export const TIERS = [
  { id: 'escaneo',     label: 'Escaneo',     price: 1000,  color: '#6b8e23' },
  { id: 'diagnostico', label: 'Diagnóstico', price: 5000,  color: '#268bd2' },
  { id: 'plan',        label: 'Plan',        price: 10000, color: '#b58900' },
  { id: 'ejecutivo',   label: 'Ejecutivo',   price: 15000, color: '#b45309' },
] as const;

export const URGENCIES = [
  { id: 'asap',       label: 'ASAP',       color: '#dc322f' },
  { id: '1-2-meses',  label: '1-2 meses',  color: '#b58900' },
  { id: 'explorando', label: 'Explorando', color: '#839496' },
] as const;

export const PIPELINE_STAGES = [
  { id: 'nuevo',       label: 'Nuevo',                dot: '#b45309' },
  { id: 'contactado',  label: 'Contactado',           dot: '#268bd2' },
  { id: 'respondio',   label: 'Respondió',            dot: '#b58900' },
  { id: 'diagnostico', label: 'Diagnóstico agendado', dot: '#cb4b16' },
  { id: 'propuesta',   label: 'Propuesta enviada',    dot: '#b45309' },
  { id: 'negociando',  label: 'Negociando',           dot: '#b58900' },
  { id: 'cliente',     label: 'Cliente',              dot: '#6b8e23', icon: '✓' },
  { id: 'perdido',     label: 'Perdido',              dot: '#dc322f', icon: '✗', muted: true },
] as const;

export const ASSIGNEES = [
  { id: 'TB', name: 'Trevor B.', color: '#b45309' },
  { id: 'PE', name: 'Pablo E.',  color: '#268bd2' },
] as const;

// ── Type helpers ────────────────────────────────────────────
export type Tier    = typeof TIERS[number];
export type Urgency = typeof URGENCIES[number];
export type Stage   = typeof PIPELINE_STAGES[number];
export type Assignee= typeof ASSIGNEES[number];

export interface Diagnostic {
  id: string;
  submittedAt: number;
  businessName: string;
  industry: string;
  tier: string;
  urgency: string;
  status: 'nuevo' | 'revisado' | 'contactado' | 'convertido';
  contact: { name: string; whatsapp: string; email: string; preference: string };
  stage1: { city: string; employees: number; ageYears: number };
  stage2: { channels: string[]; responseTime: string; crm: string; cfdi: string; googleBusiness: boolean };
  stage3: { timeWaste: string; oneThing: string; pastAttempts: string; losingCustomers: boolean; currentTools: string[] };
  stage4: { currentSpend: string; budget: string; revenue: string; notes: string };
  paymentStatus: 'pendiente' | 'pagado';
}

export interface Lead {
  id: string;
  stage: string;
  contactName: string;
  businessName: string;
  industry: string;
  source: string;
  daysInStage: number;
  assignee: string;
  whatsapp: string;
  email: string;
  lastNote: string;
  nextAction: string;
  revenueEstimate: number;
  estimatedPrice: number | null;
  leadId: string | null;
  leadSource: string | null;
  result: string | null;
  lossReason: string | null;
  linkedDiagnostic: string | null;
  timeline: { stage: string; at: number }[];
  notes: { at: number; author: string; text: string }[];
}

export interface Contact {
  id: string;
  submittedAt: number;
  name: string;
  email: string;
  whatsapp: string;
  industry: string;
  message: string;
  source: string;
  status: 'nuevo' | 'respondido' | 'convertido';
}

// ── Seeded pseudo-random helpers ─────────────────────────────
const FIRST = ['María','José','Juan','Guadalupe','Ana','Luis','Carlos','Patricia','Miguel','Rosa','Jorge','Sofía','Fernando','Alejandra','Ricardo','Daniela','Eduardo','Mónica','Raúl','Verónica','Andrés','Gabriela','Héctor','Cecilia','Arturo','Laura'];
const LAST  = ['García','Hernández','Martínez','López','González','Rodríguez','Pérez','Sánchez','Ramírez','Flores','Torres','Reyes','Cruz','Ortiz','Gutiérrez','Chávez','Jiménez','Mendoza','Aguilar','Morales','Vázquez','Romero','Herrera','Medina'];
const BIZ_PREFIX = ['Panadería','Taller','Dental','Notaría','Restaurante','Ferretería','Gimnasio','Salón','Consultoría','Tienda','Clínica','Café','Boutique','Agencia','Distribuidora'];
const BIZ_NAME   = ['San Juan','La Esperanza','El Buen Sabor','Moderno','Guadalupe','La Perla','Los Pinos','El Roble','del Valle','Jalisco','Azteca','Imperial','La Herradura','Reforma','del Sol'];

function pick<T>(arr: readonly T[] | T[], i: number): T { return arr[i % arr.length]; }
function rand(seed: number): number { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }

// ── DIAGNOSTICS ──────────────────────────────────────────────
export const DIAGNOSTICS: Diagnostic[] = Array.from({ length: 18 }).map((_, i) => {
  const tier     = pick(TIERS, i + 1);
  const urg      = pick(URGENCIES, Math.floor(rand(i * 3) * 3));
  const industry = pick(INDUSTRIES, i * 2);
  const first    = pick(FIRST, i * 5);
  const last     = pick(LAST, i * 7);
  const biz      = `${pick(BIZ_PREFIX, i)} ${pick(BIZ_NAME, i + 2)}`;
  const hoursAgo = Math.floor(rand(i) * 480);
  const submittedAt = Date.now() - hoursAgo * 3600 * 1000;
  const statuses = ['nuevo', 'revisado', 'contactado', 'convertido'] as const;
  const status   = i < 5 ? 'nuevo' : statuses[i % 4];
  return {
    id: `DX-${1024 + i}`,
    submittedAt,
    businessName: biz,
    industry,
    tier: tier.id,
    urgency: urg.id,
    status,
    contact: {
      name: `${first} ${last}`,
      whatsapp: `+52 33 ${1000 + i * 37}`.slice(0, 16),
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[áéíóú]/g, 'a')}@${biz.toLowerCase().replace(/[^a-z]/g, '')}.mx`,
      preference: i % 2 ? 'whatsapp' : 'email',
    },
    stage1: {
      city: ['Guadalajara','Zapopan','Tlaquepaque','Tonalá','León','Querétaro'][i % 6],
      employees: [1, 3, 5, 12, 28, 45, 80][i % 7],
      ageYears: [1, 2, 4, 7, 12, 18, 25][i % 7],
    },
    stage2: {
      channels: ['WhatsApp','Facebook','Instagram','Llamadas','Walk-in'].filter((_, k) => (i + k) % 3),
      responseTime: ['<5 min','15-30 min','1-2 horas','más de 2 horas'][i % 4],
      crm: ['Ninguno','Hoja de Excel','HubSpot','Salesforce','Otro'][i % 5],
      cfdi: ['Sí, manual','Sí, automatizado','No'][i % 3],
      googleBusiness: i % 2 === 0,
    },
    stage3: {
      timeWaste: ['Cobranza','Agenda de citas','Cotizaciones','Atención a clientes','Inventario'][i % 5],
      oneThing: [
        'Dejar de contestar el WhatsApp a las 11pm.',
        'Automatizar recordatorios de cita.',
        'Tener reportes diarios sin hacerlos yo.',
        'Conectar la tienda en línea con el inventario.',
        'Cobrar sin tener que perseguir clientes.',
      ][i % 5],
      pastAttempts: ['Intenté HubSpot gratis, no lo usamos','Contratamos a alguien de Upwork, no terminó','Nada aún','Probé Zapier, se rompía cada semana'][i % 4],
      losingCustomers: i % 3 !== 0,
      currentTools: ['WhatsApp Business','Google Sheets','Excel','Mercado Pago','Clip'].filter((_, k) => (i + k) % 2),
    },
    stage4: {
      currentSpend: ['$0','$500-$2K','$2K-$5K','$5K-$15K'][i % 4],
      budget: ['$10K','$25K','$50K','$100K+'][i % 4],
      revenue: ['<$100K','$100K-$500K','$500K-$2M','$2M+'][i % 4],
      notes: i % 3 === 0 ? 'Ya probamos una agencia que nos vendió mucho y no cumplió. Queremos algo concreto.' : '',
    },
    paymentStatus: i % 5 === 0 ? 'pendiente' : 'pagado',
  };
});

// ── LEADS ────────────────────────────────────────────────────
export const LEADS: Lead[] = Array.from({ length: 22 }).map((_, i) => {
  const stage    = pick(PIPELINE_STAGES, i);
  const industry = pick(INDUSTRIES, i * 3);
  const first    = pick(FIRST, i * 11);
  const last     = pick(LAST, i * 13);
  const biz      = `${pick(BIZ_PREFIX, i + 3)} ${pick(BIZ_NAME, i)}`;
  const source   = ['diagnostico','contacto','manual','referido'][i % 4];
  const daysInStage = Math.floor(rand(i * 7) * 14);
  const assignee = pick(ASSIGNEES, i);
  const notes = [
    'Le interesa el bot de WhatsApp para agenda. Tiene 3 sucursales.',
    'Pidió propuesta por escrito. Enviar el viernes.',
    'Me dijo que lo platica con su socio y me avisa el lunes.',
    'Ya tiene Zoho, hay que ver cómo integrar.',
    'Quiere empezar en enero. Follow-up el 15/dic.',
    'Prefiere llamada, no WhatsApp.',
  ];
  const revenues = [12000, 25000, 45000, 80000, 120000, 180000, 250000];
  const stageIdx = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
  const reachedStages = PIPELINE_STAGES.slice(0, Math.max(1, stageIdx + 1));
  return {
    id: `LD-${2048 + i}`,
    stage: stage.id,
    contactName: `${first} ${last}`,
    businessName: biz,
    industry,
    source,
    daysInStage,
    assignee: assignee.id,
    whatsapp: `+52 33 ${2000 + i * 41}`.slice(0, 16),
    email: `${first.toLowerCase()}@${biz.toLowerCase().replace(/[^a-z]/g, '')}.mx`,
    lastNote: pick(notes, i),
    nextAction: ['Enviar propuesta','Agendar llamada','Confirmar junta','Esperando respuesta','Mandar contrato'][i % 5],
    revenueEstimate: pick(revenues, i),
    estimatedPrice: pick(revenues, i),
    leadId: `L-${String(i + 1).padStart(3, '0')}`,
    leadSource: source,
    result: null,
    lossReason: null,
    linkedDiagnostic: source === 'diagnostico' ? `DX-${1024 + (i % 18)}` : null,
    timeline: reachedStages.map((s, k) => ({
      stage: s.id,
      at: Date.now() - (reachedStages.length - k) * 86400000 * (2 + (i % 5)),
    })),
    notes: [
      { at: Date.now() - 86400000 * 5, author: assignee.id, text: pick(notes, i) },
      { at: Date.now() - 86400000 * 2, author: assignee.id, text: pick(notes, i + 1) },
    ].slice(0, 1 + (i % 2)),
  };
});

// ── CONTACTS ─────────────────────────────────────────────────
export const CONTACTS: Contact[] = Array.from({ length: 14 }).map((_, i) => {
  const first    = pick(FIRST, i * 3);
  const last     = pick(LAST, i * 5);
  const hoursAgo = Math.floor(rand(i + 99) * 720);
  const statuses = ['nuevo', 'respondido', 'convertido'] as const;
  return {
    id: `CT-${3072 + i}`,
    submittedAt: Date.now() - hoursAgo * 3600 * 1000,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[áéíóú]/g, 'a')}@gmail.com`,
    whatsapp: `+52 33 ${3000 + i * 47}`.slice(0, 16),
    industry: pick(INDUSTRIES, i * 2),
    message: [
      'Me interesa saber más sobre la automatización de WhatsApp para mi panadería.',
      '¿Pueden conectar mi tienda de Shopify con facturación automática?',
      'Tengo 3 sucursales y quiero consolidar reportes diarios.',
      'Vi su post en LinkedIn, quiero agendar una llamada.',
      'Hola, ¿cuánto cuesta un diagnóstico inicial?',
      'Necesito ayuda con cobranza, estamos perdiendo clientes por falta de seguimiento.',
    ][i % 6],
    source: ['/','/contacto','/precios','/casos','/diagnostico'][i % 5],
    status: i < 4 ? 'nuevo' : statuses[i % 3],
  };
});

// ── Utility ──────────────────────────────────────────────────
export function relTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const d = Math.floor(hrs / 24);
  if (d < 7) return `hace ${d} d`;
  const w = Math.floor(d / 7);
  if (w < 4) return `hace ${w} sem`;
  return new Date(ts).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

export function formatMXNshort(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export function formatMXN(n: number): string {
  return '$' + n.toLocaleString('es-MX') + ' MXN';
}
