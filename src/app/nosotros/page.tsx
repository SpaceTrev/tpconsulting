import type { Metadata } from "next";
import Link from "next/link";
import styles from "./nosotros.module.css";

export const metadata: Metadata = {
  title: "Nosotros — TPConsulting",
  description:
    "Dos personas con experiencia en Fortune 500 construyendo automatización enterprise para PyMEs mexicanas desde Guadalajara.",
  openGraph: {
    title: "Nosotros — TPConsulting",
    description:
      "Dos personas con experiencia en Fortune 500 construyendo automatización enterprise para PyMEs mexicanas desde Guadalajara.",
    locale: "es_MX",
    type: "website",
  },
};

const trevorTags = [
  "Fortune 500",
  "Starbucks",
  "Arquitectura enterprise",
  "Sistemas distribuidos",
  "Automatización",
];

const pabloTags = [
  "Operaciones",
  "Mercado mexicano",
  "PyMEs",
  "Crecimiento",
  "Ventas",
];

const valueCards = [
  {
    title: "Velocidad",
    desc: "Sin burocracia interna. Tomamos decisiones rápido y entregamos en semanas, no en meses.",
  },
  {
    title: "Enfoque",
    desc: "Trabajamos con un número limitado de clientes a la vez para garantizar atención total a cada proyecto.",
  },
  {
    title: "Transparencia",
    desc: "Sin letra chica. Precios claros, alcances definidos y comunicación directa en todo momento.",
  },
];

export default function NosotrosPage() {
  return (
    <main>
      <section className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>El equipo</p>
          <h1 className={styles.pageTitle}>
            Dos personas. Décadas de experiencia. Potenciados por IA.
          </h1>
          <p className={styles.pageSubtitle}>
            Somos un equipo pequeño por diseño — lo que nos permite operar con
            la agilidad de una startup y la profundidad de una firma enterprise.
          </p>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.teamInner}>
          <div className={styles.teamGrid}>
            <article className={styles.teamCard}>
              <div className={styles.avatar} aria-hidden="true">TP</div>
              <h3 className={styles.teamName}>Trevor</h3>
              <p className={styles.teamRole}>Fundador · Arquitectura de sistemas</p>
              <p className={styles.teamBio}>
                Nueve años construyendo sistemas de software de nivel enterprise
                en compañías Fortune 500, incluyendo Starbucks. Especialista en
                arquitectura de integración, automatización de procesos y
                sistemas distribuidos. Nació en Estados Unidos y eligió
                Guadalajara como base de operaciones para construir tecnología
                de clase mundial para el mercado mexicano.
              </p>
              <ul className={styles.teamTags} aria-label="Áreas de expertise">
                {trevorTags.map((tag) => (
                  <li key={tag} className={styles.teamTag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.teamCard}>
              <div className={styles.avatar} aria-hidden="true">PO</div>
              <h3 className={styles.teamName}>Pablo</h3>
              <p className={styles.teamRole}>Fundador · Operaciones y crecimiento</p>
              <p className={styles.teamBio}>
                Especialista en operaciones de negocio y el mercado mexicano. Ha
                trabajado con decenas de PyMEs en México optimizando sus procesos
                operativos, sistemas de ventas y estructura organizacional.
                Entiende los retos únicos de operar un negocio en México — desde
                la facturación electrónica hasta las dinámicas del cliente local.
              </p>
              <ul className={styles.teamTags} aria-label="Áreas de expertise">
                {pabloTags.map((tag) => (
                  <li key={tag} className={styles.teamTag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.modelSection}>
        <div className={styles.modelInner}>
          <p className={styles.sectionLabel}>Nuestro modelo</p>
          <h2 className={styles.modelTitle}>2 personas × IA = resultados enterprise</h2>
          <p className={styles.modelDesc}>
            No somos una agencia de cientos de empleados. Somos dos personas con
            herramientas de IA que amplifican nuestra capacidad de trabajo. Lo
            que antes requería equipos de 20 personas, hoy lo hacemos dos — con
            mejor calidad, más rápido y a una fracción del costo.
          </p>
          <div className={styles.valueGrid}>
            {valueCards.map((card) => (
              <article key={card.title} className={styles.valueCard}>
                <h3 className={styles.valueTitle}>{card.title}</h3>
                <p className={styles.valueDesc}>{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.storyInner}>
          <p className={styles.sectionLabel}>La historia</p>
          <h2 className={styles.storyTitle}>Por qué TPConsulting</h2>
          <p className={styles.storyDesc}>
            Después de años construyendo sistemas para grandes corporativos,
            vimos que las herramientas que usaban las empresas Fortune 500 eran
            perfectamente aplicables a PyMEs mexicanas — pero nadie las estaba
            ofreciendo de forma accesible. Fundamos TPConsulting en Guadalajara
            para cerrar esa brecha: llevar automatización de nivel enterprise a
            negocios de cualquier tamaño.
          </p>
          <Link href="/contacto" className={styles.storyLink}>
            Habla con el equipo →
          </Link>
        </div>
      </section>
    </main>
  );
}
