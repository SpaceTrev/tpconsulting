import type { Metadata } from "next";
import styles from "./page.module.css";
import DiagnosticForm from "@/components/DiagnosticForm/DiagnosticForm";

export const metadata: Metadata = {
  title: "Agenda una llamada — FAC",
  description: "Reserva una llamada exploratoria gratuita de 30 minutos. Platicamos sobre tu operación y te decimos qué se puede automatizar.",
  openGraph: {
    title: "Agenda una llamada — FAC",
    description: "30 minutos, sin costo. Platicamos sobre tu operación y te decimos qué se puede automatizar.",
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
          <h1 className={styles.title}>Hablemos sobre tu negocio</h1>
          <p className={styles.subtitle}>
            30 minutos, sin costo. En esta sesión exploratoria revisamos tu operación actual, identificamos los procesos con mayor potencial de automatización y te presentamos un diagnóstico inicial honesto sobre cómo podemos generar impacto en tu negocio.
          </p>
          <div className={styles.guarantees}>
            <span className={styles.guarantee}>
              <span aria-hidden="true">⏱</span> 30 min, sin costo
            </span>
            <span className={styles.guarantee}>
              <span aria-hidden="true">🎯</span> Diagnóstico honesto
            </span>
            <span className={styles.guarantee}>
              <span aria-hidden="true">🔒</span> Sin presión de venta
            </span>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.container}>
          {/* Primary: Diagnostic wizard. After Stage 4 submit, DiagnosticForm
              renders its own success screen with a Cal embed so the user can
              book the 15-min discovery call right then. */}
          <div className={styles.calColumn}>
            <DiagnosticForm initialTier={tier} />
          </div>

          {/* Secondary: Sidebar info */}
          <aside className={styles.aside}>
            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>¿En qué consiste la llamada?</h3>
              <ul className={styles.asideList}>
                <li>Te escuchamos: ¿qué procesos te quitan más tiempo?</li>
                <li>Identificamos 2–3 oportunidades concretas de automatización</li>
                <li>Te decimos qué herramientas y costos implicaría</li>
                <li>Si hay fit, te proponemos un diagnóstico formal</li>
              </ul>
            </div>
            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>¿A quién va dirigido?</h3>
              <ul className={styles.asideList}>
                <li>Pequeñas y Medianas empresas</li>
                <li>Emprendedores y dueños de negocios que operan con procesos manuales</li>
                <li>Freelancers que pierden tiempo en tareas repetitivas</li>
                <li>Negocios que buscan escalar su operación sin incrementar su personal</li>
                <li>Creadores de contenido y community managers que necesitan optimizar procesos manuales para dedicar más tiempo a la estrategia y la creatividad</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
