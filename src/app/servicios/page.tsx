import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Servicios — TPConsulting",
  description: "Catálogo completo de servicios de automatización e integración para PyMEs mexicanas. Diagnóstico desde $1,000 MXN.",
  openGraph: {
    title: "Servicios — TPConsulting",
    description: "Catálogo completo de servicios de automatización e integración para PyMEs mexicanas.",
    locale: "es_MX",
    type: "website",
  },
};

function IconScan() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="8" height="8" x="8" y="8" rx="1"/></svg>;
}
function IconGear() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;
}
function IconLink() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
}
function IconBot() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 15v.01M16 15v.01"/></svg>;
}
function IconCode() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
}
function IconBriefcase() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}
function IconSupport() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}

const services = [
  {
    id: "diagnostico-express",
    number: "01",
    icon: <IconScan />,
    name: "Diagnóstico Express",
    price: "desde $1,000 MXN",
    desc: "Escaneo completo de tus procesos en 48 horas. Detectamos exactamente dónde estás perdiendo tiempo y dinero con un reporte ejecutivo accionable.",
    deliverable: "Reporte PDF + Mapa de Oportunidades",
    features: [
      "Análisis de hasta 10 procesos operativos clave",
      "Identificación de los 3 puntos de mayor impacto",
      "Estimación de horas y costos recuperables",
      "Recomendación de herramientas según tu presupuesto",
      "Sesión de revisión de 30 minutos incluida",
    ],
  },
  {
    id: "diagnostico-profundo",
    number: "02",
    icon: <IconScan />,
    name: "Diagnóstico Profundo",
    price: "desde $5,000 MXN",
    desc: "Análisis exhaustivo de toda la operación con entrevistas a tu equipo, benchmarks de industria y una hoja de ruta tecnológica a 12 meses.",
    deliverable: "Reporte Ejecutivo + Roadmap 12 meses",
    features: [
      "Diagnóstico completo de todos los departamentos",
      "Entrevistas con hasta 5 personas clave de tu equipo",
      "Hoja de ruta priorizada de automatizaciones",
      "Benchmarks contra empresas similares de tu industria",
      "2 sesiones de revisión y Q&A incluidas",
      "Plan de implementación con estimados de costo y ROI",
    ],
  },
  {
    id: "automatizacion",
    number: "03",
    icon: <IconGear />,
    name: "Automatización de Procesos",
    price: "A cotizar",
    desc: "Implementación de flujos automatizados conectados a tus herramientas actuales. Usamos Make.com, n8n, Zapier y desarrollo custom según lo que más conviene.",
    deliverable: "Sistema automatizado en producción",
    features: [
      "Diseño y documentación del flujo automatizado",
      "Implementación y pruebas en ambiente controlado",
      "Integración con tus herramientas existentes",
      "Capacitación de tu equipo (hasta 3 sesiones)",
      "Soporte técnico 30 días post-entrega",
      "Manual de operación y contingencia",
    ],
  },
  {
    id: "integracion",
    number: "04",
    icon: <IconLink />,
    name: "Integración de Sistemas",
    price: "A cotizar",
    desc: "Conecta tu CRM, ERP, contabilidad, logística y canales de venta en un ecosistema unificado. Sin duplicados, sin captura manual.",
    deliverable: "APIs funcionando + Documentación técnica",
    features: [
      "Análisis de sistemas y APIs disponibles",
      "Desarrollo de conectores y middlewares",
      "Sincronización bidireccional de datos",
      "Manejo de errores y alertas automáticas",
      "Pruebas de carga y estabilidad",
      "Documentación técnica completa",
    ],
  },
  {
    id: "agentes-ia",
    number: "05",
    icon: <IconBot />,
    name: "Agentes de IA",
    price: "A cotizar",
    desc: "Asistentes inteligentes entrenados con el conocimiento de tu empresa. Atienden clientes, califican leads, generan cotizaciones y escalan casos complejos.",
    deliverable: "Agente IA desplegado y operando",
    features: [
      "Diseño de la personalidad y alcance del agente",
      "Entrenamiento con datos y documentos de tu empresa",
      "Integración con WhatsApp, web, email o Slack",
      "Flujos de escalación a agentes humanos",
      "Panel de monitoreo de conversaciones",
      "Optimización continua por 60 días",
    ],
  },
  {
    id: "desarrollo",
    number: "06",
    icon: <IconCode />,
    name: "Desarrollo a Medida",
    price: "A cotizar",
    desc: "Software personalizado para procesos únicos de tu empresa que no encuentras en el mercado. Desde portales internos hasta sistemas de gestión complejos.",
    deliverable: "Aplicación completa + código fuente",
    features: [
      "Levantamiento de requerimientos y prototipo",
      "Desarrollo con tecnologías modernas (Next.js, Python, etc.)",
      "Base de datos diseñada para tu operación",
      "Panel de administración incluido",
      "Pruebas de calidad (QA) y seguridad",
      "Despliegue en la nube + soporte 90 días",
    ],
  },
  {
    id: "consultoria",
    number: "07",
    icon: <IconBriefcase />,
    name: "Consultoría Estratégica",
    price: "A cotizar",
    desc: "Sesiones de estrategia con nuestros especialistas para resolver dudas, validar decisiones tecnológicas o planificar tu próxima fase de crecimiento.",
    deliverable: "Plan de acción documentado",
    features: [
      "Análisis de tu situación tecnológica actual",
      "Recomendaciones específicas y accionables",
      "Evaluación de proveedores y herramientas",
      "Revisión de propuestas de terceros",
      "Preparación para auditorías o inversión",
      "Grabación de sesiones incluida",
    ],
  },
  {
    id: "soporte",
    number: "08",
    icon: <IconSupport />,
    name: "Soporte y Mantenimiento",
    price: "A cotizar",
    desc: "Mantenimiento preventivo y reactivo de todas tus automatizaciones. Monitoreo continuo, actualizaciones y respuesta garantizada en menos de 24 horas.",
    deliverable: "SLA garantizado 24hrs",
    features: [
      "Monitoreo proactivo de todos tus flujos",
      "Corrección de errores en menos de 24 horas",
      "Actualizaciones por cambios en APIs externas",
      "Reporte mensual de métricas de rendimiento",
      "1 mejora o ajuste mensual incluido",
      "Acceso directo a ingenieros via WhatsApp",
    ],
  },
];

