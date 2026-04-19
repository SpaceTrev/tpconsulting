import Link from "next/link";
import ServiceCard from "@/components/ServiceCard/ServiceCard";
import SolutionCard from "@/components/SolutionCard/SolutionCard";
import PricingCard from "@/components/PricingCard/PricingCard";
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";
import styles from "./page.module.css";

// ─── Service Icons ────────────────────────────────────────────────────────────

const ICON_BOLT = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ICON_CHAT = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ICON_CHART = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const ICON_DOC = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ICON_CAL = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ICON_MAIL = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ICON_LINK = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ICON_CODE = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// ─── Solution Icons ───────────────────────────────────────────────────────────

const ICON_RESTAURANT = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
  </svg>
);

const ICON_CLINIC = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <line x1="12" y1="8" x2="12" y2="14" />
    <line x1="9" y1="11" x2="15" y2="11" />
  </svg>
);

const ICON_HOUSE = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ICON_KEY = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const ICON_BRIEFCASE = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const ICON_BAG = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ICON_SMILE = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const ICON_TRENDING = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// ─── Static Data ──────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: ICON_BOLT,
    title: "Captación de Leads con IA",
    description: "Sistema automatizado que atrae, califica y agenda citas con prospectos — sin intervención humana.",
    deliverable: "desde $8,500 MXN",
    tags: ["IA", "WhatsApp", "CRM"],
    href: "/servicios#leads",
  },
  {
    icon: ICON_CHAT,
    title: "Atención al Cliente por WhatsApp",
    description: "Chatbot con IA que responde preguntas frecuentes, toma pedidos y escala casos complejos al equipo.",
    deliverable: "desde $5,000 MXN",
    tags: ["WhatsApp", "IA", "24/7"],
    href: "/servicios#whatsapp",
  },
  {
    icon: ICON_CHART,
    title: "Dashboards de Operación",
    description: "Visibilidad en tiempo real de ventas, inventario, equipo y clientes — todo en un solo tablero.",
    deliverable: "desde $10,000 MXN",
    tags: ["Analytics", "Google", "Looker"],
    href: "/servicios#dashboards",
  },
  {
    icon: ICON_DOC,
    title: "Automatización de Facturación",
    description: "Facturas generadas automáticamente al momento del pago, integradas directamente con el SAT.",
    deliverable: "desde $5,000 MXN",
    tags: ["SAT", "CFDI", "FACTURAPI"],
    href: "/servicios#facturacion",
  },
  {
    icon: ICON_CAL,
    title: "Agendamiento Automatizado",
    description: "Los clientes agendan, confirman y reciben recordatorios — sin que tu equipo intervenga en el proceso.",
    deliverable: "desde $8,000 MXN",
    tags: ["Calendly", "Make", "WhatsApp"],
    href: "/servicios#agenda",
  },
  {
    icon: ICON_MAIL,
    title: "Marketing y Email Flows",
    description: "Secuencias de comunicación que nutren prospectos, recuperan clientes inactivos y aumentan la recompra.",
    deliverable: "desde $15,000 MXN",
    tags: ["Email", "SMS", "Flujos"],
    href: "/servicios#marketing",
  },
  {
    icon: ICON_LINK,
    title: "Integraciones entre Sistemas",
    description: "Conectamos tu CRM, tienda, WhatsApp y contabilidad para que la información fluya automáticamente.",
    deliverable: "desde $5,000 MXN",
    tags: ["API", "Make", "Zapier"],
    href: "/servicios#integraciones",
  },
  {
    icon: ICON_CODE,
    title: "Desarrollo a Medida",
    description: "Para procesos únicos que requieren soluciones únicas — arquitectura enterprise adaptada a tu escala.",
    deliverable: "Cotización",
    tags: ["Personalizado", "API", "Web"],
    href: "/servicios#medida",
  },
] as const;

