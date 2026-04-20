import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

// Cal.com sends responses keyed by field identifier (slugified label).
// We accept multiple possible keys for each question.
function extractResponse(responses: Record<string, { value: string; label?: string }>, ...keys: string[]): string {
  for (const key of keys) {
    if (responses[key]?.value) return String(responses[key].value);
  }
  // Fallback: search by label substring
  for (const [, v] of Object.entries(responses)) {
    for (const key of keys) {
      if (v.label?.toLowerCase().includes(key.toLowerCase()) && v.value) return String(v.value);
    }
  }
  return '';
}

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'not configured' }, { status: 503 });
  }
  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json();
    const triggerEvent: string = body.triggerEvent ?? body.type ?? '';

    // Only handle booking creations
    if (!triggerEvent.includes('BOOKING_CREATED') && triggerEvent !== 'booking.created') {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const payload = body.payload ?? body;
    const attendees: { name?: string; email?: string }[] = payload.attendees ?? [];
    const attendee = attendees[0] ?? {};
    const responses: Record<string, { value: string; label?: string }> = payload.responses ?? {};

    const businessName = extractResponse(responses,
      'business_name', 'nombre_negocio', 'negocio', 'como_se_llama_tu_negocio',
      'business', 'empresa');
    const industry = extractResponse(responses,
      'industry', 'industria', 'en_que_industria_operas', 'sector');
    const automationGoals = extractResponse(responses,
      'automation_goals', 'que_automatizar', 'que_te_gustaria_automatizar',
      'automatizar', 'goals', 'objetivo');
    const employees = extractResponse(responses,
      'employees', 'empleados', 'cuantos_empleados', 'team_size');

    const slug = businessName ? slugify(businessName) : slugify(attendee.name ?? 'lead');
    const contactName = attendee.name ?? '';
    const email = attendee.email ?? '';

    const firstNote = [
      automationGoals && `Quiere automatizar: ${automationGoals}`,
      employees && `Empleados: ${employees}`,
      `Reservó desde Cal.com`,
    ].filter(Boolean).join(' · ');

    const { error } = await supabaseAdmin.from('leads').insert({
      contact_name:     contactName,
      business_name:    businessName || contactName,
      industry:         industry || null,
      source:           'cal_booking',
      stage:            'contactado',
      assignee:         'TB',
      email:            email,
      last_note:        firstNote,
      linked_diagnostic: slug,
      notes: firstNote ? [{ text: firstNote, author: 'CAL', at: Date.now() }] : [],
      timeline: [{ stage: 'contactado', at: Date.now() }],
    });

    if (error) {
      console.error('[cal-webhook] Supabase insert error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    console.log('[cal-webhook] Lead created for', businessName || contactName, '— slug:', slug);
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error('[cal-webhook] Parse error:', err);
    return NextResponse.json({ ok: false, error: 'invalid payload' }, { status: 400 });
  }
}
