"use client";

import styles from "./DiagnosticForm.module.css";

export default function DiagnosticForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up form submission
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">Nombre</label>
        <input className={styles.input} id="name" name="name" type="text" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">Correo electrónico</label>
        <input className={styles.input} id="email" name="email" type="email" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="company">Empresa</label>
        <input className={styles.input} id="company" name="company" type="text" />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="challenge">¿Cuál es tu mayor reto operativo?</label>
        <textarea className={styles.textarea} id="challenge" name="challenge" rows={4} required />
      </div>
      <button className={styles.submit} type="submit">
        Solicitar diagnóstico gratuito
      </button>
    </form>
  );
}
