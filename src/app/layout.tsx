import type { Metadata } from "next";
import { Space_Grotesk, Public_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MarketingShell from "@/components/MarketingShell";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FAC — Automatización inteligente para tu negocio",
  description:
    "Diseñamos e implementamos sistemas de automatización de nivel enterprise para empresas de todos tamaños. Diagnóstico técnico desde $1,000 MXN.",
  openGraph: {
    title: "FAC — Automatización inteligente para tu negocio",
    description:
      "Diseñamos e implementamos sistemas de automatización de nivel enterprise para empresas de todos tamaños. Diagnóstico técnico desde $1,000 MXN.",
    type: "website",
    locale: "es_MX",
    siteName: "FAC",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAC — Automatización inteligente para tu negocio",
    description:
      "Diseñamos e implementamos sistemas de automatización de nivel enterprise para empresas de todos tamaños.",
  },
  metadataBase: new URL("https://thefac.co"),
  alternates: { canonical: "/" },
};

const themeScript = `
try {
  var t = localStorage.getItem('theme');
  var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
} catch(e) {
  document.documentElement.setAttribute('data-theme', 'light');
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${publicSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <MarketingShell>{children}</MarketingShell>
      </body>
    </html>
  );
}
