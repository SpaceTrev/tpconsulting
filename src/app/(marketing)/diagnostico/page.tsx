import type { Metadata } from "next";
import styles from "./page.module.css";
import DiagnosticForm from "@/components/DiagnosticForm/DiagnosticForm";
import CalEmbed from "@/components/CalEmbed/CalEmbed";
import CollapsibleForm from "./CollapsibleForm";

export const metadata: Metadata = {
  title: "Agenda una llamada — FAC",
  description: "Reserva una llamada exploratoria gratuita de 15 minutos. Platicamos sobre tu operación y te decimos qué se puede automatizar.",
  openGraph: {
    title: "Agenda una llamada — FAC",
    description: "15 minutos, sin costo. Platicamos sobre tu operación y te decimos qué se puede automatizar.",
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
          <span className={styles.eyebrow}>Paso 1 — Agenda tu llamada</span>
          <h1 className={styles.title}>Hablemos sobre tu negocio</h1>
          <p className={styles.subtitle}>
            15 minutos, sin costo. Platicamos sobre tu operación, identificamos qué se puede automatizar, y te decimos con honestidad si podemos ayudarte.
          </p>
          <div className={styles.guarantees}>
            <span className={styles.guarantee}>
              <span aria-hidden="true">⏱</span> 15 min, sin costo
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
          {/* Primary: Calendar */}
          <div className={styles.formWrapper}>
            <CalEmbed
              mode="full"
              title="Elige el horario que más te convenga"
              subtitle="Confirmaremos tu cita por WhatsApp o correo."
            />
          </div>

          {/* Secondary: Sidebar info */}
          <aside className={styles.aside}>
            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>¿Qué pasa en la llamada?</h3>
              <ul className={styles.asideList}>
                <li>Te escuchamos: ¿qué procesos te quitan más tiempo?</li>
                <li>Identificamos 2–3 oportunidades concretas de automatización</li>
                <li>Te decimos qué herramientas y costos implicaría</li>
                <li>Si hay fit, te proponemos un diagnóstico formal</li>
                <li>Si no, te lo decimos directo — sin rodeos</li>
              </ul>
            </div>
            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>¿Para quién es esto?</h3>
              <ul className={styles.asideList}>
                <li>PyMEs con 3–200 empleados en México</li>
                <li>Dueños o directores que operan con procesos manuales</li>
                <li>Negocios que pierden tiempo en tareas repetitivas</li>
                <li>Empresas que quieren crecer sin contratar más personal</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Optional: Pre-call diagnostic form */}
      <div className={styles.optionalSection}>
        <div className={styles.container}>
          <CollapsibleForm initialTier={tier} />
        </div>
      </div>
    </main>
  );
}
