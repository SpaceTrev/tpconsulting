import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import SolutionFilter from "./SolutionFilter";

export const metadata: Metadata = {
  title: "Soluciones — Volante",
  description: "12 soluciones de automatización preconfiguradas para tu industria. Actívala en días, no meses.",
  openGraph: {
    title: "Soluciones — Volante",
    description: "Soluciones de automatización probadas para manufactura, retail, logística, servicios y más.",
    locale: "es_MX",
  },
};

export default function SolucionesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Marketplace de soluciones</span>
          <h1 className={styles.title}>Automatizaciones listas para activar en tu negocio</h1>
          <p className={styles.subtitle}>
            12 soluciones preconfiguradas y probadas en empresas reales. Filtra por tu industria y encuentra exactamente lo que necesitas.
          </p>
        </div>
      </div>

      <SolutionFilter />

      <div className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>¿No encuentras tu solución?</h2>
          <p className={styles.ctaText}>
            Cada negocio es único. Agenda un diagnóstico y construimos la automatización perfecta para tu operación.
          </p>
          <Link href="/diagnostico" className={styles.ctaLink}>
            Pedir diagnóstico personalizado
          </Link>
        </div>
      </div>
    </main>
  );
}
