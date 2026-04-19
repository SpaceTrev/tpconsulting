import type { Metadata } from "next";
import styles from "./page.module.css";
import DiagnosticForm from "@/components/DiagnosticForm/DiagnosticForm";

export const metadata: Metadata = {
  title: "Diagnóstico Técnico — TPConsulting",
  description: "Obtén un diagnóstico técnico de automatización para tu empresa desde $1,000 MXN. 26 preguntas, resultados en 48 horas.",
  openGraph: {
    title: "Diagnóstico Técnico — TPConsulting",
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
          <span className={styles.eyebrow}>Diagnóstico técnico</span>
          <h1 className={styles.title}>Descubre exactamente qué automatizar en tu negocio</h1>
          <p className={styles.subtitle}>
            26 preguntas. 10 minutos de tu tiempo. Un reporte personalizado con las oportunidades de automatización de mayor impacto para tu empresa.
          </p>
          <div className={styles.guarantees}>
            <span className={styles.guarantee}>
              <span aria-hidden="true">⏱</span> Resultados en 48hrs
            </span>
            <span className={styles.guarantee}>
              <span aria-hidden="true">📋</span> Reporte PDF ejecutivo
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
                <li>Roadmap priorizado de automatizaciones</li>
                <li>Recomendación de herramientas según tu presupuesto</li>
                <li>Sesión de 30 minutos para revisar resultados</li>
              </ul>
            </div>
            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>Lo que nuestros clientes dicen</h3>
              <blockquote className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  "El diagnóstico nos mostró que estábamos perdiendo 22 horas semanales en tareas que se podían automatizar. En 6 semanas recuperamos ese tiempo y lo invertimos en ventas."
                </p>
                <footer className={styles.testimonialAuthor}>
                  — Carlos M., Director de Operaciones, empresa de logística en Guadalajara
                </footer>
              </blockquote>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
