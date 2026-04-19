import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — TPConsulting",
  description: "Artículos sobre automatización, IA y tecnología para empresas mexicanas.",
  openGraph: {
    title: "Blog — TPConsulting",
    description: "Artículos sobre automatización, IA y tecnología para empresas mexicanas.",
    locale: "es_MX",
  },
};

export default function BlogPage() {
  return (
    <main>
      <h1>Blog</h1>
      <p>Recursos, guías y casos de uso sobre automatización e inteligencia artificial.</p>
    </main>
  );
}
