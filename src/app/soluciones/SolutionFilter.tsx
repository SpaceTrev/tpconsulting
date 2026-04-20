"use client";

import { useState } from "react";
import SolutionCard from "@/components/SolutionCard/SolutionCard";
import styles from "./page.module.css";

interface Solution {
  icon: React.ReactNode;
  title: string;
  description: string;
  outcomes: string[];
  href: string;
  industries: string[];
}

const FILTERS = ["Todas", "Manufactura", "Retail", "Logística", "Servicios", "Restaurantes", "Salud", "Educación"];

function IconInventory() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function IconCrm() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function IconQuote() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function IconNomina() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>; }
function IconChatbot() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>; }
function IconSync() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>; }
function IconChart() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function IconCalendar() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function IconTruck() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="16" height="13" x="1" y="3" rx="2"/><path d="M17 8h3l3 3v5h-3"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>; }
function IconEmail() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>; }
function IconFactory() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 20V11l5-5 5 5V7l5-5 5 5v13"/><path d="M2 20h20"/></svg>; }
function IconStar() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function IconWhatsApp() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>; }
function IconReceipt() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="13" y2="15"/></svg>; }
function IconInstagram() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>; }
function IconUsers() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function IconDollar() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function IconMegaphone() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>; }
function IconClipboard() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1"/></svg>; }

