import type { Metadata } from "next";
import DiagnosticForm from "@/components/DiagnosticForm/DiagnosticForm";
import styles from "./diagnostico.module.css";

export const metadata: Metadata = {
  title: "Diagnóstico Técnico — TPConsulting",
  description:
    "Responde nuestro cuestionario de diagnóstico y recibe un plan de acción personalizado para automatizar y optimizar tu negocio en menos de 24 horas.",
};

export default function DiagnosticoPage() {
  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.heroLabel}>Diagnóstico técnico</p>
        <h1>Cuéntanos sobre tu negocio</h1>
        <p>
          Responde las siguientes preguntas y en menos de 24 horas te enviamos un plan de acción
          personalizado.
        </p>
      </div>
      <div className={styles.formWrapper}>
        <DiagnosticForm />
      </div>
    </main>
  );
}
