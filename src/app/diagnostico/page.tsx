import type { Metadata } from "next";
import styles from "./page.module.css";
import DiagnosticForm from "@/components/DiagnosticForm/DiagnosticForm";

export const metadata: Metadata = {
  title: "Diagnóstico Técnico — Volante",
  description: "Obtén un diagnóstico técnico de automatización para tu empresa desde $1,000 MXN. 26 preguntas, resultados en 48 horas.",
  openGraph: {
    title: "Diagnóstico Técnico — Volante",
    description: "Obtén un diagnóstico técnico de automatización para tu empresa desde $1,000 MXN.",
    locale: "es_MX",
  },
};

export default async function DiagnosticoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tier = typeof params.tier === "string" ? params.tier : "";

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Análisis y plan técnico</span>
          <h1 className={styles.title}>Descubre exactamente qué automatizar en tu negocio</h1>
          <p className={styles.subtitle}>
            Nuestro diagnóstico te da un plan técnico detallado con costos de implementación estimados — para que sepas exactamente qué se puede construir, cuánto cuesta, y qué impacto tendrá en tu negocio.
          </p>
          <div className={styles.guarantees}>
            <span className={styles.guarantee}>
              <span aria-hidden="true">⏱</span> Análisis en 48hrs
            </span>
            <span className={styles.guarantee}>
              <span aria-hidden="true">📋</span> Plan técnico + costos estimados
            </span>
            <span className={styles.guarantee}>
              <span aria-hidden="true">🔒</span> Datos 100% confidenciales
            </span>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <DiagnosticForm initialTier={tier} />
          </div>
          <aside className={styles.aside}>
            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>¿Qué incluye tu diagnóstico?</h3>
              <ul className={styles.asideList}>
                <li>Mapa completo de tus procesos actuales</li>
                <li>Identificación de los 3–5 puntos de mayor pérdida de tiempo</li>
                <li>Estimación de horas y dinero recuperables por mes</li>
                <li>Plan técnico con costos de implementación estimados</li>
                <li>Recomendación de herramientas según tu presupuesto</li>
                <li>La implementación es un proyecto separado — el plan te dice exactamente qué costará</li>
              </ul>
            </div>
            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>¿Por qué vale la pena saberlo?</h3>
              <ul className={styles.asideList}>
                <li>El 72% de las PyMEs operan con procesos 100% manuales — y no saben cuánto les cuesta</li>
                <li>Los negocios que automatizan su primer contacto responden 100× más rápido que los que lo hacen manual (Harvard Business Review)</li>
                <li>Un sistema de recordatorios por WhatsApp reduce las citas perdidas entre un 40–60%</li>
                <li>El diagnóstico te muestra exactamente cuánto tiempo y dinero estás dejando sobre la mesa</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
