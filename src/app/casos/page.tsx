import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Casos de Éxito — TPConsulting",
  description: "Empresa de renta vacacional pasó de caos manual a automatización total. −85% trabajo administrativo, $12K MXN ahorro mensual.",
  openGraph: {
    title: "Casos de Éxito — TPConsulting",
    description: "Cómo automatizamos la gestión de 45 propiedades para una empresa de renta vacacional.",
    locale: "es_MX",
  },
};

export default function CasosPage() {
  return (
    <main className={styles.main}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Caso de éxito</span>
          <h1 className={styles.heroTitle}>
            45 propiedades, 3 empleados, operación completamente automatizada
          </h1>
          <p className={styles.heroSubtitle}>
            Una empresa de gestión de renta vacacional en CDMX pasó de administrar su operación en hojas de cálculo y mensajes dispersos, a un sistema completamente automatizado en 6 semanas. Así lo hicimos.
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.heroBadge}>🏠 Sector: Renta Vacacional / PropTech</span>
            <span className={styles.heroBadge}>📍 Ciudad de México</span>
            <span className={styles.heroBadge}>👥 3 empleados, 45 propiedades</span>
            <span className={styles.heroBadge}>⏱ 6 semanas de implementación</span>
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section className={styles.resultsBanner} aria-label="Resultados obtenidos">
        <div className={styles.container}>
          <div className={styles.resultsGrid}>
            <div className={styles.resultCard}>
              <span className={styles.resultNumber}>−85%</span>
              <span className={styles.resultLabel}>Reducción en trabajo administrativo manual por semana</span>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultNumber}>$12K</span>
              <span className={styles.resultLabel}>MXN de ahorro mensual en personal operativo</span>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultNumber}>0</span>
              <span className={styles.resultLabel}>Dobles reservas o errores de coordinación desde la implementación</span>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultNumber}>4.9★</span>
              <span className={styles.resultLabel}>Calificación promedio mantenida en Airbnb y Booking.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Context ── */}
      <section className={styles.contextSection}>
        <div className={styles.container}>
          <div className={styles.contextGrid}>
            <div>
              <h2 className={styles.contextTitle}>El problema: 45 propiedades manejadas con caos</h2>
              <p className={styles.contextText}>
                Cuando llegamos a este cliente, una empresa familiar que gestiona 45 departamentos y casas en CDMX para renta vacacional corta duración, encontramos una operación al límite.
              </p>
              <p className={styles.contextText}>
                Con solo 3 empleados atendiendo mensajes de 4 plataformas distintas, coordinando limpieza por WhatsApp y registrando ingresos en hojas de cálculo, el negocio dependía completamente del esfuerzo humano manual para funcionar.
              </p>
            </div>
            <div>
              <h2 className={styles.contextTitle}>Los cuellos de botella que identificamos</h2>
              <ul className={styles.problemList}>
                <li className={styles.problemItem}>
                  Check-in y check-out 100% manual: envío de instrucciones, códigos y llaves por WhatsApp individual a cada huésped
                </li>
                <li className={styles.problemItem}>
                  Mensajes de huéspedes llegando simultáneamente desde Airbnb, Booking.com, WhatsApp y correo sin centralizar
                </li>
                <li className={styles.problemItem}>
                  Coordinación del equipo de limpieza por WhatsApp con confirmaciones manuales y sin visibilidad de estado
                </li>
                <li className={styles.problemItem}>
                  Registro contable en hojas de cálculo con actualizaciones manuales y sin conciliación automática
                </li>
                <li className={styles.problemItem}>
                  Sin sistema de solicitud de reseñas: 4.9★ mantenido solo por la amabilidad del equipo, no por proceso
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pipeline ── */}
      <section className={styles.pipelineSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>El pipeline de implementación en 5 etapas</h2>
          <div className={styles.pipeline}>

            <div className={styles.pipelineStep}>
              <span className={styles.pipelineStepNum}>01</span>
              <div>
                <p className={styles.pipelineStepDuration}>Días 1–2</p>
                <h3 className={styles.pipelineStepTitle}>Diagnóstico y mapeo de procesos</h3>
                <p className={styles.pipelineStepText}>
                  Mapeamos los 12 procesos críticos de la operación: desde la primera consulta hasta el cierre contable. Identificamos 8 oportunidades de automatización con potencial de impacto alto. Priorizamos las 5 que resolvían el 80% del trabajo manual.
                </p>
                <div className={styles.pipelineTechTags}>
                  <span className={styles.techTag}>Miro (mapeo)</span>
                  <span className={styles.techTag}>Entrevistas equipo</span>
                  <span className={styles.techTag}>Análisis de volumen</span>
                </div>
              </div>
            </div>

            <div className={styles.pipelineStep}>
              <span className={styles.pipelineStepNum}>02</span>
              <div>
                <p className={styles.pipelineStepDuration}>Semana 1</p>
                <h3 className={styles.pipelineStepTitle}>Diseño del flujo centralizado</h3>
                <p className={styles.pipelineStepText}>
                  Diseñamos la arquitectura completa del sistema: Airbnb API → Notion como base de datos central → WhatsApp Business API → Calendario de limpieza. Cada plataforma conectada, cada mensaje con su destino definido, cada tarea con su responsable automático.
                </p>
                <div className={styles.pipelineTechTags}>
                  <span className={styles.techTag}>Notion</span>
                  <span className={styles.techTag}>WhatsApp Business API</span>
                  <span className={styles.techTag}>Make.com (diseño)</span>
                </div>
              </div>
            </div>

            <div className={styles.pipelineStep}>
              <span className={styles.pipelineStepNum}>03</span>
              <div>
                <p className={styles.pipelineStepDuration}>Semanas 2–4</p>
                <h3 className={styles.pipelineStepTitle}>Desarrollo de las 5 automatizaciones</h3>
                <p className={styles.pipelineStepText}>
                  Construimos e implementamos: (1) Welcome flow automatizado con instrucciones personalizadas por propiedad, (2) Inbox centralizado con clasificación automática de mensajes, (3) Sistema de asignación de limpieza con confirmaciones y fotos, (4) Registro contable automático desde las reservas, (5) Solicitud de reseñas post-checkout.
                </p>
                <div className={styles.pipelineTechTags}>
                  <span className={styles.techTag}>Make.com</span>
                  <span className={styles.techTag}>Airbnb API</span>
                  <span className={styles.techTag}>Booking.com API</span>
                  <span className={styles.techTag}>Google Sheets</span>
                </div>
              </div>
            </div>

            <div className={styles.pipelineStep}>
              <span className={styles.pipelineStepNum}>04</span>
              <div>
                <p className={styles.pipelineStepDuration}>Semana 5</p>
                <h3 className={styles.pipelineStepTitle}>Integración de todas las plataformas</h3>
                <p className={styles.pipelineStepText}>
                  Conectamos Airbnb, Booking.com, el sistema de contabilidad del cliente (CONTPAQi) y el equipo de limpieza en un solo flujo cohesionado. Pruebas con datos reales, corrección de casos borde y manejo de errores para los 45 escenarios de propiedad.
                </p>
                <div className={styles.pipelineTechTags}>
                  <span className={styles.techTag}>CONTPAQi</span>
                  <span className={styles.techTag}>Integración multi-canal</span>
                  <span className={styles.techTag}>Pruebas de carga</span>
                </div>
              </div>
            </div>

            <div className={styles.pipelineStep}>
              <span className={styles.pipelineStepNum}>05</span>
              <div>
                <p className={styles.pipelineStepDuration}>Días finales</p>
                <h3 className={styles.pipelineStepTitle}>Despliegue, capacitación y monitoreo</h3>
                <p className={styles.pipelineStepText}>
                  Go-live escalonado por lotes de propiedades para validar en producción sin riesgo. Capacitación al equipo completo (2 sesiones), manual de contingencia para fallos, y monitoreo activo la primera semana. El cliente operó de forma autónoma desde el día 8.
                </p>
                <div className={styles.pipelineTechTags}>
                  <span className={styles.techTag}>Go-live escalonado</span>
                  <span className={styles.techTag}>Capacitación equipo</span>
                  <span className={styles.techTag}>Monitoreo 7 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>¿Tu operación se parece a esta historia?</h2>
          <p className={styles.ctaText}>
            Comienza con un diagnóstico de $1,000 MXN y en 48 horas te decimos exactamente cuánto tiempo y dinero puedes recuperar.
          </p>
          <Link href="/diagnostico" className={styles.ctaLink}>
            Quiero un diagnóstico de mi operación
          </Link>
        </div>
      </section>

    </main>
  );
}
