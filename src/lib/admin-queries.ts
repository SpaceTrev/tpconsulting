import { getSupabase } from './supabase';
import type { Diagnostic, Lead, Contact } from './admin-data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDiagnostic(row: any): Diagnostic {
  return {
    id: row.id,
    submittedAt: new Date(row.created_at).getTime(),
    businessName: row.business_name ?? '',
    industry: row.industry ?? '',
    tier: row.tier ?? 'escaneo',
    urgency: row.urgency ?? 'explorando',
    status: row.status ?? 'nuevo',
    contact: {
      name: row.contact_name ?? '',
      whatsapp: row.contact_whatsapp ?? '',
      email: row.contact_email ?? '',
      preference: row.contact_preference ?? 'whatsapp',
    },
    stage1: {
      city: row.city ?? '',
      employees: parseInt(row.employees) || 0,
      ageYears: parseInt(row.business_age) || 0,
    },
    stage2: {
      channels: row.customer_channels ?? [],
      responseTime: row.response_time ?? '',
      crm: row.client_data_mgmt ?? '',
      cfdi: row.cfdi_status ?? '',
      googleBusiness: row.google_business === 'si' || row.google_business === true,
    },
    stage3: {
      timeWaste: row.biggest_time_waste ?? '',
      oneThing: row.one_thing_to_automate ?? '',
      pastAttempts: row.past_automation_detail || row.past_automation || '',
      losingCustomers: (row.losing_customers_how?.length ?? 0) > 0,
      currentTools: row.current_tools ?? [],
    },
    stage4: {
      currentSpend: row.current_tech_spend ?? '',
      budget: row.automation_budget ?? '',
      revenue: row.monthly_revenue ?? '',
      notes: row.additional_notes ?? '',
    },
    paymentStatus: row.payment_status ?? 'pendiente',
  };
}

export async function fetchDiagnostics(): Promise<Diagnostic[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('diagnostic_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(mapDiagnostic);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapContact(row: any): Contact {
  return {
    id: row.id,
    submittedAt: new Date(row.created_at).getTime(),
    name: row.name ?? '',
    email: row.email ?? '',
    whatsapp: row.whatsapp ?? '',
    industry: row.industry ?? '',
    message: row.message ?? '',
    source: row.source_page ?? '/',
    status: row.status ?? 'nuevo',
  };
}

export async function fetchContacts(): Promise<Contact[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(mapContact);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLead(row: any): Lead {
  return {
    id: row.id,
    stage: row.stage ?? 'nuevo',
    contactName: row.contact_name ?? '',
    businessName: row.business_name ?? '',
    industry: row.industry ?? '',
    source: row.source ?? 'manual',
    daysInStage: row.days_in_stage ?? 0,
    assignee: row.assignee ?? 'TB',
    whatsapp: row.whatsapp ?? '',
    email: row.email ?? '',
    lastNote: row.last_note ?? '',
    nextAction: row.next_action ?? '',
    revenueEstimate: row.estimated_price ?? row.revenue_estimate ?? 0,
    estimatedPrice: row.estimated_price ?? null,
    leadId: row.lead_id ?? null,
    leadSource: row.lead_source ?? null,
    result: row.result ?? null,
    lossReason: row.loss_reason ?? null,
    linkedDiagnostic: row.linked_diagnostic ?? null,
    timeline: row.timeline ?? [],
    notes: row.notes ?? [],
  };
}

export async function fetchLeads(): Promise<Lead[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(mapLead);
}

// ── Mutations ─────────────────────────────────────────────────

export async function updateDiagnosticStatus(id: string, status: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb
    .from('diagnostic_submissions')
    .update({ status })
    .eq('id', id);
  return !error;
}

export async function convertDiagnosticToLead(d: Diagnostic): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from('leads').insert([{
    stage: 'nuevo',
    contact_name: d.contact.name,
    business_name: d.businessName,
    industry: d.industry,
    source: 'diagnostico',
    assignee: 'TB',
    whatsapp: d.contact.whatsapp,
    email: d.contact.email,
    last_note: '',
    next_action: 'Contactar para agendar reunión',
    revenue_estimate: 0,
    linked_diagnostic: d.id,
    timeline: [{ stage: 'nuevo', at: Date.now() }],
    notes: [],
    days_in_stage: 0,
  }]);
  if (error) return false;
  await sb.from('diagnostic_submissions').update({ status: 'convertido' }).eq('id', d.id);
  return true;
}

export async function updateLeadStage(lead: Lead, nextStage: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const newTimeline = [...lead.timeline, { stage: nextStage, at: Date.now() }];
  const { error } = await sb
    .from('leads')
    .update({ stage: nextStage, days_in_stage: 0, timeline: newTimeline })
    .eq('id', lead.id);
  return !error;
}

export async function addLeadNote(lead: Lead, text: string, author: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const newNotes = [...lead.notes, { at: Date.now(), author, text }];
  const { error } = await sb
    .from('leads')
    .update({ notes: newNotes, last_note: text })
    .eq('id', lead.id);
  return !error;
}

export async function updateContactStatus(id: string, status: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from('contacts').update({ status }).eq('id', id);
  return !error;
}

export async function convertContactToLead(c: Contact): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from('leads').insert([{
    stage: 'nuevo',
    contact_name: c.name,
    business_name: c.name,
    industry: c.industry,
    source: 'contacto',
    assignee: 'TB',
    whatsapp: c.whatsapp,
    email: c.email,
    last_note: c.message,
    next_action: 'Responder mensaje',
    revenue_estimate: 0,
    linked_diagnostic: null,
    timeline: [{ stage: 'nuevo', at: Date.now() }],
    notes: [],
    days_in_stage: 0,
  }]);
  if (error) return false;
  await sb.from('contacts').update({ status: 'convertido' }).eq('id', c.id);
  return true;
}

// ── Ops KPI helpers ───────────────────────────────────────────

export async function fetchActiveClientsCount(): Promise<number> {
  const sb = getSupabase();
  if (!sb) return 0;
  const { count } = await sb
    .from('clients')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');
  return count ?? 0;
}

export async function fetchLiveAutomationCost(): Promise<number> {
  const sb = getSupabase();
  if (!sb) return 0;
  const { data } = await sb
    .from('deployed_automations')
    .select('monthly_cost')
    .eq('status', 'live');
  return (data ?? []).reduce((s, r) => s + (r.monthly_cost ?? 0), 0);
}

export async function fetchUpsellsPipeline(): Promise<{ active: number; closed: number }> {
  const sb = getSupabase();
  if (!sb) return { active: 0, closed: 0 };
  const { data } = await sb
    .from('upsells')
    .select('estimated_price,result');
  const rows = data ?? [];
  return {
    active: rows.filter(r => !r.result).reduce((s, r) => s + (r.estimated_price ?? 0), 0),
    closed: rows.filter(r => r.result === 'ganado').reduce((s, r) => s + (r.estimated_price ?? 0), 0),
  };
}
