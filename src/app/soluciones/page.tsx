import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import SolutionFilter from "./SolutionFilter";

export const metadata: Metadata = {
  title: "Soluciones — TPConsulting",
  description: "12 soluciones de automatización preconfiguradas para tu industria. Actívala en días, no meses.",
  openGraph: {
    title: "Soluciones — TPConsulting",
    description: "Soluciones de automatización probadas para manufactura, retail, logística, servicios y más.",
    locale: "es_MX",
  },
};

const solutions: Solution[] = [
  {
    id: "restaurante",
    category: "Restaurantes",
    industry: "Restaurantes",
    complexity: "Media",
    title: "Reservas y pedidos digitales",
    description:
      "Sistema completo de reservas en línea, pedidos digitales y confirmación automática por WhatsApp. Integrado con tu punto de venta.",
    outcomes: [
      "3× menos llamadas perdidas",
      "Confirmaciones automáticas 24/7",
      "Pedidos sin errores de captura",
      "Reportes diarios automáticos",
    ],
    price: "desde $12,000 MXN",
    href: "/diagnostico?solucion=restaurante",
  },
  {
    id: "clinica",
    category: "Clínicas",
    industry: "Clínicas",
    complexity: "Media",
    title: "Gestión de citas y recordatorios",
    description:
      "Agenda inteligente con recordatorios automáticos por WhatsApp y SMS. Ficha digital del paciente y cobro en línea.",
    outcomes: [
      "80% menos inasistencias",
      "Ficha digital centralizada",
      "Cobro y facturación integrados",
      "Reagendamiento automático",
    ],
    price: "desde $15,000 MXN",
    href: "/diagnostico?solucion=clinica",
  },
  {
    id: "inmobiliaria",
    category: "Inmobiliarias",
    industry: "Inmobiliarias",
    complexity: "Alta",
    title: "Pipeline de ventas automatizado",
    description:
      "CRM que califica prospectos por WhatsApp, agenda visitas y hace seguimiento automático a 90 días sin esfuerzo manual.",
    outcomes: [
      "Calificación automática de leads",
      "Seguimiento a 90 días sin esfuerzo",
      "Agenda de visitas automática",
      "Reportes semanales automáticos",
    ],
    price: "desde $20,000 MXN",
    href: "/diagnostico?solucion=inmobiliaria",
  },
  {
    id: "hospedaje",
    category: "Hospedaje",
    industry: "Hospedaje",
    complexity: "Alta",
    title: "Prospección Airbnb + VRBO",
    description:
      "Pipeline de 5 etapas que responde consultas en menos de 2 minutos, califica con IA y convierte más reservas.",
    outcomes: [
      "3× tasa de conversión",
      "Respuesta en menos de 2 minutos",
      "Pipeline visual de prospectos",
      "Ingreso adicional documentado",
    ],
    price: "desde $18,000 MXN",
    href: "/diagnostico?solucion=hospedaje",
  },
  {
    id: "consultora",
    category: "Servicios",
    industry: "Servicios",
    complexity: "Media",
    title: "Onboarding de clientes automatizado",
    description:
      "Flujo de bienvenida, firma digital de contratos y asignación de equipo — todo en menos de 24 horas sin coordinación manual.",
    outcomes: [
      "Onboarding en menos de 24 horas",
      "Contratos digitales firmados",
      "Asignación automática de equipo",
      "Factura generada al momento",
    ],
    price: "desde $10,000 MXN",
    href: "/diagnostico?solucion=consultora",
  },
  {
    id: "comercio",
    category: "Comercios",
    industry: "Comercios",
    complexity: "Media",
    title: "Inventario y pedidos automatizados",
    description:
      "Control de stock en tiempo real, alertas de quiebre, reórdenes automáticos y reportes de movimiento diarios.",
    outcomes: [
      "Cero quiebres de inventario",
      "Reórdenes automáticos",
      "Integración con punto de venta",
      "Reportes de movimiento diarios",
    ],
    price: "desde $12,000 MXN",
    href: "/diagnostico?solucion=comercio",
  },
  {
    id: "dental",
    category: "Clínicas",
    industry: "Dental",
    complexity: "Baja",
    title: "Recordatorios y reactivación dental",
    description:
      "Recordatorios automáticos 24h antes, seguimiento de tratamientos y campaña de reactivación para pacientes inactivos.",
    outcomes: [
      "40% más pacientes reactivados",
      "Recordatorios WhatsApp automáticos",
      "Encuesta de satisfacción post-consulta",
      "Sin trabajo manual adicional",
    ],
    price: "desde $8,500 MXN",
    href: "/diagnostico?solucion=dental",
  },
  {
    id: "agencia",
    category: "Servicios",
    industry: "Agencias",
    complexity: "Media",
    title: "Reportes automáticos para agencias",
    description:
      "Dashboard que consolida métricas de todos los canales del cliente. Reportes semanales automáticos con comparativa y alertas.",
    outcomes: [
      "Reportes semanales sin trabajo manual",
      "Comparativa vs período anterior",
      "Alertas de bajo rendimiento",
      "Presentación lista para cliente",
    ],
    price: "desde $9,000 MXN",
    href: "/diagnostico?solucion=agencia",
  },
];

const filterTabs = [
  "Todas",
  "Restaurantes",
  "Clínicas",
  "Inmobiliarias",
  "Hospedaje",
  "Comercios",
  "Servicios",
];

function complexityClass(complexity: Complexity): string {
  switch (complexity) {
    case "Baja": return styles.complexityBaja;
    case "Media": return styles.complexityMedia;
    case "Alta": return styles.complexityAlta;
  }
}

export default function SolucionesPage() {
  const [activeFilter, setActiveFilter] = useState("Todas");

  const filtered =
    activeFilter === "Todas"
      ? solutions
      : solutions.filter((s) => s.category === activeFilter);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Marketplace de soluciones</span>
          <h1 className={styles.title}>Automatizaciones listas para activar en tu negocio</h1>
          <p className={styles.subtitle}>
            12 soluciones preconfiguradas y probadas en empresas reales. Filtra por tu industria y encuentra exactamente lo que necesitas.
          </p>
        </div>
      </div>

      <SolutionFilter />

      <div className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>¿No encuentras tu solución?</h2>
          <p className={styles.ctaText}>
            Cada negocio es único. Agenda un diagnóstico y construimos la automatización perfecta para tu operación.
          </p>
          <Link href="/diagnostico" className={styles.ctaLink}>
            Pedir diagnóstico personalizado
          </Link>
        </div>
      </div>
    </main>
  );
}
