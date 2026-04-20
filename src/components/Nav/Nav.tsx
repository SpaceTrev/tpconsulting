"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Nav.module.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import FacMark from "@/components/Logo/FacMark";

const links = [
  { href: "/servicios", label: "Servicios" },
  { href: "/soluciones", label: "Soluciones" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Navegación principal">
          <Link href="/" className={styles.logo}>
            <FacMark size={26} />
            FAC
          </Link>

          <ul className={styles.links} role="list">
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
              Agendar Llamada
            </Link>
            <button
              className={styles.hamburger}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          id="mobile-menu"
          className={styles.mobileMenu}
          role="navigation"
          aria-label="Menú móvil"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={styles.mobileLink}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/diagnostico"
            className={styles.mobileCta}
            onClick={() => setOpen(false)}
          >
            Agendar Llamada
          </Link>
        </div>
      )}
    </>
  );
}
