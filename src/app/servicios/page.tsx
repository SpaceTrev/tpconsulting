import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios — TPConsulting",
  description: "Nuestros servicios de automatización e integración de sistemas para PyMEs mexicanas.",
  openGraph: {
    title: "Servicios — TPConsulting",
    description: "Nuestros servicios de automatización e integración de sistemas para PyMEs mexicanas.",
    locale: "es_MX",
  },
};

export default function ServiciosPage() {
  return (
    <main>
      <h1>Servicios</h1>
      <p>Automatización de procesos, integración de sistemas y consultoría tecnológica.</p>
    </main>
  );
}
