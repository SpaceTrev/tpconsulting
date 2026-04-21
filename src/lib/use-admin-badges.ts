'use client';
import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from './supabase';

export interface AdminBadges {
  diagnostics: number;
  leads: number;
  contacts: number;
  projects: number;
  automations: number;
}

export function useAdminBadges(): AdminBadges {
  const [badges, setBadges] = useState<AdminBadges>({ diagnostics: 0, leads: 0, contacts: 0, projects: 0, automations: 0 });

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const [{ count: d }, { count: l }, { count: c }, { count: p }, { count: a }] = await Promise.all([
      sb.from('diagnostic_submissions').select('id', { count: 'exact', head: true }).eq('status', 'nuevo'),
      sb.from('leads').select('id', { count: 'exact', head: true }).eq('stage', 'nuevo'),
      sb.from('contacts').select('id', { count: 'exact', head: true }).eq('status', 'nuevo'),
      sb.from('projects').select('id', { count: 'exact', head: true }).in('status', ['planning', 'in_progress', 'testing', 'live']),
      sb.from('deployed_automations').select('id', { count: 'exact', head: true }).eq('status', 'live'),
    ]);
    setBadges({ diagnostics: d ?? 0, leads: l ?? 0, contacts: c ?? 0, projects: p ?? 0, automations: a ?? 0 });
  }, []);

  useEffect(() => {
    load();
    const sb = getSupabase();
    if (!sb) return;
    const channel = sb
      .channel('admin-badges')
      .on('postgres_changes' as never, { event: '*', schema: 'public', table: 'diagnostic_submissions' }, load)
      .on('postgres_changes' as never, { event: '*', schema: 'public', table: 'leads' }, load)
      .on('postgres_changes' as never, { event: '*', schema: 'public', table: 'contacts' }, load)
      .on('postgres_changes' as never, { event: '*', schema: 'public', table: 'projects' }, load)
      .on('postgres_changes' as never, { event: '*', schema: 'public', table: 'deployed_automations' }, load)
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, [load]);

  return badges;
}
