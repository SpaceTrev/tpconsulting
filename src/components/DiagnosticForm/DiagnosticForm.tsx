"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import styles from "./DiagnosticForm.module.css";

/* ── Types ─────────────────────────────────────────────────── */
interface FormData {
  // Stage 1
  business_name: string;
  industry: string;
  city: string;
  employees: string;
  business_age: string;
  // Stage 2
  customer_channels: string[];
  first_contact_process: string;
  response_time: string;
  client_data_mgmt: string;
  cfdi_status: string;
  google_business: string;
  current_tools: string[];
  current_tech_spend: string;
  // Stage 3
  biggest_time_waste: string;
  one_thing_to_automate: string;
  past_automation: string;
  past_automation_detail: string;
  losing_customers_how: string[];
  urgency: string;
  additional_notes: string;
  // Stage 4
  automation_budget: string;
  monthly_revenue: string;
  tier: string;
  contact_name: string;
  contact_whatsapp: string;
  contact_email: string;
  contact_preference: string;
}

const initial: FormData = {
  business_name: "", industry: "", city: "", employees: "", business_age: "",
  customer_channels: [], first_contact_process: "", response_time: "",
  client_data_mgmt: "", cfdi_status: "", google_business: "",
  current_tools: [], current_tech_spend: "",
  biggest_time_waste: "", one_thing_to_automate: "", past_automation: "",
  past_automation_detail: "", losing_customers_how: [], urgency: "",
  additional_notes: "", automation_budget: "", monthly_revenue: "",
  tier: "", contact_name: "", contact_whatsapp: "", contact_email: "",
  contact_preference: "",
};

const STAGES = ["Tu Negocio", "Tu Operación", "Tu Mayor Dolor", "Inversión"];

const TIER_OPTIONS = [
  { value: "explorador", label: "Explorador", price: "$1,000 MXN", desc: "Diagnóstico Express 48hrs" },
  { value: "estudio", label: "Estudio", price: "$5,000 MXN", desc: "Diagnóstico Profundo + Roadmap" },
  { value: "transformacion", label: "Transformación", price: "$10,000 MXN", desc: "Diagnóstico + 1 Automatización implementada", popular: true },
  { value: "empresa", label: "Empresa", price: "$15,000 MXN", desc: "Diagnóstico + 3 Automatizaciones integradas" },
];

