import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casos de Éxito — TPConsulting",
  description: "Conoce cómo hemos ayudado a empresas mexicanas a automatizar y escalar sus operaciones.",
  openGraph: {
    title: "Casos de Éxito — TPConsulting",
    description: "Conoce cómo hemos ayudado a empresas mexicanas a automatizar y escalar sus operaciones.",
    locale: "es_MX",
  },
};

export default function CasosPage() {
  return (
    <main>
      <h1>Casos de Éxito</h1>
      <p>Resultados reales de empresas que han transformado sus operaciones con TPConsulting.</p>
    </main>
  );
}
