import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Nosotros — FAC",
  description: "El equipo detrás de FAC opera al nivel más alto de ingeniería de software enterprise — y ahora lo hace accesible para cualquier negocio.",
  openGraph: {
    title: "Nosotros — FAC",
    description: "8+ años de consultoría Fortune 500 (Starbucks, Discover) aplicados a empresas de todos tamaños.",
    locale: "es_MX",
    type: "website",
  },
};

const trevorTags = [
  "8+ años Fortune 500",
  "Starbucks · Discover",
  "Arquitectura de plataformas",
  "Agentes IA · MCP · Multi-modelo",
  "Bilingüe inglés/español",
];

const pabloTags = [
  "Estrategia de negocio",
  "Mercado mexicano",
  "Operaciones",
  "PyMEs",
];

const valueCards = [
  {
    title: "Velocidad",
    desc: "Sin burocracia interna. Tomamos decisiones rápido y entregamos en semanas, no en meses.",
  },
  {
    title: "Enfoque",
    desc: "Trabajamos con un número limitado de clientes a la vez para garantizar atención total a cada proyecto.",
  },
  {
    title: "Transparencia",
    desc: "Sin letra chica. Precios claros, alcances definidos y comunicación directa en todo momento.",
  },
];

export default function NosotrosPage() {
  return (
    <main className={styles.main}>

      {/* ── Header ── */}
      <section className={styles.header}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Quiénes somos</span>
          <h1 className={styles.title}>
            Ingeniería de nivel Fortune 500, ahora accesible para tu negocio
          </h1>
          <p className={styles.subtitle}>
            Pasamos años construyendo sistemas para algunas de las empresas más grandes del mundo. Luego nos preguntamos: ¿por qué los negocios más pequeños no pueden tener acceso a lo mismo? Flywheel Automation Consulting nació para responder esa pregunta.
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
                Hacer accesible la automatización de nivel enterprise para empresas de todos tamaños, a una fracción del costo y con resultados medibles desde la primera semana.
              </p>
            </div>
            <div className={styles.missionCard}>
              <span className={styles.missionIcon} aria-hidden="true">🔭</span>
              <h2 className={styles.missionTitle}>Nuestra visión</h2>
              <p className={styles.missionText}>
                Un mundo donde el 80% de las empresas opera con procesos automatizados, no con horas extras. Donde el dueño de un negocio puede enfocarse en crecer, no en apagar incendios.
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
                  <p className={styles.bioName}>Trevor Benavides</p>
                  <p className={styles.bioRole}>Co-fundador · Arquitecto de Software & Automatización</p>
                </div>
              </div>
              <p className={styles.bioText}>
                Trevor diseña e implementa sistemas de automatización y arquitectura de software para algunas de las empresas más grandes del mundo. Con más de 8 años como consultor enterprise para compañías Fortune 500 — incluyendo Starbucks y Discover — opera en el nivel más alto de ingeniería de software: plataformas que sirven millones de usuarios, pipelines de CI/CD que automatizan entregas completas, y sistemas de IA que orquestan múltiples modelos de forma autónoma.
              </p>
              <p className={styles.bioText}>
                Ahora aplica esa misma mentalidad enterprise a negocios de todos tamaños. Lo que las grandes empresas pagan millones en construir, Trevor lo adapta a tu escala — con la misma calidad técnica, pero a un precio accesible.
              </p>
              <div className={styles.bioCredentials}>
                <span className={styles.credential}>8+ años de consultoría Fortune 500</span>
                <span className={styles.credential}>Clientes: Starbucks, Discover y más</span>
                <span className={styles.credential}>Arquitectura de plataformas · Agentes IA · Orquestación multi-modelo · MCP · CI/CD · Full-stack</span>
                <span className={styles.credential}>Bilingüe inglés/español</span>
              </div>
            </div>

            <div className={styles.bioCard}>
              <div className={styles.bioHeader}>
                <div className={styles.bioAvatar} aria-hidden="true">PE</div>
                <div>
                  <p className={styles.bioName}>Pablo Estrada</p>
                  <p className={styles.bioRole}>Co-fundador · Estrategia & Operaciones de Negocio</p>
                </div>
              </div>
              <p className={styles.bioText}>
                Pablo conoce el mercado mexicano desde adentro. Su experiencia en estrategia de negocio y operaciones es lo que garantiza que cada proyecto que entregamos genere valor real desde el primer día — no soluciones técnicas que nadie en tu equipo termina usando.
              </p>
              <p className={styles.bioText}>
                Es el puente entre la visión técnica y la realidad de operar un negocio. Próximamente compartiremos más sobre su trayectoria.
              </p>
              <div className={styles.bioCredentials}>
                <span className={styles.credential}>Estrategia de negocio · Mercado mexicano</span>
                <span className={styles.credential}>Operaciones y escalamiento de PyMEs</span>
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
