import { getSupabase } from './supabase';

export interface IntakeSubmission {
  client_slug: string;
  answers: Record<string, unknown>;
  completed_count: number;
}

export async function submitIntake(submission: IntakeSubmission): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: 'Supabase no configurado.' };

  const { error } = await sb.from('intake_submissions').insert([{
    ...submission,
    submitted_at: new Date().toISOString(),
  }]);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
