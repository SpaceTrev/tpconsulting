import Link from "next/link";
import styles from "./Footer.module.css";

const nav = [
  {
    label: "Servicios",
    links: [
      { href: "/servicios", label: "Todos los servicios" },
      { href: "/soluciones", label: "Soluciones" },
      { href: "/diagnostico", label: "Diagnóstico" },
    ],
  },
  {
    label: "Empresa",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/casos", label: "Casos de éxito" },
      { href: "/blog", label: "Blog" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            TPConsulting
          </Link>
          <p className={styles.tagline}>
            Automatización inteligente para negocios mexicanos.
          </p>
        </div>
        {nav.map((section) => (
          <div key={section.label} className={styles.section}>
            <p className={styles.sectionLabel}>{section.label}</p>
            <ul className={styles.sectionLinks}>
              {section.links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={styles.link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} TPConsulting. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
