import type { Metadata } from "next";
import Link from "next/link";
import styles from "./casos.module.css";

export const metadata: Metadata = {
  title: "Casos de Éxito — TPConsulting",
  description:
    "Documentamos los resultados de cada proyecto. Sin métricas inventadas.",
  openGraph: {
    title: "Casos de Éxito — TPConsulting",
    description:
      "Documentamos los resultados de cada proyecto. Sin métricas inventadas.",
    locale: "es_MX",
    type: "website",
  },
};

const pipelineStages = [
  {
    num: "01",
    title: "Consulta recibida",
    sub: "Airbnb/VRBO notifica",
  },
  {
    num: "02",
    title: "Respuesta automática",
    sub: "WhatsApp en menos de 2 min",
  },
  {
    num: "03",
    title: "Calificación IA",
    sub: "Fechas, tipo, presupuesto",
  },
  {
    num: "04",
    title: "Seguimiento humano",
    sub: "Propietario retoma",
  },
  {
    num: "05",
    title: "Reserva confirmada",
    sub: "Pago procesado",
  },
];

const stackChips = [
  "Make (Integromat)",
  "WhatsApp Business API",
  "Airtable",
  "OpenAI GPT-4",
  "Twilio",
];

const results = [
  { num: "3×", label: "tasa de conversión" },
  { num: "2 hrs", label: "liberadas por día" },
  { num: "$45,000", label: "MXN adicionales en 90 días" },
  { num: "98%", label: "tasa de respuesta" },
];

export default function CasosPage() {
  return (
    <main>
      <section className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>Resultados reales</p>
          <h1 className={styles.pageTitle}>Casos de Éxito</h1>
          <p className={styles.pageSubtitle}>
            Documentamos los resultados de cada proyecto. Sin métricas
            inventadas.
          </p>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.featuredInner}>
          <article className={styles.featuredCard}>
            <span className={styles.caseBadge}>Plan Vuelo · $18,000 MXN</span>

            <div className={styles.caseContext}>
              <p className={styles.caseLabel}>El contexto</p>
              <h2 className={styles.caseTitle}>
                Sistema de prospección Airbnb + VRBO
              </h2>
              <p className={styles.caseContextDesc}>
                Anfitrión independiente con 3 propiedades en Guadalajara.
                Recibía consultas de Airbnb y VRBO durante todo el día, pero la
                respuesta tardaba horas — perdiendo reservas ante anfitriones
                que respondían más rápido. No tenía sistema para rastrear qué
                pasó con cada prospecto.
              </p>
            </div>

            <div className={styles.caseProblem}>
              <p className={styles.caseLabel}>El reto</p>
              <p className={styles.caseProblemDesc}>
                Tiempo de respuesta promedio de 4 horas. 40% de consultas sin
                respuesta formal. Sin pipeline de seguimiento. Sin métricas de
                conversión.
              </p>
            </div>

            <div className={styles.caseSolution}>
              <p className={styles.caseLabel}>La solución — pipeline de 5 etapas</p>
              <div className={styles.pipeline}>
                {pipelineStages.map((stage, index) => (
                  <div key={stage.num} className={styles.pipelineRow}>
                    <div className={styles.pipelineStage}>
                      <p className={styles.stageNum}>{stage.num}</p>
                      <p className={styles.stageTitle}>{stage.title}</p>
                      <p className={styles.stageSub}>{stage.sub}</p>
                    </div>
                    {index < pipelineStages.length - 1 && (
                      <span className={styles.pipelineArrow} aria-hidden="true">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.caseStack}>
              <p className={styles.caseLabel}>Stack tecnológico</p>
              <div className={styles.stackChips}>
                {stackChips.map((chip) => (
                  <span key={chip} className={styles.stackChip}>
                    {chip}
                  </span>
                ))}
              </div>
              <p className={styles.timeline}>
                3 semanas de construcción · En producción 6+ meses
              </p>
            </div>

            <div className={styles.caseResults}>
              <p className={styles.caseLabel}>Resultados a 90 días</p>
              <div className={styles.resultsGrid}>
                {results.map((result) => (
                  <div key={result.label} className={styles.resultItem}>
                    <p className={styles.resultNum}>{result.num}</p>
                    <p className={styles.resultLabel}>{result.label}</p>
                  </div>
                ))}
              </div>
              <p className={styles.testimonialNote}>
                El anfitrión prefirió permanecer anónimo. Los datos fueron
                verificados con acceso a su cuenta de Airbnb.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.placeholderSection}>
        <div className={styles.placeholderInner}>
          <h2 className={styles.placeholderTitle}>Próximamente</h2>
          <div className={styles.placeholderGrid}>
            <article className={styles.placeholderCard}>
              <p className={styles.placeholderBadge}>En construcción</p>
              <p className={styles.placeholderDesc}>
                Clínica dental en Zapopan — Sistema de recordatorios y
                reactivación de pacientes
              </p>
            </article>
            <article className={styles.placeholderCard}>
              <p className={styles.placeholderBadge}>En construcción</p>
              <p className={styles.placeholderDesc}>
                Inmobiliaria en Puerto Vallarta — Pipeline de ventas con
                calificación automática
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <Link href="/diagnostico" className={styles.ctaBtn}>
            Solicitar mi diagnóstico
          </Link>
        </div>
      </section>
    </main>
  );
}
