import type { Metadata } from "next";
import styles from "./page.module.css";
import ContactForm from "./ContactForm";
import CalEmbed from "@/components/CalEmbed/CalEmbed";

export const metadata: Metadata = {
  title: "Contacto — FAC",
  description: "Contáctanos para comenzar tu transformación digital. Respondemos en menos de 24 horas por WhatsApp o correo.",
  openGraph: {
    title: "Contacto — FAC",
    description: "Contáctanos para comenzar tu transformación digital. Respondemos en menos de 24 horas.",
    locale: "es_MX",
  },
};

export default function ContactoPage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>Contáctanos</span>
          <h1 className={styles.title}>Hablemos sobre tu negocio</h1>
          <p className={styles.subtitle}>
            ¿Tienes preguntas antes de hacer un diagnóstico? ¿Quieres explorar si somos el fit correcto? Escríbenos y te respondemos en menos de 24 horas.
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.bodyInner}>
            <div className={styles.formWrapper}>
              <h2 className={styles.formTitle}>Escríbenos</h2>
              <ContactForm />
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Canales de contacto</h3>
                <p className={styles.sideText}>
                  Respondemos todos los mensajes en menos de 24 horas hábiles. Normalmente somos mucho más rápidos.
                </p>
                <a
                  href="https://wa.me/13038299013?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20sus%20servicios%20de%20automatizaci%C3%B3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactMethod}
                >
                  <span className={styles.contactMethodIcon} aria-hidden="true">💬</span>
                  <span>
                    <span className={styles.contactMethodLabel}>WhatsApp — General</span>
                    <span className={styles.contactMethodValue}>Trevor · +1 (303) 829-9013</span>
                  </span>
                </a>
                <a
                  href="https://wa.me/522281773964?text=Hola%2C%20me%20interesa%20un%20diagn%C3%B3stico%20para%20mi%20negocio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactMethod}
                >
                  <span className={styles.contactMethodIcon} aria-hidden="true">💬</span>
                  <span>
                    <span className={styles.contactMethodLabel}>WhatsApp — Diagnóstico</span>
                    <span className={styles.contactMethodValue}>Pablo · +52 (228) 177-3964</span>
                  </span>
                </a>
                <a
                  href="mailto:hola@thefac.co"
                  className={styles.contactMethod}
                >
                  <span className={styles.contactMethodIcon} aria-hidden="true">✉️</span>
                  <span>
                    <span className={styles.contactMethodLabel}>Correo electrónico</span>
                    <span className={styles.contactMethodValue}>hola@thefac.co</span>
                  </span>
                </a>
              </div>

              <div className={styles.sideCard}>
                <CalEmbed
                  title="Agenda una llamada exploratoria"
                  subtitle="30 minutos, sin costo. Platicamos sobre tu operación y te decimos si podemos ayudarte."
                />
              </div>

              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>¿Prefieres empezar con un diagnóstico?</h3>
                <p className={styles.sideText}>
                  Por $1,000 MXN te entregamos un mapa completo de oportunidades de automatización en 48 horas.
                </p>
                <a href="/diagnostico" className={styles.calendarLink}>
                  Ir al diagnóstico →
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
