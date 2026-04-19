"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import formStyles from "@/components/DiagnosticForm/DiagnosticForm.module.css";

interface ContactData {
  name: string;
  email: string;
  whatsapp: string;
  industry: string;
  message: string;
}

const initial: ContactData = { name: "", email: "", whatsapp: "", industry: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState<ContactData>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function set(field: keyof ContactData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("contacts").insert([{ ...form, source_page: "contacto" }]);
    setStatus(error ? "error" : "success");
  }

  if (status === "success") {
    return (
      <div className={formStyles.success}>
        <span className={formStyles.successIcon} aria-hidden="true">✓</span>
        <h2 className={formStyles.successTitle}>¡Mensaje enviado!</h2>
        <p className={formStyles.successBody}>
          Te responderemos en menos de 24 horas por el canal que prefieras. Revisa tu WhatsApp o correo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Nombre completo <span aria-hidden="true">*</span></label>
          <input
            className={formStyles.input}
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ana García"
            required
          />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Correo electrónico <span aria-hidden="true">*</span></label>
          <input
            className={formStyles.input}
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="ana@miempresa.com"
            required
          />
        </div>
      </div>
      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label className={formStyles.label}>WhatsApp</label>
          <input
            className={formStyles.input}
            type="tel"
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="+52 33 1234 5678"
          />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Industria</label>
          <select className={formStyles.select} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
            <option value="">Selecciona</option>
            {["Manufactura","Retail","Logística","Servicios profesionales","Construcción","Alimentos y bebidas","Salud","Educación","Otro"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={formStyles.field}>
        <label className={formStyles.label}>¿En qué podemos ayudarte? <span aria-hidden="true">*</span></label>
        <textarea
          className={formStyles.textarea}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={5}
          placeholder="Cuéntanos brevemente qué quieres automatizar o qué duda tienes..."
          required
        />
      </div>
      {status === "error" && (
        <p className={formStyles.errorMsg} role="alert">
          Hubo un error al enviar el mensaje. Por favor intenta de nuevo.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading" || !form.name || !form.email || !form.message}
        className={formStyles.btnSubmit}
      >
        {status === "loading" ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
