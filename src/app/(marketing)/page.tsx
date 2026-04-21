import Link from "next/link";
import styles from "./page.module.css";
import ServiceCard from "@/components/ServiceCard/ServiceCard";
import SolutionCard from "@/components/SolutionCard/SolutionCard";
import PricingCard from "@/components/PricingCard/PricingCard";

/* ── Icons ────────────────────────────────────────────────── */
function IconRocket() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  );
}
function IconGear() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}
function IconLink() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}
function IconBot() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="10" x="3" y="11" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4M8 15v.01M16 15v.01"/>
    </svg>
  );
}
function IconCode() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="14" x="2" y="7" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}
function IconScan() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
      <rect width="8" height="8" x="8" y="8" rx="1"/>
    </svg>
  );
}
function IconSupport() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

/* ── Solution icons ───────────────────────────────────────── */
function IconInventory() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function IconCrm() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IconQuote() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
function IconNomina() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  );
}
function IconChatbot() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <path d="M8 10h.01M12 10h.01M16 10h.01"/>
    </svg>
  );
}
function IconSync() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="4" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────────── */
const services = [
  {
    icon: <IconScan />,
    title: "Diagnóstico Express",
    description: "Escaneo completo de tus procesos operativos en 48 horas.",
    price: "desde $1,000 MXN",
    tags: ["Diagnóstico", "48hrs"],
    href: "/servicios#diagnostico-express",
    deliverable: "Mapa de Oportunidades",
  },
  {
    icon: <IconScan />,
    title: "Diagnóstico Profundo",
    description: "Análisis detallado con hoja de ruta tecnológica a 12 meses.",
    price: "desde $5,000 MXN",
    tags: ["Diagnóstico", "Roadmap"],
    href: "/servicios#diagnostico-profundo",
    deliverable: "Reporte + Roadmap",
  },
  {
    icon: <IconGear />,
    title: "Automatización de Procesos",
    description: "Flujos automatizados conectados a tus herramientas actuales.",
    price: "desde $15,000 MXN",
    tags: ["Automatización", "Make", "n8n"],
    href: "/servicios#automatizacion",
    deliverable: "Sistema en Producción",
  },
  {
    icon: <IconLink />,
    title: "Integración de Sistemas",
    description: "Conecta tu CRM, ERP, contabilidad y canales de venta.",
    price: "desde $20,000 MXN",
    tags: ["API", "Integración"],
    href: "/servicios#integracion",
    deliverable: "APIs + Documentación",
  },
  {
    icon: <IconBot />,
    title: "Agentes de IA",
    description: "Asistentes inteligentes entrenados con el conocimiento de tu empresa.",
    price: "desde $30,000 MXN",
    tags: ["IA", "LLM", "ChatGPT"],
    href: "/servicios#agentes-ia",
    deliverable: "Agente Desplegado",
  },
  {
    icon: <IconCode />,
    title: "Desarrollo a Medida",
    description: "Software personalizado para procesos que no encuentras en el mercado.",
    price: "desde $50,000 MXN",
    tags: ["Software", "Full-stack"],
    href: "/servicios#desarrollo",
    deliverable: "Aplicación Completa",
  },
  {
    icon: <IconBriefcase />,
    title: "Consultoría Estratégica",
    description: "Sesiones de estrategia con nuestros especialistas.",
    price: "$3,000 MXN/hr",
    tags: ["Consultoría", "Estrategia"],
    href: "/servicios#consultoria",
    deliverable: "Plan de Acción",
  },
  {
    icon: <IconSupport />,
    title: "Soporte Técnico",
    description: "Mantenimiento preventivo y reactivo de tus automatizaciones.",
    price: "desde $5,000 MXN/mes",
    tags: ["Soporte", "SLA 24hrs"],
    href: "/servicios#soporte",
    deliverable: "SLA 24hrs",
  },
];

