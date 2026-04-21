import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — FAC",
  description: "Artículos sobre automatización, IA y tecnología para cualquier empresa.",
  openGraph: {
    title: "Blog — FAC",
    description: "Artículos sobre automatización, IA y tecnología para cualquier empresa.",
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
