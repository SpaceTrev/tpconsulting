import type { Metadata } from "next";
import styles from "./page.module.css";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contacto — TPConsulting",
  description: "Contáctanos para comenzar tu transformación digital. Respondemos en menos de 24 horas por WhatsApp o correo.",
  openGraph: {
    title: "Contacto — TPConsulting",
    description: "Contáctanos para comenzar tu transformación digital. Respondemos en menos de 24 horas.",
    locale: "es_MX",
  },
};

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
                  href="https://wa.me/5215512345678?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20servicios%20de%20automatizaci%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactMethod}
                >
                  <span className={styles.contactMethodIcon} aria-hidden="true">💬</span>
                  <span>
                    <span className={styles.contactMethodLabel}>WhatsApp</span>
                    <span className={styles.contactMethodValue}>+52 55 1234 5678 — Respuesta en &lt;2hrs</span>
                  </span>
                </a>
                <a
                  href="mailto:hola@tpconsulting.mx"
                  className={styles.contactMethod}
                >
                  <span className={styles.contactMethodIcon} aria-hidden="true">✉️</span>
                  <span>
                    <span className={styles.contactMethodLabel}>Correo electrónico</span>
                    <span className={styles.contactMethodValue}>hola@tpconsulting.mx</span>
                  </span>
                </a>
              </div>

              <div className={styles.sideCard}>
                <div className={styles.calendarPlaceholder}>
                  <span className={styles.calendarIcon} aria-hidden="true">📅</span>
                  <p className={styles.calendarTitle}>Agenda una llamada exploratoria</p>
                  <p className={styles.calendarText}>
                    30 minutos, sin costo. Platicamos sobre tu operación y te decimos si podemos ayudarte.
                  </p>
                  <a
                    href="https://calendly.com/tpconsulting"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.calendarLink}
                  >
                    Ver disponibilidad →
                  </a>
                </div>
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
