"use client";

import { useState } from "react";
import styles from "./DiagnosticForm.module.css";

type FormData = {
  // Stage 1
  businessName: string;
  industry: string;
  city: string;
  employees: string;
  businessAge: string;
  // Stage 2
  customerChannels: string[];
  firstContact: string;
  responseTime: string;
  dataManagement: string;
  cfdi: string;
  googleBusiness: string;
  // Stage 3
  biggestWaste: string;
  oneToAutomate: string;
  pastAttempts: string;
  pastAttemptsDetail: string;
  losingCustomers: string[];
  currentTools: string[];
  // Stage 4
  techSpend: string;
  automationBudget: string;
  monthlyRevenue: string;
  urgency: string;
  anythingElse: string;
  // Contact
  name: string;
  whatsapp: string;
  email: string;
  contactPref: string;
  // Tier
  tier: string;
};

const initialForm: FormData = {
  businessName: "",
  industry: "",
  city: "",
  employees: "",
  businessAge: "",
  customerChannels: [],
  firstContact: "",
  responseTime: "",
  dataManagement: "",
  cfdi: "",
  googleBusiness: "",
  biggestWaste: "",
  oneToAutomate: "",
  pastAttempts: "",
  pastAttemptsDetail: "",
  losingCustomers: [],
  currentTools: [],
  techSpend: "",
  automationBudget: "",
  monthlyRevenue: "",
  urgency: "",
  anythingElse: "",
  name: "",
  whatsapp: "+52 ",
  email: "",
  contactPref: "",
  tier: "",
};

const stageLabels = [
  "Tu Negocio",
  "Tu Operación",
  "Tu Mayor Dolor",
  "Tu Inversión",
  "Tu Contacto",
  "Confirmar",
];

const tiers = [
  {
    id: "basico",
    title: "Escaneo Básico",
    price: "$1,000 MXN",
    desc: "Cuestionario + informe PDF en 48 horas",
    recommended: false,
  },
  {
    id: "estandar",
    title: "Diagnóstico Estándar",
    price: "$5,000 MXN",
    desc: "Videollamada 90 min + plan priorizado",
    recommended: true,
  },
  {
    id: "profundo",
    title: "Análisis Profundo",
    price: "$10,000 MXN",
    desc: "Todo el Estándar + visita presencial GDL",
    recommended: false,
  },
  {
    id: "enterprise",
    title: "Consultoría Enterprise",
    price: "$15,000 MXN",
    desc: "Todo el Análisis + taller directivo + 30 días CTO",
    recommended: false,
  },
];

