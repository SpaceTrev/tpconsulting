import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Nosotros — TPConsulting",
  description: "Conoce al equipo detrás de TPConsulting: 9+ años de experiencia en automatización Fortune 500, ahora al servicio de PyMEs mexicanas.",
  openGraph: {
    title: "Nosotros — TPConsulting",
    description: "Equipo con experiencia Fortune 500 y Starbucks, dedicado a transformar PyMEs mexicanas con automatización.",
    locale: "es_MX",
  },
};

export default function NosotrosPage() {
  return (
    <main className={styles.main}>

      {/* ── Header ── */}
      <section className={styles.header}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Quiénes somos</span>
          <h1 className={styles.title}>
            Veteranos de Fortune 500 con una misión clara
          </h1>
          <p className={styles.subtitle}>
            Pasamos años implementando sistemas de automatización para algunas de las empresas más grandes del mundo. Luego nos preguntamos: ¿por qué las PyMEs mexicanas no pueden tener acceso a lo mismo? TPConsulting nació para responder esa pregunta.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <span className={styles.missionIcon} aria-hidden="true">🎯</span>
              <h2 className={styles.missionTitle}>Nuestra misión</h2>
              <p className={styles.missionText}>
                Hacer accesible la automatización de nivel enterprise para PyMEs mexicanas, a una fracción del costo y con resultados medibles desde la primera semana.
              </p>
            </div>
            <div className={styles.missionCard}>
              <span className={styles.missionIcon} aria-hidden="true">🔭</span>
              <h2 className={styles.missionTitle}>Nuestra visión</h2>
              <p className={styles.missionText}>
                Un México donde el 80% de las PyMEs opera con procesos automatizados, no con horas extras. Donde el dueño de un negocio puede enfocarse en crecer, no en apagar incendios.
              </p>
            </div>
            <div className={styles.missionCard}>
              <span className={styles.missionIcon} aria-hidden="true">💡</span>
              <h2 className={styles.missionTitle}>Nuestro enfoque</h2>
              <p className={styles.missionText}>
                No vendemos software ni suscripciones. Entregamos resultados: procesos que funcionan, tiempo recuperado y dinero que antes se perdía en ineficiencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.teamGrid}>

            <div className={styles.bioCard}>
              <div className={styles.bioHeader}>
                <div className={styles.bioAvatar} aria-hidden="true">TP</div>
                <div>
                  <p className={styles.bioName}>Trevor Patterson</p>
                  <p className={styles.bioRole}>Co-fundador · Director Técnico</p>
                </div>
              </div>
              <p className={styles.bioText}>
                Trevor lleva más de 9 años diseñando e implementando sistemas de automatización para empresas Fortune 500. Como líder técnico en proyectos de transformación digital para cadenas como Starbucks y CBRE, aprendió de primera mano los estándares de calidad, seguridad y escalabilidad que definen la operación de las empresas más grandes del mundo.
              </p>
              <p className={styles.bioText}>
                Hoy aplica ese mismo rigor enterprise para construir sistemas de automatización que PyMEs mexicanas pueden activar, entender y mantener. Su filosofía: si un proceso tiene que explicarse en una reunión cada semana, está mal diseñado.
              </p>
              <div className={styles.bioCredentials}>
                <span className={styles.credential}>9+ años en automatización enterprise</span>
                <span className={styles.credential}>Proyectos en Starbucks, CBRE y Fortune 500</span>
                <span className={styles.credential}>Especialidad: arquitectura de sistemas, IA aplicada, integración de plataformas</span>
                <span className={styles.credential}>152+ automatizaciones implementadas</span>
              </div>
            </div>

            <div className={styles.bioCard}>
              <div className={styles.bioHeader}>
                <div className={styles.bioAvatar} aria-hidden="true">PM</div>
                <div>
                  <p className={styles.bioName}>Pablo Morales</p>
                  <p className={styles.bioRole}>Co-fundador · Director de Estrategia</p>
                </div>
              </div>
              <p className={styles.bioText}>
                Pablo aporta una perspectiva única: entiende los negocios mexicanos desde adentro. Con experiencia en gestión operativa y escalamiento de empresas en el mercado latinoamericano, Pablo es quien traduce los procesos del cliente en arquitecturas de automatización que realmente se implementan y se usan.
              </p>
              <p className={styles.bioText}>
                Es el puente entre la visión técnica y la realidad operativa del negocio. Su rol es garantizar que cada automatización que entregamos genere valor desde el primer día, no que se convierta en otro sistema que nadie usa.
              </p>
              <div className={styles.bioCredentials}>
                <span className={styles.credential}>Experiencia en gestión operativa de PyMEs</span>
                <span className={styles.credential}>Especialidad: estrategia de transformación, gestión del cambio</span>
                <span className={styles.credential}>Foco en implementación efectiva y adopción del equipo</span>
                <span className={styles.credential}>Relaciones con proveedores y socios en LATAM</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Cómo trabajamos</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>Resultados primero</h3>
              <p className={styles.valueText}>
                Cada proyecto define métricas de éxito antes de empezar. Si no hay un número que mejorar, no hay proyecto.
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>Sin curva de aprendizaje</h3>
              <p className={styles.valueText}>
                Entregamos sistemas que tu equipo puede operar desde el día uno. La documentación y capacitación son parte del entregable, no un extra.
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>Tecnología que ya tienes</h3>
              <p className={styles.valueText}>
                No obligamos a cambiar de plataforma. Construimos sobre lo que ya usas y te recomendamos cambios solo cuando el beneficio es claro.
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>Transparencia total</h3>
              <p className={styles.valueText}>
                Precios fijos, alcance definido, entregables claros. Sin contratos confusos ni costos ocultos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>¿Quieres trabajar con nosotros?</h2>
          <p className={styles.ctaText}>
            Agenda una llamada exploratoria o comienza directamente con un diagnóstico.
          </p>
          <Link href="/contacto" className={styles.ctaLink}>
            Hablar con el equipo
          </Link>
        </div>
      </section>

    </main>
  );
}