const SOLUTIONS = [
  {
    icon: ICON_RESTAURANT,
    title: "Reservas y pedidos para restaurantes",
    description: "Sistema completo de reservas online, pedidos digitales y confirmación automática por WhatsApp.",
    outcomes: [
      "3× menos llamadas perdidas",
      "Confirmaciones automáticas 24/7",
      "Integración con punto de venta",
      "Desde $12,000 MXN",
    ],
    href: "/soluciones#restaurante",
  },
  {
    icon: ICON_CLINIC,
    title: "Gestión de citas para clínicas",
    description: "Agenda inteligente con recordatorios SMS/WhatsApp y ficha digital de cada paciente.",
    outcomes: [
      "80% menos inasistencias",
      "Historial digital centralizado",
      "Cobro en línea integrado",
      "Desde $15,000 MXN",
    ],
    href: "/soluciones#clinica",
  },
  {
    icon: ICON_HOUSE,
    title: "Pipeline de ventas para inmobiliarias",
    description: "CRM automatizado que califica prospectos, agenda visitas y hace seguimiento sin esfuerzo.",
    outcomes: [
      "Calificación automática de leads",
      "Seguimiento a 90 días sin esfuerzo",
      "Reportes semanales automáticos",
      "Desde $20,000 MXN",
    ],
    href: "/soluciones#inmobiliaria",
  },
  {
    icon: ICON_KEY,
    title: "Prospección Airbnb + VRBO para anfitriones",
    description: "Sistema de 5 etapas que responde, califica y convierte consultas en reservas confirmadas.",
    outcomes: [
      "3× tasa de conversión",
      "Respuesta en menos de 2 minutos",
      "Pipeline visual de prospectos",
      "Desde $18,000 MXN",
    ],
    href: "/soluciones#hospedaje",
  },
  {
    icon: ICON_BRIEFCASE,
    title: "Onboarding de clientes para consultoras",
    description: "Flujo automatizado de bienvenida, firma digital y asignación de proyecto al equipo.",
    outcomes: [
      "Onboarding completado en <24 horas",
      "Contratos y documentos digitales",
      "Integración con facturación",
      "Desde $10,000 MXN",
    ],
    href: "/soluciones#consultora",
  },
  {
    icon: ICON_BAG,
    title: "Inventario y pedidos para comercios",
    description: "Control de stock en tiempo real con alertas, reórdenes automáticos y reportes de movimiento.",
    outcomes: [
      "Cero quiebres de inventario",
      "Reórdenes automáticos a proveedores",
      "Integración con punto de venta",
      "Desde $12,000 MXN",
    ],
    href: "/soluciones#comercio",
  },
  {
    icon: ICON_SMILE,
    title: "Seguimiento post-consulta para dental",
    description: "Recordatorios automáticos, seguimiento de tratamiento y reactivación de pacientes inactivos.",
    outcomes: [
      "40% más pacientes reactivados",
      "Recordatorios WhatsApp 24h antes",
      "Encuesta automática de satisfacción",
      "Desde $8,500 MXN",
    ],
    href: "/soluciones#dental",
  },
  {
    icon: ICON_TRENDING,
    title: "Reportes de campañas para agencias",
    description: "Dashboard que consolida métricas de todos los canales del cliente de forma automática.",
    outcomes: [
      "Reportes semanales sin trabajo manual",
      "Comparativa vs período anterior",
      "Alertas de bajo rendimiento",
      "Desde $9,000 MXN",
    ],
    href: "/soluciones#agencia",
  },
] as const;

