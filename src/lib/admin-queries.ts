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
    revenueEstimate: row.revenue_estimate ?? 0,
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
