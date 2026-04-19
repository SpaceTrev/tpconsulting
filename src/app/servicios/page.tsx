import type { Metadata } from "next";
import Link from "next/link";
import styles from "./servicios.module.css";

export const metadata: Metadata = {
  title: "Servicios — TPConsulting",
  description:
    "Automatización de procesos, integración de sistemas y consultoría tecnológica para PyMEs mexicanas.",
  openGraph: {
    title: "Servicios — TPConsulting",
    description:
      "Automatización de procesos, integración de sistemas y consultoría tecnológica para PyMEs mexicanas.",
    locale: "es_MX",
    type: "website",
  },
};

const categories = [
  {
    id: "comunicacion",
    label: "Comunicación y Ventas",
    bg: "raised",
    services: [
      {
        id: "leads",
        name: "Captación de Leads con IA",
        desc: "Diseñamos un sistema completo que atrae prospectos calificados, los califica automáticamente con IA y agenda reuniones — sin que tu equipo tenga que hacer seguimiento manual.",
        deliverable:
          "Incluye: integración CRM + WhatsApp + formulario de calificación + dashboard",
        price: "desde $8,500 MXN",
        tags: ["IA", "WhatsApp", "CRM", "Make"],
        icon: "lightning",
      },
      {
        id: "whatsapp",
        name: "Atención al Cliente por WhatsApp",
        desc: "Chatbot con IA entrenado con la información de tu negocio. Responde preguntas, toma pedidos, agenda citas y escala casos complejos a tu equipo humano automáticamente.",
        deliverable:
          "Incluye: WhatsApp Business API + IA + flujos de escalación + métricas",
        price: "desde $5,000 MXN",
        tags: ["WhatsApp", "IA", "24/7", "Chatbot"],
        icon: "chat",
      },
      {
        id: "agenda",
        name: "Agendamiento Automatizado",
        desc: "Los clientes agendan en tu calendario disponible desde WhatsApp o tu sitio web. Reciben confirmación, recordatorios automáticos y reagendamiento sin intervención humana.",
        deliverable:
          "Incluye: integración Calendly/Cal.com + WhatsApp + recordatorios automáticos",
        price: "desde $8,000 MXN",
        tags: ["Calendly", "Make", "WhatsApp", "Recordatorios"],
        icon: "calendar",
      },
    ],
  },
  {
    id: "operaciones",
    label: "Operaciones Internas",
    bg: "canvas",
    services: [
      {
        id: "dashboards",
        name: "Dashboards de Operación",
        desc: "Centraliza todos tus datos — ventas, inventario, métricas de equipo y satisfacción de clientes — en un tablero visual que se actualiza en tiempo real sin trabajo manual.",
        deliverable:
          "Incluye: dashboard personalizado + integración de fuentes + acceso para el equipo",
        price: "desde $10,000 MXN",
        tags: ["Analytics", "Google Looker", "Sheets", "API"],
        icon: "chart",
      },
      {
        id: "facturacion",
        name: "Automatización de Facturación",
        desc: "Las facturas se generan solas al momento del pago. Integrado con el SAT mediante FACTURAPI o Bind ERP. Elimina errores manuales y el tiempo perdido en facturación.",
        deliverable:
          "Incluye: integración SAT + timbre automático + envío al cliente + reportes",
        price: "desde $5,000 MXN",
        tags: ["SAT", "CFDI", "FACTURAPI", "Bind ERP"],
        icon: "document",
      },
      {
        id: "integraciones",
        name: "Integraciones entre Sistemas",
        desc: "Conectamos tu CRM, tienda en línea, WhatsApp, punto de venta y contabilidad para que la información fluya automáticamente — sin copiar datos a mano entre sistemas.",
        deliverable:
          "Incluye: mapeo de flujos + desarrollo de conexiones + documentación técnica",
        price: "desde $5,000 MXN",
        tags: ["API", "Make", "Zapier", "n8n"],
        icon: "link",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing y Crecimiento",
    bg: "raised",
    services: [
      {
        id: "marketing",
        name: "Marketing y Email Flows",
        desc: "Secuencias de comunicación automatizada que nutren prospectos fríos, recuperan clientes que no han comprado en meses y aumentan la frecuencia de compra de los actuales.",
        deliverable:
          "Incluye: flujos de email + SMS + segmentación + pruebas A/B + reportes",
        price: "desde $15,000 MXN",
        tags: ["Email", "SMS", "Klaviyo", "ActiveCampaign"],
        icon: "envelope",
      },
      {
        id: "medida",
        name: "Desarrollo a Medida",
        desc: "Para procesos únicos que requieren soluciones únicas. Aplicaciones web, APIs internas, herramientas de equipo o sistemas que no existen en el mercado — construidos con arquitectura enterprise.",
        deliverable: "Cotización personalizada según alcance y complejidad",
        price: "Cotización",
        tags: ["Personalizado", "API", "Next.js", "Node.js"],
        icon: "code",
      },
    ],
  },
];

function LightningIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ServiceIcon({ type }: { type: string }) {
  switch (type) {
    case "lightning": return <LightningIcon />;
    case "chat": return <ChatIcon />;
    case "calendar": return <CalendarIcon />;
    case "chart": return <ChartIcon />;
    case "document": return <DocumentIcon />;
    case "link": return <LinkIcon />;
    case "envelope": return <EnvelopeIcon />;
    case "code": return <CodeIcon />;
    default: return null;
  }
}

export default function ServiciosPage() {
  return (
    <main>
      <section className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>Qué hacemos</p>
          <h1 className={styles.pageTitle}>Nuestros Servicios</h1>
          <p className={styles.pageSubtitle}>
            Desde una automatización puntual hasta un sistema completo de
            operación. Todo se construye sobre tu stack actual.
          </p>
        </div>
      </section>

      {categories.map((cat) => (
        <section
          key={cat.id}
          className={cat.bg === "raised" ? styles.categoryRaised : styles.categoryCanvas}
        >
          <div className={styles.categoryInner}>
            <div className={styles.categoryHeader}>
              <p className={styles.categoryLabel}>{cat.label}</p>
            </div>
            <div className={styles.servicesGrid}>
              {cat.services.map((service) => (
                <article
                  key={service.id}
                  id={service.id}
                  className={cat.bg === "raised" ? styles.serviceCardInset : styles.serviceCardRaised}
                >
                  <div className={styles.serviceIcon}>
                    <ServiceIcon type={service.icon} />
                  </div>
                  <h3 className={styles.serviceName}>{service.name}</h3>
                  <p className={styles.serviceDesc}>{service.desc}</p>
                  <p className={styles.serviceDeliverable}>{service.deliverable}</p>
                  <ul className={styles.serviceTags} aria-label="Tecnologías">
                    {service.tags.map((tag) => (
                      <li key={tag} className={styles.serviceTag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <p className={styles.servicePrice}>{service.price}</p>
                  <Link href="/diagnostico" className={styles.serviceBtn}>
                    Solicitar servicio
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>¿No sabes qué servicio necesitas?</h2>
          <p className={styles.ctaDesc}>
            Empieza con un diagnóstico de $1,000 MXN y te decimos exactamente
            qué automatizar primero.
          </p>
          <Link href="/diagnostico" className={styles.ctaBtn}>
            Solicitar diagnóstico →
          </Link>
        </div>
      </section>
    </main>
  );
}