const PRICING_CARDS: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: { label: string; included: boolean }[];
  ctaLabel: string;
  ctaHref: string;
  highlighted: boolean;
  badge?: string;
}[] = [
  {
    name: "Escaneo Básico",
    price: "$1,000",
    period: "MXN",
    description: "Cuestionario estructurado + informe PDF de oportunidades en 48 horas.",
    features: [
      { label: "Cuestionario en línea (30 min)", included: true },
      { label: "Informe PDF de oportunidades", included: true },
      { label: "2 oportunidades identificadas", included: true },
      { label: "Entrega en 48 horas", included: true },
      { label: "Videollamada de revisión", included: false },
      { label: "Estimado de ROI", included: false },
    ],
    ctaLabel: "Solicitar escaneo",
    ctaHref: "/diagnostico?tier=basico",
    highlighted: false,
  },
  {
    name: "Diagnóstico Estándar",
    price: "$5,000",
    period: "MXN",
    badge: "Más popular",
    description: "Análisis completo con videollamada de 90 minutos y plan priorizado de acción.",
    features: [
      { label: "Videollamada de 90 minutos", included: true },
      { label: "5 oportunidades priorizadas", included: true },
      { label: "Estimado de ROI por proceso", included: true },
      { label: "Entrega en 5 días hábiles", included: true },
      { label: "Plan de implementación 30 días", included: true },
      { label: "Visita presencial", included: false },
    ],
    ctaLabel: "Agendar diagnóstico",
    ctaHref: "/diagnostico?tier=estandar",
    highlighted: true,
  },
  {
    name: "Análisis Profundo",
    price: "$10,000",
    period: "MXN",
    description: "Todo el Estándar más visita presencial en GDL y hoja de ruta a 90 días.",
    features: [
      { label: "Todo lo del Estándar", included: true },
      { label: "Visita presencial (Guadalajara)", included: true },
      { label: "Mapa de sistemas y flujos", included: true },
      { label: "Plan de implementación 90 días", included: true },
      { label: "Presupuesto detallado", included: true },
      { label: "Taller con equipo directivo", included: false },
    ],
    ctaLabel: "Solicitar análisis",
    ctaHref: "/diagnostico?tier=profundo",
    highlighted: false,
  },
  {
    name: "Consultoría Enterprise",
    price: "$15,000",
    period: "MXN",
    description: "Solución integral con taller directivo y 30 días de CTO-as-a-Service incluido.",
    features: [
      { label: "Todo lo del Análisis Profundo", included: true },
      { label: "Taller con equipo directivo", included: true },
      { label: "Presupuesto detallado", included: true },
      { label: "CTO-as-a-Service por 30 días", included: true },
      { label: "Implementación prioritaria", included: true },
      { label: "Acompañamiento continuo", included: true },
    ],
    ctaLabel: "Consultar disponibilidad",
    ctaHref: "/diagnostico?tier=enterprise",
    highlighted: false,
  },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <main>
        {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.heroEyebrow}>Automatización enterprise para PyMEs</p>
            <h1 className={styles.heroHeadline}>
              Lo que las grandes empresas usan para operar, ahora para tu negocio
            </h1>
            <p className={styles.heroSub}>
              Diseñamos e implementamos sistemas de automatización de nivel enterprise — adaptados a
              tu escala, tu industria, y tu presupuesto. Desde $8,500 MXN.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/diagnostico" className={styles.ctaPrimary}>
                Solicitar diagnóstico gratuito
              </Link>
              <Link href="/soluciones" className={styles.ctaSecondary}>
                Ver soluciones
              </Link>
            </div>
            <p className={styles.heroCred}>
              Experiencia Fortune 500 · Starbucks · +9 años en ingeniería enterprise
            </p>
          </div>
        </section>

        {/* ── Section 2: Stats Bar ─────────────────────────────────────────── */}
        <section className={styles.stats}>
          <div className={styles.statsInner}>
            <div className={styles.statItem}>
              <p className={styles.statValue}>152+</p>
              <p className={styles.statLabel}>Automatizaciones implementadas</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statValue}>9+</p>
              <p className={styles.statLabel}>Años en ingeniería enterprise</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statValue}>72%</p>
              <p className={styles.statLabel}>PyMEs operan sin sistemas</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statValue}>48 hrs</p>
              <p className={styles.statLabel}>Entrega del escaneo básico</p>
            </div>
          </div>
        </section>

        {/* ── Section 3: How It Works ──────────────────────────────────────── */}
        <section className={styles.howItWorks}>
          <div className={styles.inner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Proceso</p>
              <h2 className={styles.sectionTitle}>Cómo funciona</h2>
              <p className={styles.sectionSub}>
                De diagnóstico a sistema en producción en semanas, no meses.
              </p>
            </div>
            <div className={styles.stepsGrid}>
              <div className={styles.step}>
                <p className={styles.stepNum}>01</p>
                <h3 className={styles.stepTitle}>Diagnóstico</h3>
                <p className={styles.stepDesc}>
                  Analizamos tu operación, identificamos cuellos de botella y mapeamos las
                  oportunidades de automatización de mayor impacto para tu negocio.
                </p>
              </div>
              <div className={styles.step}>
                <p className={styles.stepNum}>02</p>
                <h3 className={styles.stepTitle}>Construcción</h3>
                <p className={styles.stepDesc}>
                  Diseñamos e implementamos el sistema en 2 a 4 semanas — sin código innecesario,
                  usando las mejores herramientas disponibles para tu escala.
                </p>
              </div>
              <div className={styles.step}>
                <p className={styles.stepNum}>03</p>
                <h3 className={styles.stepTitle}>Operación</h3>
                <p className={styles.stepDesc}>
                  Tu sistema corre 24/7 y mejora con el tiempo. Incluimos documentación,
                  capacitación y 30 días de soporte incluido tras el lanzamiento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Services Grid ─────────────────────────────────────── */}
        <section className={styles.services}>
          <div className={styles.inner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Servicios</p>
              <h2 className={styles.sectionTitle}>Qué construimos</h2>
              <p className={styles.sectionSub}>
                Desde automatizaciones puntuales hasta sistemas completos de operación
              </p>
            </div>
            <div className={styles.servicesGrid}>
              {SERVICES.map((service) => (
                <ServiceCard
                  key={service.href}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  deliverable={service.deliverable}
                  tags={[...service.tags]}
                  href={service.href}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5: Marketplace / Solutions ──────────────────────────── */}
        <section className={styles.marketplace}>
          <div className={styles.inner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Soluciones</p>
              <h2 className={styles.sectionTitle}>Por industria</h2>
              <p className={styles.sectionSub}>
                Sistemas pre-diseñados listos para implementar en tu sector
              </p>
            </div>
            <Link href="/soluciones" className={styles.sectionLink}>
              Ver todas las soluciones →
            </Link>
            <div className={styles.marketplaceGrid}>
              {SOLUTIONS.map((solution) => (
                <SolutionCard
                  key={solution.href}
                  icon={solution.icon}
                  title={solution.title}
                  description={solution.description}
                  outcomes={[...solution.outcomes]}
                  href={solution.href}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 6: Pricing ───────────────────────────────────────────── */}
        <section className={styles.pricing}>
          <div className={styles.inner}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Diagnóstico</p>
              <h2 className={styles.sectionTitle}>Elige tu punto de partida</h2>
              <p className={styles.sectionSub}>
                El diagnóstico es el primer paso. Cada nivel aplica como anticipo a la
                implementación.
              </p>
            </div>
            <div className={styles.pricingGrid}>
              {PRICING_CARDS.map((card) => (
                <PricingCard
                  key={card.ctaHref}
                  name={card.name}
                  price={card.price}
                  period={card.period}
                  description={card.description}
                  features={card.features}
                  ctaLabel={card.ctaLabel}
                  ctaHref={card.ctaHref}
                  highlighted={card.highlighted}
                  badge={card.badge}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 7: Case Study ────────────────────────────────────────── */}
        <section className={styles.caseStudy}>
          <div className={styles.caseStudyInner}>
            <p className={styles.sectionLabel}>Resultados reales</p>
            <h2 className={styles.sectionTitle}>
              Sistema de prospección Airbnb en Guadalajara
            </h2>
            <div className={styles.caseCard}>
              <span className={styles.caseBadge}>Plan Vuelo · desde $18,000 MXN</span>

              <div className={styles.caseProblem}>
                <p className={styles.caseSubLabel}>El reto</p>
                <p>
                  Anfitrión con 3 propiedades en Guadalajara perdía leads por respuesta tardía en
                  Airbnb y VRBO — sin sistema de seguimiento ni calificación de prospectos.
                </p>
              </div>

              <div className={styles.casePipeline}>
                <p className={styles.caseSubLabel}>El pipeline automatizado</p>
                <div className={styles.pipelineStages}>
                  <span className={styles.pipelineStage}>Consulta recibida</span>
                  <span className={styles.pipelineArrow}>→</span>
                  <span className={styles.pipelineStage}>Respuesta &lt;2 min</span>
                  <span className={styles.pipelineArrow}>→</span>
                  <span className={styles.pipelineStage}>Calificación IA</span>
                  <span className={styles.pipelineArrow}>→</span>
                  <span className={styles.pipelineStage}>Seguimiento humano</span>
                  <span className={styles.pipelineArrow}>→</span>
                  <span className={styles.pipelineStage}>Reserva confirmada</span>
                </div>
              </div>

              <div className={styles.caseResults}>
                <div className={styles.resultChip}>
                  <p className={styles.resultValue}>3×</p>
                  <p className={styles.resultLabel}>tasa de conversión</p>
                </div>
                <div className={styles.resultChip}>
                  <p className={styles.resultValue}>2 hrs</p>
                  <p className={styles.resultLabel}>liberadas por día</p>
                </div>
                <div className={styles.resultChip}>
                  <p className={styles.resultValue}>$45,000</p>
                  <p className={styles.resultLabel}>MXN en 90 días</p>
                </div>
              </div>

              <Link href="/casos" className={styles.caseLink}>
                Ver caso completo →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Section 8: CTA ───────────────────────────────────────────────── */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaHeadline}>¿Listo para empezar?</h2>
            <p className={styles.ctaBody}>
              Agenda una llamada de 30 minutos sin costo o solicita tu diagnóstico hoy.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                href="https://wa.me/5213312345678?text=Hola%2C%20vi%20su%20sitio%20y%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20la%20automatizaci%C3%B3n%20para%20mi%20negocio."
                className={styles.ctaPrimary}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hablar por WhatsApp
              </Link>
              <Link href="/diagnostico" className={styles.ctaSecondary}>
                Solicitar diagnóstico
              </Link>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppButton
        phoneNumber="5213312345678"
        message="Hola, vi su sitio y me interesa conocer más sobre la automatización para mi negocio."
      />
    </>
  );
}
