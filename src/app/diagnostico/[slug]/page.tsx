import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PedroZalpaForm from '@/components/intakes/PedroZalpaForm';

interface ClientConfig {
  name: string;
  businessName: string;
  description: string;
}

const CLIENTS: Record<string, ClientConfig> = {
  'pedro-zalpa': {
    name: 'Pedro',
    businessName: 'Zalpa',
    description: 'Cuestionario de diagnóstico personalizado para Zalpa.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const client = CLIENTS[slug];
  if (!client) return {};
  return {
    title: `Diagnóstico · ${client.businessName} × FAC`,
    description: client.description,
    robots: { index: false },
  };
}

export default async function ClientIntakePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!CLIENTS[slug]) notFound();

  if (slug === 'pedro-zalpa') {
    return <PedroZalpaForm slug={slug} />;
  }

  notFound();
}
