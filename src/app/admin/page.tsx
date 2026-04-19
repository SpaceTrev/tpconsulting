import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — FAM Consulting",
  robots: "noindex, nofollow",
};

type DiagnosticRow = {
  id: string;
  created_at: string;
  contact_name: string;
  contact_email: string;
  business_name: string | null;
  industry: string | null;
  tier: string;
  urgency: string | null;
  lead_status: string;
};

type ContactRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string | null;
  industry: string | null;
  message: string | null;
  status: string;
};

function statusClass(status: string) {
  switch (status) {
    case "new": return styles.statusNew;
    case "contacted": return styles.statusContacted;
    case "diagnostic_scheduled": return styles.statusScheduled;
    case "client": return styles.statusClient;
    default: return styles.statusNew;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default async function AdminPage() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const [{ data: diagnostics }, { data: contacts }] = await Promise.all([
    supabaseAdmin
      .from("diagnostic_submissions")
      .select("id,created_at,contact_name,contact_email,business_name,industry,tier,urgency,lead_status")
      .order("created_at", { ascending: false })
      .limit(50),
    supabaseAdmin
      .from("contacts")
      .select("id,created_at,name,email,whatsapp,industry,message,status")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const diags = (diagnostics ?? []) as DiagnosticRow[];
  const ctcs = (contacts ?? []) as ContactRow[];

  const pipelineCounts = {
    new: diags.filter((d) => d.lead_status === "new").length,
    contacted: diags.filter((d) => d.lead_status === "contacted").length,
    diagnostic_scheduled: diags.filter((d) => d.lead_status === "diagnostic_scheduled").length,
    client: diags.filter((d) => d.lead_status === "client").length,
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Panel de Administración</h1>
          <span className={styles.badge}>FAM Consulting CRM</span>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{diags.length}</span>
            <span className={styles.statLabel}>Diagnósticos solicitados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{ctcs.length}</span>
            <span className={styles.statLabel}>Contactos recibidos</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{pipelineCounts.client}</span>
            <span className={styles.statLabel}>Clientes activos</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{diags.length + ctcs.length}</span>
            <span className={styles.statLabel}>Total leads</span>
          </div>
        </div>

        {/* Pipeline */}
        <div className={styles.pipelineRow}>
          {(["new","contacted","diagnostic_scheduled","client"] as const).map((s) => (
            <div key={s} className={styles.pipelineCard}>
              <span className={styles.pipelineStatus}>
                {s === "new" ? "Nuevo" : s === "contacted" ? "Contactado" : s === "diagnostic_scheduled" ? "Diagnóstico agendado" : "Cliente"}
              </span>
              <span className={styles.pipelineCount}>{pipelineCounts[s]}</span>
            </div>
          ))}
        </div>

        {/* Diagnostics table */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Diagnósticos recientes</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Empresa</th>
                  <th>Industria</th>
                  <th>Plan</th>
                  <th>Urgencia</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {diags.length === 0 ? (
                  <tr className={styles.emptyRow}><td colSpan={8}>Sin diagnósticos todavía</td></tr>
                ) : (
                  diags.map((d) => (
                    <tr key={d.id}>
                      <td>{formatDate(d.created_at)}</td>
                      <td>{d.contact_name}</td>
                      <td>{d.contact_email}</td>
                      <td>{d.business_name ?? "—"}</td>
                      <td>{d.industry ?? "—"}</td>
                      <td><span className={styles.tierTag}>{d.tier}</span></td>
                      <td>{d.urgency ?? "—"}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${statusClass(d.lead_status)}`}>
                          {d.lead_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Contacts table */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contactos recientes</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>WhatsApp</th>
                  <th>Industria</th>
                  <th>Mensaje</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ctcs.length === 0 ? (
                  <tr className={styles.emptyRow}><td colSpan={7}>Sin contactos todavía</td></tr>
                ) : (
                  ctcs.map((c) => (
                    <tr key={c.id}>
                      <td>{formatDate(c.created_at)}</td>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.whatsapp ?? "—"}</td>
                      <td>{c.industry ?? "—"}</td>
                      <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message ?? "—"}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${statusClass(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