const solutions: Solution[] = [
  {
    icon: <IconInventory />,
    title: "Gestión Inteligente de Inventario",
    description: "Sincroniza stock en tiempo real entre tiendas físicas, almacén y plataformas digitales. Alertas automáticas de reposición.",
    outcomes: ["-40% roturas de stock", "Ahorro 8hrs/semana en conteos manuales", "Conciliación automática con proveedores"],
    href: "/diagnostico",
    industries: ["Manufactura", "Retail", "Logística"],
  },
  {
    icon: <IconCrm />,
    title: "CRM Automatizado",
    description: "Captura leads, nutre prospectos con secuencias automatizadas y cierra ventas sin intervención manual.",
    outcomes: ["+60% tasa de seguimiento", "-2hrs/día en captura de datos", "Ciclo de venta 35% más corto"],
    href: "/diagnostico",
    industries: ["Servicios", "Retail", "Manufactura"],
  },
  {
    icon: <IconQuote />,
    title: "Pipeline de Cotizaciones",
    description: "Genera cotizaciones profesionales desde WhatsApp en minutos. Seguimiento automático, firma digital y pago en línea.",
    outcomes: ["Cotización lista en <5 min", "+35% tasa de cierre", "100% de cotizaciones con seguimiento"],
    href: "/diagnostico",
    industries: ["Manufactura", "Servicios", "Construcción"],
  },
  {
    icon: <IconNomina />,
    title: "Automatización de Nómina",
    description: "Calcula, timbra y paga nómina de forma automática con validaciones IMSS e integración con bancos.",
    outcomes: ["0 errores de cálculo", "-6hrs por quincena", "Timbrado CFDI automático"],
    href: "/diagnostico",
    industries: ["Manufactura", "Retail", "Servicios", "Salud"],
  },
  {
    icon: <IconChatbot />,
    title: "Chatbot de Atención al Cliente",
    description: "Responde preguntas frecuentes, toma pedidos, verifica pedidos y agenda citas 24/7 vía WhatsApp o tu web.",
    outcomes: ["80% consultas resueltas sin agente", "+15% ventas en horario nocturno", "Tiempo de respuesta: <1 minuto"],
    href: "/diagnostico",
    industries: ["Retail", "Servicios", "Restaurantes", "Salud"],
  },
  {
    icon: <IconSync />,
    title: "Sincronización Multi-canal",
    description: "Unifica pedidos de Mercado Libre, Shopify y tienda propia en un solo panel de control.",
    outcomes: ["0 ventas duplicadas", "-3hrs/día en gestión de pedidos", "Stock actualizado en <5 min"],
    href: "/diagnostico",
    industries: ["Retail", "Logística"],
  },
  {
    icon: <IconChart />,
    title: "Reportes Automáticos de Negocio",
    description: "Recibe tu dashboard semanal por email con métricas clave de ventas, operación y finanzas de tu negocio.",
    outcomes: ["Decisiones en <10 min", "Visibilidad 360° del negocio", "Sin abrir Excel nunca más"],
    href: "/diagnostico",
    industries: ["Manufactura", "Retail", "Servicios", "Logística", "Salud"],
  },
  {
    icon: <IconCalendar />,
    title: "Gestión de Agenda Médica",
    description: "Agenda, confirma y reagenda citas con recordatorios automáticos por WhatsApp. Historial del paciente integrado.",
    outcomes: ["-70% citas perdidas", "+45% tasa de confirmación", "Listas de espera automáticas"],
    href: "/diagnostico",
    industries: ["Salud"],
  },
  {
    icon: <IconTruck />,
    title: "Trazabilidad de Pedidos",
    description: "Seguimiento en tiempo real de cada pedido desde el almacén hasta la puerta del cliente. Notificaciones automáticas.",
    outcomes: ["-80% llamadas de 'dónde está mi pedido'", "+30% satisfacción del cliente", "Alertas proactivas de retrasos"],
    href: "/diagnostico",
    industries: ["Logística", "Retail"],
  },
  {
    icon: <IconEmail />,
    title: "Marketing por Email Automatizado",
    description: "Secuencias de email personalizadas según el comportamiento de cada cliente. Recuperación de carritos abandonados.",
    outcomes: ["+25% conversión en secuencias", "Recuperación 15% de carritos", "Segmentación automática por comportamiento"],
    href: "/diagnostico",
    industries: ["Retail", "Educación"],
  },
  {
    icon: <IconFactory />,
    title: "Control de Producción",
    description: "Órdenes de trabajo automáticas, control de tiempos y materiales, alertas de desviaciones en tiempo real.",
    outcomes: ["-20% tiempo de ciclo", "100% trazabilidad de lotes", "OEE en tiempo real sin papel"],
    href: "/diagnostico",
    industries: ["Manufactura"],
  },
  {
    icon: <IconStar />,
    title: "Gestión de Reseñas y Reputación",
    description: "Solicita reseñas automáticamente post-compra. Monitorea y responde a todas las plataformas desde un panel.",
    outcomes: ["+2x más reseñas mensuales", "Tiempo de respuesta <2hrs", "Alertas de reseñas negativas inmediatas"],
    href: "/diagnostico",
    industries: ["Restaurantes", "Servicios", "Retail", "Salud"],
  },
  {
    icon: <IconWhatsApp />,
    title: "Recordatorios de Citas por WhatsApp",
    description: "Confirma, recuerda y reagenda citas automáticamente por WhatsApp. Reduce inasistencias sin intervención manual.",
    outcomes: ["-60% inasistencias", "Confirmación automática 24h antes", "Reagendamiento con un solo mensaje"],
    href: "/diagnostico",
    industries: ["Salud", "Servicios", "Educación"],
  },
  {
    icon: <IconReceipt />,
    title: "Facturación CFDI Automática",
    description: "Genera y timbra facturas CFDI al momento de la venta o pago. Integrado con tu punto de venta y sistema contable.",
    outcomes: ["Factura en <30 segundos", "Cero errores de captura", "Integración SAT, CONTPAQi, Aspel"],
    href: "/diagnostico",
    industries: ["Manufactura", "Retail", "Servicios", "Restaurantes"],
  },
  {
    icon: <IconInstagram />,
    title: "Programación de Redes Sociales",
    description: "Planifica, programa y publica contenido en Instagram, Facebook y Google My Business desde un solo lugar.",
    outcomes: ["Publicación automática diaria", "-5hrs/semana en gestión de contenido", "Calendario de contenido unificado"],
    href: "/diagnostico",
    industries: ["Retail", "Restaurantes", "Servicios"],
  },
  {
    icon: <IconUsers />,
    title: "Horarios y Turnos de Personal",
    description: "Genera horarios automáticos según disponibilidad, carga de trabajo y reglas de la empresa. Notifica a tu equipo por WhatsApp.",
    outcomes: ["-3hrs/semana en planificación", "Cambios de turno sin coordinación manual", "Registro de asistencia integrado"],
    href: "/diagnostico",
    industries: ["Manufactura", "Restaurantes", "Salud", "Retail"],
  },
  {
    icon: <IconDollar />,
    title: "Cobranza Automatizada",
    description: "Envía recordatorios de pago, genera links de cobro y registra pagos recibidos sin perseguir clientes manualmente.",
    outcomes: ["-40% cuentas vencidas", "Recordatorios automáticos D-3, D0, D+7", "Conciliación automática con banco"],
    href: "/diagnostico",
    industries: ["Servicios", "Manufactura", "Salud", "Educación"],
  },
  {
    icon: <IconMegaphone />,
    title: "Generación de Leads desde Anuncios",
    description: "Captura automáticamente leads de Facebook e Instagram Ads y los ingresa a tu CRM con seguimiento inmediato por WhatsApp.",
    outcomes: ["Contacto en <5 minutos", "0 leads perdidos por falta de respuesta", "+40% conversión vs. seguimiento manual"],
    href: "/diagnostico",
    industries: ["Retail", "Servicios", "Educación"],
  },
  {
    icon: <IconClipboard />,
    title: "Onboarding de Nuevos Empleados",
    description: "Flujo automatizado de bienvenida, firma de documentos, acceso a sistemas y checklist de capacitación para cada nuevo integrante.",
    outcomes: ["Onboarding completo en <24hrs", "Documentos firmados digitalmente", "Checklist automático por rol"],
    href: "/diagnostico",
    industries: ["Manufactura", "Servicios", "Salud", "Educación"],
  },
];

export default function SolutionFilter() {
  const [active, setActive] = useState("Todas");

  const filtered =
    active === "Todas"
      ? solutions
      : solutions.filter((s) => s.industries.includes(active));

  return (
    <>
      <div className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.filterTabs} role="tablist" aria-label="Filtrar por industria">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={active === f}
                className={`${styles.filterTab} ${active === f ? styles.filterTabActive : ""}`}
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.container}>
          <div className={styles.solutionsGrid} role="tabpanel">
            {filtered.length === 0 ? (
              <p className={styles.emptyState}>No hay soluciones para este filtro.</p>
            ) : (
              filtered.map((s) => <SolutionCard key={s.title} {...s} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}