/* ── Helpers ───────────────────────────────────────────────── */
function toggleArray(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

/* ── Component ─────────────────────────────────────────────── */
export default function DiagnosticForm({ initialTier = "" }: { initialTier?: string }) {
  const [stage, setStage] = useState(0);
  const [form, setForm] = useState<FormData>({ ...initial, tier: initialTier });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  function setArr(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: toggleArray(prev[field] as string[], value) }));
  }
  function checked(field: keyof FormData, value: string) {
    return (form[field] as string[]).includes(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const client = getSupabase();
    if (!client) { setStatus("error"); setErrorMsg("Supabase no configurado."); return; }
    const { error } = await client.from("diagnostic_submissions").insert([form]);
    if (error) {
      setStatus("error");
      setErrorMsg("Hubo un error al enviar tu solicitud. Intenta de nuevo.");
    } else {
      setStatus("success");
    }
  }

  const handleNext = () => {
    setStage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStage((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (status === "success") {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon} aria-hidden="true">✓</span>
        <h2 className={styles.successTitle}>¡Solicitud recibida!</h2>
        <p className={styles.successBody}>
          Nos pondremos en contacto contigo en menos de 24 horas para agendar tu diagnóstico.
          Revisa tu WhatsApp y correo.
        </p>
        <p className={styles.successTier}>Plan seleccionado: <strong>{form.tier}</strong></p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Progress bar */}
      <div className={styles.progress} role="navigation" aria-label="Etapas del formulario">
        {STAGES.map((label, i) => (
          <div
            key={label}
            className={`${styles.progressStep} ${i === stage ? styles.progressActive : ""} ${i < stage ? styles.progressDone : ""}`}
          >
            <span className={styles.progressDot} aria-hidden="true">{i < stage ? "✓" : i + 1}</span>
            <span className={styles.progressLabel}>{label}</span>
          </div>
        ))}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${((stage) / (STAGES.length - 1)) * 100}%` }} />
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        {/* ── Stage 1: Tu Negocio ── */}
        {stage === 0 && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Cuéntanos sobre tu negocio</legend>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre de tu empresa <span aria-hidden="true">*</span></label>
                <input className={styles.input} type="text" value={form.business_name} onChange={(e) => set("business_name", e.target.value)} placeholder="Ej: Distribuidora López S.A." required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Ciudad <span aria-hidden="true">*</span></label>
                <input className={styles.input} type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Ej: Guadalajara, CDMX" required />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Industria <span aria-hidden="true">*</span></label>
                <select className={styles.select} value={form.industry} onChange={(e) => set("industry", e.target.value)} required>
                  <option value="">Selecciona tu industria</option>
                  {["Manufactura","Retail / Comercio","Logística y distribución","Servicios profesionales","Construcción","Alimentos y bebidas","Salud","Educación","Inmobiliario","E-commerce","Otro"].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>¿Cuántos empleados tiene tu empresa?</label>
                <select className={styles.select} value={form.employees} onChange={(e) => set("employees", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="1-5">1 – 5 personas</option>
                  <option value="6-20">6 – 20 personas</option>
                  <option value="21-50">21 – 50 personas</option>
                  <option value="51-200">51 – 200 personas</option>
                  <option value="200+">Más de 200 personas</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>¿Cuántos años lleva operando tu empresa?</label>
              <select className={styles.select} value={form.business_age} onChange={(e) => set("business_age", e.target.value)}>
                <option value="">Selecciona</option>
                <option value="menos-1">Menos de 1 año</option>
                <option value="1-3">1 – 3 años</option>
                <option value="4-10">4 – 10 años</option>
                <option value="11-20">11 – 20 años</option>
                <option value="20+">Más de 20 años</option>
              </select>
            </div>
          </fieldset>
        )}

        {/* ── Stage 2: Tu Operación ── */}
        {stage === 1 && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Cuéntanos cómo opera tu negocio</legend>
            <div className={styles.field}>
              <label className={styles.label}>¿Por dónde llegan tus clientes? (selecciona todos)</label>
              <div className={styles.checkGrid}>
                {["WhatsApp","Redes sociales (Instagram/Facebook)","Google","Referidos / boca a boca","Mercado Libre / Amazon","Shopify / Tienda online","Llamada telefónica","Físico / tienda"].map((opt) => (
                  <label key={opt} className={styles.checkLabel}>
                    <input type="checkbox" checked={checked("customer_channels", opt)} onChange={() => setArr("customer_channels", opt)} className={styles.checkbox} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>¿Cómo es tu primer contacto con un cliente nuevo?</label>
                <select className={styles.select} value={form.first_contact_process} onChange={(e) => set("first_contact_process", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="manual-whatsapp">Manual por WhatsApp</option>
                  <option value="manual-llamada">Manual por llamada</option>
                  <option value="formulario-web">Formulario en web</option>
                  <option value="semi-automatizado">Semi-automatizado</option>
                  <option value="completamente-automatizado">Completamente automatizado</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>¿En cuánto tiempo respondes a prospectos?</label>
                <select className={styles.select} value={form.response_time} onChange={(e) => set("response_time", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="menos-1hr">Menos de 1 hora</option>
                  <option value="1-4hrs">1 – 4 horas</option>
                  <option value="4-24hrs">4 – 24 horas</option>
                  <option value="mas-24hrs">Más de 24 horas</option>
                  <option value="no-respondo">A veces no respondo</option>
                </select>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>¿Cómo manejas los datos de tus clientes?</label>
                <select className={styles.select} value={form.client_data_mgmt} onChange={(e) => set("client_data_mgmt", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="excel-sheets">Excel o Google Sheets</option>
                  <option value="crm">CRM (HubSpot, Salesforce, etc.)</option>
                  <option value="whatsapp">Solo en WhatsApp</option>
                  <option value="papel">En papel / agenda</option>
                  <option value="ninguno">No tengo un sistema</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>¿Cómo emites facturas (CFDI)?</label>
                <select className={styles.select} value={form.cfdi_status} onChange={(e) => set("cfdi_status", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="no-facturo">No facturo</option>
                  <option value="manual-contador">Manual con contador</option>
                  <option value="software">Software (CONTPAQi, Facturapi, etc.)</option>
                  <option value="automatizado">Automatizado con mi sistema</option>
                </select>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>¿Tu Google My Business está actualizado?</label>
                <select className={styles.select} value={form.google_business} onChange={(e) => set("google_business", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="no-tengo">No tengo</option>
                  <option value="desactualizado">Tengo pero está desactualizado</option>
                  <option value="actualizado">Sí, está actualizado</option>
                  <option value="optimizado">Optimizado con fotos y reseñas</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>¿Qué herramientas digitales usas actualmente? (selecciona todos)</label>
              <div className={styles.checkGrid}>
                {["Excel / Google Sheets","WhatsApp Business","QuickBooks","CONTPAQi","Shopify","Mercado Libre","WordPress","HubSpot","Notion","Slack","Ninguna"].map((opt) => (
                  <label key={opt} className={styles.checkLabel}>
                    <input type="checkbox" checked={checked("current_tools", opt)} onChange={() => setArr("current_tools", opt)} className={styles.checkbox} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>¿Cuánto gastas mensualmente en software/tecnología?</label>
              <select className={styles.select} value={form.current_tech_spend} onChange={(e) => set("current_tech_spend", e.target.value)}>
                <option value="">Selecciona</option>
                <option value="0">$0 (nada)</option>
                <option value="menos-500">Menos de $500 MXN</option>
                <option value="500-2000">$500 – $2,000 MXN</option>
                <option value="2000-5000">$2,000 – $5,000 MXN</option>
                <option value="5000+">Más de $5,000 MXN</option>
              </select>
            </div>
          </fieldset>
        )}

        {/* ── Stage 3: Tu Mayor Dolor ── */}
        {stage === 2 && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>¿Qué te está costando más tiempo y dinero?</legend>
            <div className={styles.field}>
              <label className={styles.label}>¿Cuál es tu mayor pérdida de tiempo operativa? <span aria-hidden="true">*</span></label>
              <textarea
                className={styles.textarea}
                value={form.biggest_time_waste}
                onChange={(e) => set("biggest_time_waste", e.target.value)}
                rows={3}
                placeholder="Ej: Responder los mismos mensajes de WhatsApp 20 veces al día..."
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Si pudieras automatizar UNA sola cosa en tu negocio, ¿qué sería? <span aria-hidden="true">*</span></label>
              <textarea
                className={styles.textarea}
                value={form.one_thing_to_automate}
                onChange={(e) => set("one_thing_to_automate", e.target.value)}
                rows={3}
                placeholder="Ej: El seguimiento de cotizaciones que se quedan sin respuesta..."
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>¿Cómo estás perdiendo clientes hoy? (selecciona todos)</label>
              <div className={styles.checkGrid}>
                {["Respondo muy tarde","No doy seguimiento a prospectos","Mi proceso de cotización es lento","No tengo presencia en redes","Errores en pedidos/entregas","Clientes sin soporte post-venta","No pido reseñas o referidos"].map((opt) => (
                  <label key={opt} className={styles.checkLabel}>
                    <input type="checkbox" checked={checked("losing_customers_how", opt)} onChange={() => setArr("losing_customers_how", opt)} className={styles.checkbox} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>¿Has intentado automatizar algo antes?</label>
                <select className={styles.select} value={form.past_automation} onChange={(e) => set("past_automation", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="no">No, es la primera vez</option>
                  <option value="si-funciona">Sí, y funciona bien</option>
                  <option value="si-fallo">Sí, pero no funcionó</option>
                  <option value="si-parcial">Sí, pero solo a medias</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>¿Con qué urgencia necesitas resolver esto?</label>
                <select className={styles.select} value={form.urgency} onChange={(e) => set("urgency", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="urgente">Urgente – lo necesito ya</option>
                  <option value="1-mes">En el próximo mes</option>
                  <option value="3-meses">En los próximos 3 meses</option>
                  <option value="6-meses">Estoy explorando opciones</option>
                </select>
              </div>
            </div>
            {form.past_automation && form.past_automation !== "no" && (
              <div className={styles.field}>
                <label className={styles.label}>¿Qué herramienta o método usaste?</label>
                <input className={styles.input} type="text" value={form.past_automation_detail} onChange={(e) => set("past_automation_detail", e.target.value)} placeholder="Ej: Zapier, un freelancer, una agencia..." />
              </div>
            )}
            <div className={styles.field}>
              <label className={styles.label}>¿Algo más que debamos saber? (opcional)</label>
              <textarea className={styles.textarea} value={form.additional_notes} onChange={(e) => set("additional_notes", e.target.value)} rows={3} placeholder="Cualquier contexto adicional que consideres relevante..." />
            </div>
          </fieldset>
        )}

        {/* ── Stage 4: Inversión ── */}
        {stage === 3 && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Elige tu plan y datos de contacto</legend>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Facturación mensual aproximada</label>
                <select className={styles.select} value={form.monthly_revenue} onChange={(e) => set("monthly_revenue", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="menos-100k">Menos de $100,000 MXN</option>
                  <option value="100k-500k">$100,000 – $500,000 MXN</option>
                  <option value="500k-1m">$500,000 – $1M MXN</option>
                  <option value="1m-5m">$1M – $5M MXN</option>
                  <option value="5m+">Más de $5M MXN</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Presupuesto disponible para automatización</label>
                <select className={styles.select} value={form.automation_budget} onChange={(e) => set("automation_budget", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="hasta-5k">Hasta $5,000 MXN</option>
                  <option value="5k-15k">$5,000 – $15,000 MXN</option>
                  <option value="15k-50k">$15,000 – $50,000 MXN</option>
                  <option value="50k+">Más de $50,000 MXN</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Selecciona tu plan <span aria-hidden="true">*</span></label>
              <div className={styles.tierGrid}>
                {TIER_OPTIONS.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    className={`${styles.tierCard} ${form.tier === t.value ? styles.tierSelected : ""}`}
                    onClick={() => set("tier", t.value)}
                    aria-pressed={form.tier === t.value}
                  >
                    {t.popular && <span className={styles.tierBadge}>Más popular</span>}
                    <span className={styles.tierName}>{t.label}</span>
                    <span className={styles.tierPrice}>{t.price}</span>
                    <span className={styles.tierDesc}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre completo <span aria-hidden="true">*</span></label>
                <input className={styles.input} type="text" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} placeholder="Ana García" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>WhatsApp <span aria-hidden="true">*</span></label>
                <input className={styles.input} type="tel" value={form.contact_whatsapp} onChange={(e) => set("contact_whatsapp", e.target.value)} placeholder="+52 33 1234 5678" required />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Correo electrónico <span aria-hidden="true">*</span></label>
                <input className={styles.input} type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} placeholder="ana@miempresa.com" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>¿Cómo prefieres que te contactemos?</label>
                <select className={styles.select} value={form.contact_preference} onChange={(e) => set("contact_preference", e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Correo electrónico</option>
                  <option value="llamada">Llamada telefónica</option>
                  <option value="videollamada">Videollamada (Zoom/Meet)</option>
                </select>
              </div>
            </div>

            {status === "error" && (
              <p className={styles.errorMsg} role="alert">{errorMsg}</p>
            )}
          </fieldset>
        )}

        {/* ── Navigation ── */}
        <div className={styles.navBtns}>
          {stage > 0 && (
            <button type="button" className={styles.btnBack} onClick={() => setStage((s) => s - 1)}>
              ← Anterior
            </button>
          )}
          {stage < STAGES.length - 1 ? (
            <button
              type="button"
              className={styles.btnNext}
              onClick={() => setStage((s) => s + 1)}
              disabled={
                (stage === 0 && (!form.business_name || !form.industry || !form.city)) ||
                (stage === 2 && (!form.biggest_time_waste || !form.one_thing_to_automate))
              }
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={status === "loading" || !form.tier || !form.contact_name || !form.contact_whatsapp || !form.contact_email}
            >
              {status === "loading" ? "Enviando..." : "Enviar solicitud de diagnóstico"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
