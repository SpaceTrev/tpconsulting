import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnóstico Técnico — TPConsulting",
  description: "Obtén un diagnóstico técnico de automatización para tu empresa desde $1,000 MXN.",
  openGraph: {
    title: "Diagnóstico Técnico — TPConsulting",
    description: "Obtén un diagnóstico técnico de automatización para tu empresa desde $1,000 MXN.",
    locale: "es_MX",
  },
};

export default function DiagnosticoPage() {
  return (
    <main>
      <h1>Diagnóstico Técnico</h1>
      <p>Solicita tu diagnóstico de automatización y descubre las oportunidades de mejora en tu empresa.</p>
    </main>
  );
}
