import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soluciones — TPConsulting",
  description: "Soluciones de automatización personalizadas para los desafíos de tu industria.",
  openGraph: {
    title: "Soluciones — TPConsulting",
    description: "Soluciones de automatización personalizadas para los desafíos de tu industria.",
    locale: "es_MX",
  },
};

export default function SolucionesPage() {
  return (
    <main>
      <h1>Soluciones</h1>
      <p>Soluciones tecnológicas adaptadas a las necesidades específicas de tu empresa.</p>
    </main>
  );
}