const solutions = [
  {
    icon: <IconInventory />,
    title: "Gestión Inteligente de Inventario",
    description: "Sincroniza stock en tiempo real entre tiendas físicas y plataformas digitales.",
    outcomes: ["-40% roturas de stock", "Ahorro 8hrs/semana en conteos"],
    href: "/soluciones#inventario",
  },
  {
    icon: <IconCrm />,
    title: "CRM Automatizado",
    description: "Captura leads, nutre prospectos y cierra ventas sin intervención manual.",
    outcomes: ["+60% tasa de seguimiento", "-2hrs/día en captura de datos"],
    href: "/soluciones#crm",
  },
  {
    icon: <IconQuote />,
    title: "Pipeline de Cotizaciones",
    description: "Genera cotizaciones profesionales desde WhatsApp en minutos.",
    outcomes: ["Cotización lista en <5 min", "+35% tasa de cierre"],
    href: "/soluciones#cotizaciones",
  },
  {
    icon: <IconNomina />,
    title: "Automatización de Nómina",
    description: "Calcula, timbra y paga nómina de forma automática con validaciones IMSS.",
    outcomes: ["0 errores de cálculo", "-6hrs por quincena"],
    href: "/soluciones#nomina",
  },
  {
    icon: <IconChatbot />,
    title: "Chatbot de Atención",
    description: "Responde preguntas frecuentes, toma pedidos y agenda citas 24/7.",
    outcomes: ["80% consultas resueltas sin agente", "+15% ventas nocturnas"],
    href: "/soluciones#chatbot",
  },
  {
    icon: <IconSync />,
    title: "Sincronización Multi-canal",
    description: "Unifica pedidos de Mercado Libre, Shopify y tienda propia en un panel.",
    outcomes: ["0 ventas duplicadas", "-3hrs/día en gestión de pedidos"],
    href: "/soluciones#multicanal",
  },
  {
    icon: <IconChart />,
    title: "Reportes Automáticos de Negocio",
    description: "Recibe tu dashboard semanal por email con métricas clave de tu operación.",
    outcomes: ["Decisiones en <10 min", "Visibilidad 360° del negocio"],
    href: "/soluciones#reportes",
  },
  {
    icon: <IconCalendar />,
    title: "Gestión de Agenda Médica",
    description: "Agenda, confirma y reagenda citas con recordatorios automáticos por WhatsApp.",
    outcomes: ["-70% citas perdidas", "+45% tasa de confirmación"],
    href: "/soluciones#agenda",
  },
];

const pricingTiers = [
  {
    name: "Escaneo Rápido",
    price: "$1,000",
    period: "MXN · análisis únicamente",
    description: "Evaluación rápida de tus necesidades. Ideal si no sabes por dónde empezar.",
    features: [
      { label: "Evaluación de procesos clave (48hrs)", included: true },
      { label: "Identificación de top 3 oportunidades", included: true },
      { label: "Reporte PDF ejecutivo", included: true },
      { label: "Sesión de revisión de 30 minutos", included: true },
      { label: "Recomendaciones de arquitectura", included: false },
      { label: "Cotización de implementación", included: false },
    ],
    ctaLabel: "Comenzar con Escaneo Rápido",
    ctaHref: "/diagnostico?tier=escaneo",
  },
  {
    name: "Diagnóstico Técnico",
    price: "$5,000",
    period: "MXN · análisis únicamente",
    description: "Análisis profundo con recomendaciones de arquitectura y hoja de ruta a 12 meses.",
    features: [
      { label: "Diagnóstico completo (5 días)", included: true },
      { label: "Entrevistas con tu equipo", included: true },
      { label: "Recomendaciones de arquitectura técnica", included: true },
      { label: "Hoja de ruta priorizada 12 meses", included: true },
      { label: "2 sesiones de revisión y Q&A", included: true },
      { label: "Cotización de implementación", included: false },
    ],
    ctaLabel: "Comenzar con Diagnóstico Técnico",
    ctaHref: "/diagnostico?tier=diagnostico",
  },
  {
    name: "Plan Completo",
    price: "$10,000",
    period: "MXN · análisis únicamente",
    description: "Plan técnico detallado que incluye cotización de implementación — sabes exactamente qué cuesta construirlo.",
    features: [
      { label: "Todo lo del Diagnóstico Técnico", included: true },
      { label: "Plan técnico de implementación", included: true },
      { label: "Cotización detallada por automatización", included: true },
      { label: "Estimados de ROI y tiempo de retorno", included: true },
      { label: "Especificaciones técnicas para tu equipo", included: true },
      { label: "3 sesiones de revisión incluidas", included: true },
    ],
    ctaLabel: "Comenzar con Plan Completo",
    ctaHref: "/diagnostico?tier=plan",
    highlighted: true,
    badge: "Más popular",
  },
  {
    name: "Análisis Ejecutivo",
    price: "$15,000",
    period: "MXN · análisis únicamente",
    description: "Análisis a nivel directivo con proyecciones financieras, revisión legal y roadmap de expansión.",
    features: [
      { label: "Todo lo del Plan Completo", included: true },
      { label: "Proyecciones financieras y ROI", included: true },
      { label: "Revisión de cumplimiento legal/fiscal", included: true },
      { label: "Roadmap de expansión y escalabilidad", included: true },
      { label: "Presentación ejecutiva lista para directivos", included: true },
      { label: "Soporte 30 días post-entrega del análisis", included: true },
    ],
    ctaLabel: "Comenzar con Análisis Ejecutivo",
    ctaHref: "/diagnostico?tier=ejecutivo",
  },
];