export default function ServiciosPage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Catálogo de servicios</span>
          <h1 className={styles.title}>Todo lo que necesitas para automatizar tu negocio</h1>
          <p className={styles.subtitle}>
            Desde un diagnóstico rápido hasta el desarrollo completo de software a medida. Cada servicio entrega un resultado tangible y medible.
          </p>
        </div>
      </div>

      <div className={styles.catalog}>
        {services.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={styles.serviceSection}
            style={{ backgroundColor: i % 2 === 0 ? "var(--bg-canvas)" : "var(--bg-raised)" }}
          >
            <div className={styles.container}>
              <div className={styles.serviceSectionInner}>
                <div className={styles.serviceMeta}>
                  <span className={styles.serviceId}>{s.number} / 08</span>
                  <div className={styles.serviceIconWrap}>{s.icon}</div>
                  <h2 className={styles.serviceName}>{s.name}</h2>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                  <span className={styles.servicePrice}>{s.price}</span>
                  <div className={styles.serviceCtaRow}>
                    <Link href={`/diagnostico`} className={styles.ctaPrimary}>
                      Solicitar este servicio
                    </Link>
                    <Link href="/contacto" className={styles.ctaSecondary}>
                      Hacer una pregunta →
                    </Link>
                  </div>
                </div>
                <div className={styles.serviceDetails}>
                  <p className={styles.serviceDetailsTitle}>¿Qué incluye?</p>
                  <ul className={styles.featureList}>
                    {s.features.map((f) => (
                      <li key={f} className={styles.featureItem}>{f}</li>
                    ))}
                  </ul>
                  <span className={styles.deliverableTag}>
                    📦 Entregable: {s.deliverable}
                  </span>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className={styles.ctaBanner}>
        <div className={styles.container}>
          <h2 className={styles.ctaBannerTitle}>¿No sabes por dónde empezar?</h2>
          <p className={styles.ctaBannerText}>
            El Diagnóstico Express por $1,000 MXN te da un mapa claro de qué automatizar primero.
          </p>
          <Link href="/diagnostico?tier=explorador" className={styles.ctaPrimary}>
            Comenzar con Diagnóstico Express
          </Link>
        </div>
      </div>
    </main>
  );
}
