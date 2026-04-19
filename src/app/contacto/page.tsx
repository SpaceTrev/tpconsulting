"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./contacto.module.css";

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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

function EnvelopeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    whatsapp: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <section className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>Contacto</p>
          <h1 className={styles.pageTitle}>Hablemos</h1>
          <p className={styles.pageSubtitle}>
            ¿Tienes preguntas? ¿Quieres saber si tu negocio es candidato para
            automatización? Escríbenos.
          </p>
          <p className={styles.location}>
            <PinIcon />
            Guadalajara, Jalisco · Servimos todo México
          </p>
        </div>
      </section>

      <section className={styles.optionsSection}>
        <div className={styles.optionsInner}>
          <div className={styles.contactOptions}>
            <article className={styles.optionCard}>
              <div className={styles.optionIcon}>
                <WhatsAppIcon />
              </div>
              <h2 className={styles.optionTitle}>WhatsApp</h2>
              <p className={styles.optionDesc}>
                La forma más rápida. Respondemos en menos de 2 horas en horario
                hábil.
              </p>
              <Link
                href="https://wa.me/5213312345678?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20sus%20servicios"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.optionActionPrimary}
              >
                Escríbenos por WhatsApp
              </Link>
            </article>

            <article className={styles.optionCard}>
              <div className={styles.optionIcon}>
                <CalendarIcon />
              </div>
              <h2 className={styles.optionTitle}>Llamada de 30 min</h2>
              <p className={styles.optionDesc}>
                Agenda una llamada sin costo para explorar cómo podemos
                ayudarte.
              </p>
              <Link
                href="https://calendly.com/tpconsulting"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.optionActionSecondary}
              >
                Agendar en Calendly
              </Link>
            </article>

            <article className={styles.optionCard}>
              <div className={styles.optionIcon}>
                <EnvelopeIcon />
              </div>
              <h2 className={styles.optionTitle}>Correo electrónico</h2>
              <p className={styles.optionDesc}>
                Para propuestas formales, presentaciones o documentos.
              </p>
              <Link
                href="mailto:hola@tpconsulting.mx"
                className={styles.optionActionEmail}
              >
                hola@tpconsulting.mx
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formInner}>
          <h2 className={styles.formTitle}>O déjanos tus datos</h2>
          <p className={styles.formSubtitle}>
            Te contactamos en menos de 24 horas.
          </p>

          {submitted ? (
            <div className={styles.successMessage} role="alert">
              ¡Mensaje recibido! Te contactamos pronto.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>
                  Tu nombre completo <span aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={styles.input}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="company" className={styles.label}>
                  Tu empresa
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className={styles.input}
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Tu empresa"
                  autoComplete="organization"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>
                  Correo electrónico <span aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={styles.input}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  autoComplete="email"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="whatsapp" className={styles.label}>
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  className={styles.input}
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="+52 33 1234 5678"
                  autoComplete="tel"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="message" className={styles.label}>
                  ¿En qué podemos ayudarte?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className={styles.textarea}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos brevemente qué proceso te gustaría automatizar o mejorar..."
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
