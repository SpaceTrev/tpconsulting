import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — TPConsulting",
  description: "Contáctanos para comenzar tu transformación digital. Respondemos en menos de 24 horas.",
  openGraph: {
    title: "Contacto — TPConsulting",
    description: "Contáctanos para comenzar tu transformación digital. Respondemos en menos de 24 horas.",
    locale: "es_MX",
  },
};

export default function ContactoPage() {
  return (
    <main>
      <h1>Contacto</h1>
      <p>Estamos listos para ayudarte. Cuéntanos sobre tu proyecto y te contactamos en menos de 24 horas.</p>
    </main>
  );
}