export default function DiagnosticForm() {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleMultiCheck = (
    field: "customerChannels" | "losingCustomers" | "currentTools",
    value: string
  ) => {
    setForm((prev) => {
      const arr = prev[field] as string[];
      const exists = arr.includes(value);
      return {
        ...prev,
        [field]: exists ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStage = (s: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.businessName.trim()) newErrors.businessName = "Este campo es obligatorio.";
      if (!form.industry) newErrors.industry = "Selecciona una industria.";
      if (!form.city.trim()) newErrors.city = "Este campo es obligatorio.";
    }
    if (s === 2) {
      if (form.customerChannels.length === 0)
        newErrors.customerChannels = "Selecciona al menos una opción.";
      if (!form.firstContact) newErrors.firstContact = "Selecciona una opción.";
      if (!form.responseTime) newErrors.responseTime = "Selecciona una opción.";
      if (!form.dataManagement) newErrors.dataManagement = "Selecciona una opción.";
    }
    if (s === 3) {
      if (!form.biggestWaste.trim()) newErrors.biggestWaste = "Este campo es obligatorio.";
      if (!form.oneToAutomate.trim()) newErrors.oneToAutomate = "Este campo es obligatorio.";
      if (!form.pastAttempts) newErrors.pastAttempts = "Selecciona una opción.";
    }
    if (s === 4) {
      if (!form.automationBudget) newErrors.automationBudget = "Selecciona una opción.";
      if (!form.urgency) newErrors.urgency = "Selecciona una opción.";
    }
    if (s === 5) {
      if (!form.name.trim()) newErrors.name = "Este campo es obligatorio.";
      if (!form.email.trim()) newErrors.email = "Este campo es obligatorio.";
      if (!form.whatsapp.trim() || form.whatsapp === "+52 ")
        newErrors.whatsapp = "Ingresa tu número de WhatsApp.";
      if (!form.tier) newErrors.tier = "Selecciona un tipo de diagnóstico.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStage(stage)) {
      setStage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStage((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className={styles.success}>
        <svg
          className={styles.successIcon}
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="24" fill="currentColor" fillOpacity="0.12" />
          <path
            d="M14 24L21 31L34 17"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className={styles.successTitle}>¡Solicitud enviada!</h3>
        <p className={styles.successBody}>
          Te contactamos en menos de 24 horas para confirmar tu diagnóstico. Revisa tu WhatsApp y
          correo.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.form}>
      {/* Progress Indicator */}
      <nav className={styles.progress} aria-label="Progreso del formulario">
        {stageLabels.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stage > stepNum;
          const isActive = stage === stepNum;
          return (
            <div key={stepNum} className={styles.progressStep}>
              {i > 0 && <div className={styles.progressLine} />}
              <div
                className={[
                  styles.progressDot,
                  isActive ? styles.progressDotActive : "",
                  isDone ? styles.progressDotDone : "",
                  !isActive && !isDone ? styles.progressDotPending : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={isActive ? "step" : undefined}
              >
                {stepNum}
              </div>
              <span className={styles.progressLabel}>{label}</span>
            </div>
          );
        })}
      </nav>

      {/* Stage 1 */}
      {stage === 1 && (
        <>
          <h2 className={styles.stageTitle}>Tu negocio</h2>
          <p className={styles.stageSub}>Cuéntanos los datos básicos de tu empresa.</p>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="businessName">
                Nombre de tu empresa o negocio <span className={styles.required}>*</span>
              </label>
              <input
                id="businessName"
                type="text"
                className={styles.input}
                value={form.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                autoComplete="organization"
              />
              {errors.businessName && (
                <span className={styles.errorMsg}>{errors.businessName}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="industry">
                Industria o giro <span className={styles.required}>*</span>
              </label>
              <select
                id="industry"
                className={styles.select}
                value={form.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
              >
                <option value="" disabled>
                  Selecciona tu industria
                </option>
                <option value="Restaurante">Restaurante</option>
                <option value="Cafetería">Cafetería</option>
                <option value="Clínica / Consultorio">Clínica / Consultorio</option>
                <option value="Inmobiliaria">Inmobiliaria</option>
                <option value="Hospedaje / Airbnb">Hospedaje / Airbnb</option>
                <option value="Tienda / Comercio al menudeo">Tienda / Comercio al menudeo</option>
                <option value="Agencia de marketing">Agencia de marketing</option>
                <option value="Consultoría / Servicios profesionales">
                  Consultoría / Servicios profesionales
                </option>
                <option value="Educación / Academia">Educación / Academia</option>
                <option value="Construcción">Construcción</option>
                <option value="Manufactura">Manufactura</option>
                <option value="Transporte / Logística">Transporte / Logística</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.industry && <span className={styles.errorMsg}>{errors.industry}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="city">
                ¿En qué ciudad operas? <span className={styles.required}>*</span>
              </label>
              <input
                id="city"
                type="text"
                className={styles.input}
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Guadalajara"
              />
              {errors.city && <span className={styles.errorMsg}>{errors.city}</span>}
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>¿Cuántas personas trabajan contigo?</legend>
                <div className={styles.radioGroup}>
                  {["Solo yo", "2–5 personas", "6–15 personas", "16–50 personas", "Más de 50"].map(
                    (opt) => (
                      <label
                        key={opt}
                        className={styles.radioOption}
                        data-selected={form.employees === opt ? "true" : "false"}
                      >
                        <input
                          type="radio"
                          name="employees"
                          value={opt}
                          checked={form.employees === opt}
                          onChange={() => handleChange("employees", opt)}
                          className={styles.hiddenInput}
                        />
                        <span
                          className={[
                            styles.radioCircle,
                            form.employees === opt ? styles.radioCircleSelected : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        />
                        {opt}
                      </label>
                    )
                  )}
                </div>
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>¿Cuánto tiempo lleva tu negocio?</legend>
                <div className={styles.radioGroup}>
                  {[
                    "Menos de 1 año",
                    "1 a 3 años",
                    "3 a 10 años",
                    "Más de 10 años",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.businessAge === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="businessAge"
                        value={opt}
                        checked={form.businessAge === opt}
                        onChange={() => handleChange("businessAge", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.businessAge === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </>
      )}

      {/* Stage 2 */}
      {stage === 2 && (
        <>
          <h2 className={styles.stageTitle}>Tu operación</h2>
          <p className={styles.stageSub}>Entendemos cómo funciona tu negocio día a día.</p>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Cómo te encuentran tus clientes? (todas las que apliquen){" "}
                  <span className={styles.required}>*</span>
                </legend>
                <div className={styles.checkboxGroup}>
                  {[
                    "Recomendaciones / boca a boca",
                    "Redes sociales (Instagram, Facebook)",
                    "Google / búsqueda orgánica",
                    "WhatsApp directo",
                    "Plataforma o marketplace",
                    "Publicidad pagada",
                    "Otra forma",
                  ].map((opt) => {
                    const checked = form.customerChannels.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={styles.checkboxOption}
                        data-selected={checked ? "true" : "false"}
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          checked={checked}
                          onChange={() => handleMultiCheck("customerChannels", opt)}
                          className={styles.hiddenInput}
                        />
                        <span
                          className={[
                            styles.checkboxBox,
                            checked ? styles.checkboxBoxChecked : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {checked && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path
                                d="M2 6L5 9L10 3"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        {opt}
                      </label>
                    );
                  })}
                </div>
                {errors.customerChannels && (
                  <span className={styles.errorMsg}>{errors.customerChannels}</span>
                )}
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Cómo es el primer contacto con un prospecto?{" "}
                  <span className={styles.required}>*</span>
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "Llamada telefónica",
                    "WhatsApp",
                    "Formulario en mi sitio web",
                    "Correo electrónico",
                    "En persona",
                    "A través de una plataforma",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.firstContact === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="firstContact"
                        value={opt}
                        checked={form.firstContact === opt}
                        onChange={() => handleChange("firstContact", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.firstContact === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.firstContact && (
                  <span className={styles.errorMsg}>{errors.firstContact}</span>
                )}
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Cuánto tardas en responder a un prospecto?{" "}
                  <span className={styles.required}>*</span>
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "Menos de 5 minutos",
                    "Entre 5 y 60 minutos",
                    "Entre 1 y 4 horas",
                    "El mismo día",
                    "Al día siguiente o después",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.responseTime === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="responseTime"
                        value={opt}
                        checked={form.responseTime === opt}
                        onChange={() => handleChange("responseTime", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.responseTime === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.responseTime && (
                  <span className={styles.errorMsg}>{errors.responseTime}</span>
                )}
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Cómo llevas la información de tus clientes?{" "}
                  <span className={styles.required}>*</span>
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "Papel o agenda física",
                    "Hojas de cálculo (Google/Excel)",
                    "Un CRM o software específico",
                    "App o sistema propio",
                    "No tengo un sistema definido",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.dataManagement === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="dataManagement"
                        value={opt}
                        checked={form.dataManagement === opt}
                        onChange={() => handleChange("dataManagement", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.dataManagement === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.dataManagement && (
                  <span className={styles.errorMsg}>{errors.dataManagement}</span>
                )}
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Tus clientes te piden factura (CFDI)?
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "Sí, con frecuencia",
                    "A veces, muy pocos",
                    "No, no manejamos facturas",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.cfdi === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="cfdi"
                        value={opt}
                        checked={form.cfdi === opt}
                        onChange={() => handleChange("cfdi", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.cfdi === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Tienes perfil en Google Business (Google Maps)?
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "Sí, está actualizado y activo",
                    "Tengo pero no lo actualizo",
                    "No tengo perfil",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.googleBusiness === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="googleBusiness"
                        value={opt}
                        checked={form.googleBusiness === opt}
                        onChange={() => handleChange("googleBusiness", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.googleBusiness === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </>
      )}

      {/* Stage 3 */}
      {stage === 3 && (
        <>
          <h2 className={styles.stageTitle}>Tu mayor dolor</h2>
          <p className={styles.stageSub}>
            Identificamos dónde estás perdiendo tiempo y dinero.
          </p>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="biggestWaste">
                ¿Qué actividad repetitiva te roba más tiempo cada semana?{" "}
                <span className={styles.required}>*</span>
              </label>
              <textarea
                id="biggestWaste"
                className={styles.textarea}
                rows={4}
                value={form.biggestWaste}
                onChange={(e) => handleChange("biggestWaste", e.target.value)}
                placeholder="Ej: Responder WhatsApps todo el día, agendar citas manualmente, llenar hojas de cálculo..."
              />
              {errors.biggestWaste && (
                <span className={styles.errorMsg}>{errors.biggestWaste}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="oneToAutomate">
                Si pudieras automatizar UNA sola cosa, ¿qué sería?{" "}
                <span className={styles.required}>*</span>
              </label>
              <textarea
                id="oneToAutomate"
                className={styles.textarea}
                rows={4}
                value={form.oneToAutomate}
                onChange={(e) => handleChange("oneToAutomate", e.target.value)}
                placeholder="Ej: El seguimiento de prospectos, la confirmación de citas, la generación de facturas..."
              />
              {errors.oneToAutomate && (
                <span className={styles.errorMsg}>{errors.oneToAutomate}</span>
              )}
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Has intentado automatizar procesos antes?{" "}
                  <span className={styles.required}>*</span>
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "Sí, y funcionó bien",
                    "Sí, pero no dio resultado",
                    "Lo intentamos pero lo abandonamos",
                    "No hemos intentado nada",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.pastAttempts === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="pastAttempts"
                        value={opt}
                        checked={form.pastAttempts === opt}
                        onChange={() => handleChange("pastAttempts", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.pastAttempts === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.pastAttempts && (
                  <span className={styles.errorMsg}>{errors.pastAttempts}</span>
                )}
              </fieldset>
            </div>

            {(form.pastAttempts === "Sí, pero no dio resultado" ||
              form.pastAttempts === "Lo intentamos pero lo abandonamos") && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="pastAttemptsDetail">
                  ¿Qué salió mal o por qué lo abandonaron?
                </label>
                <textarea
                  id="pastAttemptsDetail"
                  className={styles.textarea}
                  rows={3}
                  value={form.pastAttemptsDetail}
                  onChange={(e) => handleChange("pastAttemptsDetail", e.target.value)}
                  placeholder="Cuéntanos qué pasó..."
                />
              </div>
            )}

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Cómo sabes que estás perdiendo clientes o ventas? (todas las que apliquen)
                </legend>
                <div className={styles.checkboxGroup}>
                  {[
                    "Clientes que no vuelven a comprar",
                    "Seguimiento lento a prospectos",
                    "Errores en pedidos o información",
                    "Mala atención en horas de alta demanda",
                    "No lo sé — no tengo métricas",
                    "Otra razón",
                  ].map((opt) => {
                    const checked = form.losingCustomers.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={styles.checkboxOption}
                        data-selected={checked ? "true" : "false"}
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          checked={checked}
                          onChange={() => handleMultiCheck("losingCustomers", opt)}
                          className={styles.hiddenInput}
                        />
                        <span
                          className={[
                            styles.checkboxBox,
                            checked ? styles.checkboxBoxChecked : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {checked && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path
                                d="M2 6L5 9L10 3"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        {opt}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Qué herramientas usas actualmente? (todas las que apliquen)
                </legend>
                <div className={styles.checkboxGroup}>
                  {[
                    "WhatsApp Business",
                    "Hojas de cálculo (Google Sheets / Excel)",
                    "Facebook / Instagram",
                    "Google Workspace (Gmail + Drive)",
                    "CONTPAQi / Aspel",
                    "Facturapi / Bind ERP",
                    "HubSpot / Pipedrive / otro CRM",
                    "Otro ERP o sistema",
                    "Ninguna de las anteriores",
                  ].map((opt) => {
                    const checked = form.currentTools.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={styles.checkboxOption}
                        data-selected={checked ? "true" : "false"}
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          checked={checked}
                          onChange={() => handleMultiCheck("currentTools", opt)}
                          className={styles.hiddenInput}
                        />
                        <span
                          className={[
                            styles.checkboxBox,
                            checked ? styles.checkboxBoxChecked : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {checked && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path
                                d="M2 6L5 9L10 3"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        {opt}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        </>
      )}

      {/* Stage 4 */}
      {stage === 4 && (
        <>
          <h2 className={styles.stageTitle}>Tu inversión</h2>
          <p className={styles.stageSub}>
            Nos ayuda a proponer soluciones adecuadas para tu presupuesto.
          </p>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Cuánto gastas actualmente en software y herramientas al mes?
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "$0 — no pago nada",
                    "$500 a $2,000 MXN/mes",
                    "$2,000 a $5,000 MXN/mes",
                    "$5,000 a $15,000 MXN/mes",
                    "Más de $15,000 MXN/mes",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.techSpend === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="techSpend"
                        value={opt}
                        checked={form.techSpend === opt}
                        onChange={() => handleChange("techSpend", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.techSpend === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Cuánto estarías dispuesto a invertir en automatizar tu negocio?{" "}
                  <span className={styles.required}>*</span>
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "$5,000 a $10,000 MXN",
                    "$10,000 a $25,000 MXN",
                    "$25,000 a $50,000 MXN",
                    "Más de $50,000 MXN",
                    "Depende del retorno de inversión",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.automationBudget === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="automationBudget"
                        value={opt}
                        checked={form.automationBudget === opt}
                        onChange={() => handleChange("automationBudget", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.automationBudget === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.automationBudget && (
                  <span className={styles.errorMsg}>{errors.automationBudget}</span>
                )}
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Cuál es el rango de ingresos mensuales de tu negocio?
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "Menos de $50,000 MXN",
                    "$50,000 a $200,000 MXN",
                    "$200,000 a $500,000 MXN",
                    "$500,000 a $2,000,000 MXN",
                    "Más de $2,000,000 MXN",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.monthlyRevenue === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="monthlyRevenue"
                        value={opt}
                        checked={form.monthlyRevenue === opt}
                        onChange={() => handleChange("monthlyRevenue", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.monthlyRevenue === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>
                  ¿Qué tan urgente es esto para ti?{" "}
                  <span className={styles.required}>*</span>
                </legend>
                <div className={styles.radioGroup}>
                  {[
                    "Urgente — necesito resultados en 30 días",
                    "Moderada — puedo esperar 1 a 3 meses",
                    "Sin prisa — planeo para 3 a 6 meses",
                    "Solo estoy explorando opciones",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.urgency === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={opt}
                        checked={form.urgency === opt}
                        onChange={() => handleChange("urgency", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.urgency === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.urgency && <span className={styles.errorMsg}>{errors.urgency}</span>}
              </fieldset>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="anythingElse">
                ¿Algo más que quieras que sepamos antes de hablar?
              </label>
              <span className={styles.hintText}>Opcional</span>
              <textarea
                id="anythingElse"
                className={styles.textarea}
                rows={3}
                value={form.anythingElse}
                onChange={(e) => handleChange("anythingElse", e.target.value)}
                placeholder="Cualquier contexto adicional que nos ayude a preparar mejor la llamada..."
              />
            </div>
          </div>
        </>
      )}

      {/* Stage 5 */}
      {stage === 5 && (
        <>
          <h2 className={styles.stageTitle}>Tu contacto</h2>
          <p className={styles.stageSub}>
            ¿Cómo te avisamos cuando tu diagnóstico esté listo?
          </p>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                Tu nombre completo <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                type="text"
                className={styles.input}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                autoComplete="name"
              />
              {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="whatsapp">
                WhatsApp <span className={styles.required}>*</span>
              </label>
              <input
                id="whatsapp"
                type="tel"
                className={styles.input}
                value={form.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                autoComplete="tel"
              />
              {errors.whatsapp && <span className={styles.errorMsg}>{errors.whatsapp}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Correo electrónico <span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                autoComplete="email"
              />
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <fieldset>
                <legend className={styles.label}>¿Cómo prefieres que te contactemos?</legend>
                <div className={styles.radioGroup}>
                  {[
                    "WhatsApp (más rápido)",
                    "Llamada telefónica",
                    "Correo electrónico",
                    "Videollamada (Google Meet / Zoom)",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={styles.radioOption}
                      data-selected={form.contactPref === opt ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="contactPref"
                        value={opt}
                        checked={form.contactPref === opt}
                        onChange={() => handleChange("contactPref", opt)}
                        className={styles.hiddenInput}
                      />
                      <span
                        className={[
                          styles.radioCircle,
                          form.contactPref === opt ? styles.radioCircleSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Tier Selection */}
            <div className={styles.field}>
              <p className={styles.label}>
                Elige tu tipo de diagnóstico <span className={styles.required}>*</span>
              </p>
              <div className={styles.tierGrid}>
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={[
                      styles.tierCard,
                      form.tier === tier.id ? styles.tierCardSelected : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleChange("tier", tier.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={form.tier === tier.id}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleChange("tier", tier.id);
                      }
                    }}
                  >
                    {tier.recommended && (
                      <span className={styles.tierBadge}>Más popular</span>
                    )}
                    <p className={styles.tierName}>{tier.title}</p>
                    <p className={styles.tierPrice}>{tier.price}</p>
                    <p className={styles.tierDesc}>{tier.desc}</p>
                  </div>
                ))}
              </div>
              {errors.tier && <span className={styles.errorMsg}>{errors.tier}</span>}
            </div>
          </div>
        </>
      )}

      {/* Stage 6 */}
      {stage === 6 && (
        <>
          <h2 className={styles.stageTitle}>Confirmar</h2>
          <p className={styles.stageSub}>
            Revisa tu información antes de enviar.
          </p>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Empresa</p>
              <p className={styles.summaryValue}>
                {form.businessName} — {form.industry}
                {form.city ? `, ${form.city}` : ""}
              </p>
            </div>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Mayor dolor</p>
              <p className={styles.summaryValue}>
                {form.biggestWaste.length > 100
                  ? `${form.biggestWaste.slice(0, 100)}…`
                  : form.biggestWaste || "—"}
              </p>
            </div>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Presupuesto de automatización</p>
              <p className={styles.summaryValue}>{form.automationBudget || "—"}</p>
            </div>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Tipo de diagnóstico</p>
              <p className={styles.summaryValue}>
                {tiers.find((t) => t.id === form.tier)
                  ? `${tiers.find((t) => t.id === form.tier)!.title} — ${tiers.find((t) => t.id === form.tier)!.price}`
                  : "—"}
              </p>
            </div>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Contacto</p>
              <p className={styles.summaryValue}>
                {form.name}
                {form.whatsapp ? ` · ${form.whatsapp}` : ""}
                {form.email ? ` · ${form.email}` : ""}
              </p>
            </div>
          </div>

          <div className={styles.nav}>
            <button type="button" className={styles.backBtn} onClick={handleBack}>
              Regresar
            </button>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Enviando…" : "Pagar y Enviar"}
            </button>
          </div>
          <p className={styles.note}>
            Serás redirigido a Stripe para completar el pago de tu diagnóstico de forma segura.
          </p>
        </>
      )}

      {/* Navigation */}
      {stage < 6 && (
        <div className={styles.nav}>
          {stage > 1 && (
            <button type="button" className={styles.backBtn} onClick={handleBack}>
              Regresar
            </button>
          )}
          <button type="button" className={styles.nextBtn} onClick={handleNext}>
            {stage === 5 ? "Revisar resumen" : "Continuar"}
          </button>
        </div>
      )}
    </div>
  );
}
