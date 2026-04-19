import type { Metadata } from "next";
import { Space_Grotesk, Public_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";

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
  title: "TPConsulting — Automatización inteligente para negocios mexicanos",
  description:
    "Diseñamos e implementamos sistemas de automatización de nivel enterprise para PyMEs en México. Diagnóstico técnico desde $1,000 MXN.",
  openGraph: {
    title: "TPConsulting — Automatización inteligente para negocios mexicanos",
    description:
      "Diseñamos e implementamos sistemas de automatización de nivel enterprise para PyMEs en México. Diagnóstico técnico desde $1,000 MXN.",
    type: "website",
    locale: "es_MX",
    siteName: "TPConsulting",
  },
  twitter: {
    card: "summary_large_image",
    title: "TPConsulting — Automatización inteligente para negocios mexicanos",
    description:
      "Diseñamos e implementamos sistemas de automatización de nivel enterprise para PyMEs en México.",
  },
  metadataBase: new URL("https://tpconsulting.mx"),
  alternates: { canonical: "/" },
};

/* Anti-flash: runs inline before paint, sets data-theme on <html> */
const themeScript = `
try {
  var t = localStorage.getItem('theme');
  var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
} catch(e) {
  document.documentElement.setAttribute('data-theme', 'light');
}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${publicSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
