"use client";

import Link from "next/link";
import styles from "./Nav.module.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const links = [
  { href: "/servicios", label: "Servicios" },
  { href: "/soluciones", label: "Soluciones" },
  { href: "/casos", label: "Casos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          TPConsulting
        </Link>
        <ul className={styles.links}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={styles.link}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <ThemeToggle />
          <Link href="/diagnostico" className={styles.cta}>
            Diagnóstico
          </Link>
          <Link href="/contacto" className={styles.ctaSecondary}>
            Contacto
          </Link>
        </div>
      </nav>
    </header>
  );
}
