'use client';
import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from './supabase';

export interface AdminBadges {
  diagnostics: number;
  leads: number;
  contacts: number;
}

export function useAdminBadges(): AdminBadges {
  const [badges, setBadges] = useState<AdminBadges>({ diagnostics: 0, leads: 0, contacts: 0 });

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const [{ count: d }, { count: l }, { count: c }] = await Promise.all([
      sb.from('diagnostic_submissions').select('id', { count: 'exact', head: true }).eq('status', 'nuevo'),
      sb.from('leads').select('id', { count: 'exact', head: true }).eq('stage', 'nuevo'),
      sb.from('contacts').select('id', { count: 'exact', head: true }).eq('status', 'nuevo'),
    ]);
    setBadges({ diagnostics: d ?? 0, leads: l ?? 0, contacts: c ?? 0 });
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
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, [load]);

  return badges;
}
