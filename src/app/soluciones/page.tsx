// TODO: wrap in server component for metadata when needed
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./soluciones.module.css";

type Complexity = "Baja" | "Media" | "Alta";

type Solution = {
  id: string;
  category: string;
  industry: string;
  complexity: Complexity;
  title: string;
  description: string;
  outcomes: string[];
  price: string;
  href: string;
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
    <main>
      <section className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>Por industria</p>
          <h1 className={styles.pageTitle}>Soluciones</h1>
          <p className={styles.pageSubtitle}>
            Automatizaciones construidas específicamente para tu tipo de
            negocio. Sin soluciones genéricas.
          </p>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.gridInner}>
          <div className={styles.filterTabs} role="tablist" aria-label="Filtrar por industria">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeFilter === tab}
                className={`${styles.filterTab} ${activeFilter === tab ? styles.filterTabActive : ""}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.solutionsGrid}>
            {filtered.map((solution) => (
              <article key={solution.id} className={styles.solutionCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.industryBadge}>{solution.industry}</span>
                  <span className={`${styles.complexityChip} ${complexityClass(solution.complexity)}`}>
                    {solution.complexity}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{solution.title}</h3>
                <p className={styles.cardDesc}>{solution.description}</p>
                <ul className={styles.outcomes} aria-label="Resultados">
                  {solution.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                <p className={styles.cardPrice}>{solution.price}</p>
                <Link href={solution.href} className={styles.cardBtn}>
                  Solicitar esta solución
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>¿Tu industria no está en la lista?</h2>
          <p className={styles.ctaDesc}>
            Diseñamos soluciones para cualquier tipo de negocio. Cuéntanos tu
            proceso y te decimos cómo automatizarlo.
          </p>
          <Link href="/diagnostico" className={styles.ctaBtn}>
            Solicitar diagnóstico →
          </Link>
        </div>
      </section>
    </main>
  );
}
