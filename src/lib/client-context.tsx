'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getSupabase } from './supabase';

export interface ClientBasic { id: string; name: string; }

interface ClientContextValue {
  clients: ClientBasic[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  loading: boolean;
}

const ClientContext = createContext<ClientContextValue>({
  clients: [],
  selectedClientId: '',
  setSelectedClientId: () => {},
  loading: false,
});

export function ClientContextProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<ClientBasic[]>([]);
  const [selectedClientId, setIdState] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('fac-selected-client') ?? '';
    setIdState(saved);
  }, []);

  const loadClients = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }
    const { data } = await sb.from('clients').select('id,name').order('name');
    setClients(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadClients(); }, [loadClients]);

  function setSelectedClientId(id: string) {
    setIdState(id);
    if (id) localStorage.setItem('fac-selected-client', id);
    else localStorage.removeItem('fac-selected-client');
  }

  return (
    <ClientContext.Provider value={{ clients, selectedClientId, setSelectedClientId, loading }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  return useContext(ClientContext);
}