/* ── Page ─────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>Automatización Enterprise para PyMEs</span>
            <h1 className={styles.heroTitle}>
              Lo que las grandes empresas usan para operar,{" "}
              <em>ahora para tu negocio</em>
            </h1>
            <p className={styles.heroSubtitle}>
              Implementamos los mismos sistemas de automatización que usan Starbucks, Discover y empresas Fortune 500 — adaptados para tu negocio, a fracción del costo.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/diagnostico" className={styles.ctaPrimary}>
                Diagnóstico desde $1,000 MXN
              </Link>
              <Link href="/soluciones" className={styles.ctaSecondary}>
                Ver soluciones <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.statsBar} aria-label="Estadísticas clave">
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>72%</span>
              <span className={styles.statLabel}>De las PyMEs operan con procesos 100% manuales</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100×</span>
              <span className={styles.statLabel}>Más rápido responde un negocio que automatiza su primer contacto</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>40–60%</span>
              <span className={styles.statLabel}>Reducción en citas perdidas con recordatorios automáticos por WhatsApp</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>3–5×</span>
              <span className={styles.statLabel}>Crecimiento compuesto en 12 meses combinando outbound + inbound digital</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>El proceso</span>
            <h2 className={styles.sectionTitle}>Cómo funciona</h2>
            <p className={styles.sectionSubtitle}>
              Tres etapas claras para llevar tu operación del caos manual a la automatización inteligente.
            </p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>01</span>
              <span className={styles.stepIcon} aria-hidden="true">🔍</span>
              <h3 className={styles.stepTitle}>Diagnóstico</h3>
              <p className={styles.stepDesc}>
                En 48 horas escaneamos todos tus procesos operativos y detectamos exactamente dónde estás perdiendo tiempo y dinero.
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>02</span>
              <span className={styles.stepIcon} aria-hidden="true">🏗</span>
              <h3 className={styles.stepTitle}>Diseño</h3>
              <p className={styles.stepDesc}>
                Construimos el flujo de automatización ideal para tu negocio, conectado a las herramientas que ya usas sin reemplazarlas.
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>03</span>
              <span className={styles.stepIcon} aria-hidden="true">🚀</span>
              <h3 className={styles.stepTitle}>Despliegue</h3>
              <p className={styles.stepDesc}>
                Implementamos, probamos en ambiente controlado y entregamos con capacitación incluida para que tu equipo opere de forma autónoma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Servicios</span>
            <h2 className={styles.sectionTitle}>Todo lo que necesitas para automatizar</h2>
            <p className={styles.sectionSubtitle}>
              Desde un diagnóstico exprés hasta el desarrollo completo de software a medida.
            </p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Marketplace preview ── */}
      <section className={styles.marketplaceSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Soluciones listas</span>
            <h2 className={styles.sectionTitle}>Automatizaciones preconfiguradas para tu industria</h2>
            <p className={styles.sectionSubtitle}>
              Soluciones probadas que puedes activar en días, no meses. Sin curva de aprendizaje para tu equipo.
            </p>
          </div>
          <div className={styles.solutionsGrid}>
            {solutions.map((s) => (
              <SolutionCard key={s.title} {...s} />
            ))}
          </div>
          <div style={{ marginTop: "var(--space-8)", textAlign: "center" }}>
            <Link href="/soluciones" className={styles.ctaSecondary}>
              Ver todas las soluciones <IconArrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className={styles.manifestoSection}>
        <div className={styles.container}>
          <div className={styles.manifestoInner}>
            <blockquote className={styles.manifestoQuote}>
              <p className={styles.manifestoText}>
                "No venimos a venderte automatización por vender automatización. Venimos a encontrar dónde se te está yendo el tiempo y el dinero, atacar eso primero, medir el resultado, y solo entonces construir lo siguiente. Así sabemos que cada peso que inviertes tiene un retorno claro — no solo funciones bonitas que nadie usa."
              </p>
              <span className={styles.manifestoAttribution}>— La filosofía detrás de cada proyecto</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className={styles.pricingSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Precios claros</span>
            <h2 className={styles.sectionTitle}>Elige tu diagnóstico</h2>
            <p className={styles.sectionSubtitle}>
              Sin sorpresas, sin contratos ocultos. Precios fijos que se adaptan a donde estás hoy.
            </p>
          </div>
          <div className={styles.pricingGrid}>
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} {...tier} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Enterprise strip ── */}
      <div className={styles.enterpriseStrip}>
        <div className={styles.container}>
          <div className={styles.enterpriseInner}>
            <p className={styles.enterpriseText}>
              ¿Empresa grande o corporativo? También trabajamos con organizaciones de mayor escala — soluciones enterprise a la medida.
            </p>
            <Link href="/contacto" className={styles.enterpriseLink}>
              Contactar para enterprise →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Automation potential ── */}
      <section className={styles.caseStudySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>¿Por qué automatizar?</span>
            <h2 className={styles.sectionTitle}>El potencial de la automatización</h2>
            <p className={styles.sectionSubtitle}>
              Datos reales sobre lo que la automatización hace en negocios como el tuyo.
            </p>
          </div>
          <div className={styles.caseStudyResults}>
            <div className={styles.resultCard}>
              <span className={styles.resultNumber}>72%</span>
              <span className={styles.resultLabel}>De las PyMEs en México siguen operando de forma 100% manual</span>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultNumber}>100×</span>
              <span className={styles.resultLabel}>Más rápido responde un negocio que automatiza su primer contacto vs. uno manual — Harvard Business Review</span>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultNumber}>40–60%</span>
              <span className={styles.resultLabel}>Reducción en citas perdidas con un sistema de recordatorios por WhatsApp</span>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultNumber}>3–5×</span>
              <span className={styles.resultLabel}>Crecimiento compuesto en 12 meses para empresas que combinan outbound + inbound digital</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaSectionInner}>
            <h2 className={styles.ctaSectionTitle}>
              ¿Listo para automatizar tu negocio?
            </h2>
            <p className={styles.ctaSectionText}>
              Comienza con un diagnóstico desde $1,000 MXN y descubre exactamente qué automatizar para generar el mayor impacto en tu operación.
            </p>
            <div className={styles.ctaSectionBtns}>
              <Link href="/diagnostico" className={styles.ctaPrimary}>
                Comenzar diagnóstico
              </Link>
              <Link href="/contacto" className={styles.ctaSecondary}>
                Hablar con un especialista
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
