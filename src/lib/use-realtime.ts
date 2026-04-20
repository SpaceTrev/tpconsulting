'use client';
import { useEffect, useRef } from 'react';
import { getSupabase } from './supabase';

export function useRealtimeTable(table: string, onRefresh: () => void) {
  const cbRef = useRef(onRefresh);
  useEffect(() => { cbRef.current = onRefresh; });

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    const channel = sb
      .channel(`rt-${table}`)
      .on('postgres_changes' as never, { event: '*', schema: 'public', table }, () => cbRef.current())
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, [table]);
}
