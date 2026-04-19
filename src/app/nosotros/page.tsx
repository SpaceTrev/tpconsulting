import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros — TPConsulting",
  description: "Equipo especializado en automatización e inteligencia artificial para empresas mexicanas.",
  openGraph: {
    title: "Nosotros — TPConsulting",
    description: "Equipo especializado en automatización e inteligencia artificial para empresas mexicanas.",
    locale: "es_MX",
  },
};

export default function NosotrosPage() {
  return (
    <main>
      <h1>Nosotros</h1>
      <p>Somos un equipo apasionado por la tecnología y comprometidos con el crecimiento de las empresas mexicanas.</p>
    </main>
  );
}
