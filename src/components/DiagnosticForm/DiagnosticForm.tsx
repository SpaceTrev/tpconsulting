"use client";

import { useState } from "react";
import styles from "./DiagnosticForm.module.css";

interface FormState {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  industria: string;
  reto: string;
}

const initialState: FormState = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  industria: "",
  reto: "",
};

const industrias = [
  "Manufactura",
  "Comercio al por menor",
  "Logística y distribución",
  "Servicios profesionales",
  "Construcción",
  "Alimentos y bebidas",
  "Salud",
  "Educación",
  "Otro",
];

export default function DiagnosticForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    // TODO: wire up to API route or form service
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className={styles.success}>
        <p className={styles.successTitle}>¡Solicitud recibida!</p>
        <p className={styles.successBody}>
          Te contactaremos en menos de 24 horas para agendar tu diagnóstico.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="nombre" className={styles.label}>
            Nombre completo <span aria-hidden="true">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            autoComplete="name"
            value={form.nombre}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ana García"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="empresa" className={styles.label}>
            Empresa <span aria-hidden="true">*</span>
          </label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            required
            autoComplete="organization"
            value={form.empresa}
            onChange={handleChange}
            className={styles.input}
            placeholder="Mi Empresa S.A. de C.V."
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Correo electrónico <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="ana@miempresa.com"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="telefono" className={styles.label}>
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            value={form.telefono}
            onChange={handleChange}
            className={styles.input}
            placeholder="+52 33 1234 5678"
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="industria" className={styles.label}>
          Industria <span aria-hidden="true">*</span>
        </label>
        <select
          id="industria"
          name="industria"
          required
          value={form.industria}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Selecciona tu industria</option>
          {industrias.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="reto" className={styles.label}>
          ¿Cuál es tu principal reto operativo? <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="reto"
          name="reto"
          required
          rows={4}
          value={form.reto}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Describe brevemente el proceso que quieres automatizar o mejorar..."
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className={styles.submit}
      >
        {status === "loading" ? "Enviando..." : "Solicitar diagnóstico — $1,000 MXN"}
      </button>
      <p className={styles.disclaimer}>
        El diagnóstico incluye análisis de procesos, mapa de oportunidades de automatización y reporte ejecutivo.
      </p>
    </form>
  );
}
