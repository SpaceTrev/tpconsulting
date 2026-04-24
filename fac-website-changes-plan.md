# thefac.co — Implementation Plan

Source of truth: `fac_website_changes.md` (uploaded 2026-04-23)
Target repo: `tpconsulting` (Next.js App Router, CSS modules)

## Overview

~30 discrete changes across 4 pages. They fall into 4 buckets with very different risk/effort profiles:

| Bucket | Count | Risk | Where |
|---|---|---|---|
| A. Copy / text swaps | ~18 | Low | Homepage, /servicios, /diagnostico, /contacto |
| B. Structural removals (sections, cards, bullets) | ~9 | Low–Med | Homepage (2 whole sections), /servicios, /contacto |
| C. External config (Cal.com) | 1 | Med — needs Trev action outside the repo | Cal.com event type |
| D. Form behavior changes + bug fix | 3 | High — DiagnosticForm rewrite required | `DiagnosticForm.tsx` |

Recommend doing them in that order: A → B → C → D. A+B land in a single PR. D probably wants its own PR so the form bug fix can be reviewed carefully.

---

## Phase 1 — Homepage copy & structure

File: `src/app/(marketing)/page.tsx`

### 1.1 Hero (Section 1)
- **Line 369–372** — H1: replace with *"La tecnología que impulsa a las grandes empresas, a la medida de tu negocio"*. Drop the `<em>` split since the new title doesn't have the "ahora para tu negocio" break (decide: keep the em tag on "a la medida de tu negocio" for visual consistency, or remove).
- **Line 373–375** — Subtitle: replace with *"La tecnología que mueve a Amazon, Starbucks y al Fortune 500, ahora al alcance de tu operación — a una fracción del costo."*
- **Line 377–379** — CTA button: replace "Diagnóstico desde $1,000 MXN" → *"Programa una consulta sin costo"*. Keep the `/diagnostico` href.

> ⚠️ Copy note: the new hero subtitle + CTA together create a softer "no-price" hook, but the `/diagnostico` page still prices tiers ($1k–$15k) and has "Diagnóstico" in the URL. Worth a follow-up decision (out of scope for this doc): do we rename the page, change the landing experience, or just accept the small narrative mismatch? Flagging for Trev.

### 1.2 "El proceso" eyebrow (Section 2)
- **Line 416** — Remove the `<span className={styles.eyebrow}>El proceso</span>`. Leave the h2 "Cómo funciona" and subtitle.

### 1.3 Services section (Section 3)
- **Line 455** — Remove `<span className={styles.eyebrow}>Servicios</span>`.
- **Line 456** — H2: replace with *"Construimos todo lo que necesitas para automatizar"*. (Primary choice per the doc; the alternative "De la estrategia a la ejecución…" is noted but I'd go with the first — more active.)
- **Lines 157–230 (const `services`)** — Trim from 8 entries to 4:
  1. **Diagnóstico Express** — update copy to: *"Identificamos en 48 horas exactamente qué procesos te están costando tiempo y dinero."* Drop the `price` field so the card doesn't show "$1,000 MXN" (check `ServiceCard` — may need a prop change).
  2. **Automatización de Procesos** — copy: *"Flujos automáticos conectados a las herramientas que ya usas, sin reemplazarlas."*
  3. **Agentes de IA** — copy: *"Asistentes inteligentes entrenados con el conocimiento de tu empresa para atender, cotizar y operar."*
  4. **Desarrollo a Medida** — copy: *"Software personalizado para los procesos que no encuentras en ningún producto del mercado."*
- Remove: Diagnóstico Profundo, Integración de Sistemas, Consultoría Estratégica, Soporte Técnico. (They still live on `/servicios` — fine.)

> ⚠️ `ServiceCard` component likely expects `price`. If dropping price for the homepage, either make `price` optional in the component or pass an empty string. Needs a 2-min check in `ServiceCard.tsx` before starting.

### 1.4 Soluciones section (Section 4)
- **Line 473** — Remove `<span className={styles.eyebrow}>Soluciones listas</span>`.
- **Lines 232–289 (const `solutions`)** — Trim from 8 → 4:
  1. **CRM Automatizado** (keep)
  2. **Pipeline de Cotizaciones** — change description to *"Genera cotizaciones profesionales desde WhatsApp en menos de 5 minutos."* (doc says "en menos de 5 minutos" — current says "en minutos")
  3. **Chatbot de Atención** — description: *"Responde preguntas frecuentes, toma pedidos y agenda citas las 24 horas."*
  4. **Gestión de Agenda Médica** (keep)
- Remove: Inventario, Nómina, Multi-canal, Reportes.

> Note: the doc's proposed copy for these cards doesn't include the `outcomes` metrics bullets we currently show. Decide: keep existing outcomes as-is (recommended — they're strong proof points), or strip them. Flagging for Trev; I'd keep them unless told otherwise.

### 1.5 Manifesto (Section 5)
- **Lines 496–501** — Replace quote body with: *"Automatización estratégica, impulsada por IA — diseñada para proteger tu tiempo y dinero, y dejar crecer el potencial de tu negocio."*
- Attribution line ("— La filosofía detrás de cada proyecto") — keep or drop? Doc says "tono de mantra, principio de empresa." I'd drop the attribution to make it feel more like a principle than a pull-quote.

### 1.6 Pricing section — open question
- Change doc says "REVISAR SECCIÓN 'ELIGE TU DIAGNÓSTICO'" but gives no instruction. **Action: ask Trev** — keep as-is, hide on homepage, or redesign?

### 1.7 Enterprise strip (Section 6)
- **Lines 525–536** — Remove entire `<div className={styles.enterpriseStrip}>` block.

### 1.8 "¿Por qué automatizar?" section
- **Lines 539–567** — Remove entire `<section className={styles.caseStudySection}>`. The stats bar at lines 389–410 keeps these numbers earlier in the page.

### 1.9 Final CTA
- **Lines 573–577** — Title: *"¿Listo para transformar tu operación?"*. Body: *"Cuéntanos qué proceso te está costando más tiempo o dinero — y en 48 horas te decimos exactamente cómo resolverlo."* Keep both buttons.

---

## Phase 2 — /servicios

File: `src/app/(marketing)/servicios/page.tsx`

- **Line 181** — Remove `<span className={styles.eyebrow}>Catálogo de servicios</span>`.
- **Lines 183–185** — Replace subtitle with: *"Sin soluciones genéricas. Cada servicio se adapta a tu operación y se mide por sus resultados reales."* (Going with the shorter alt — punchier.)
- **Line 78** — `desc` for Automatización de Procesos: drop the second sentence. New value: *"Implementación de flujos automatizados conectados a tus herramientas actuales."*

---

## Phase 3 — /diagnostico (page copy + sidebar)

File: `src/app/(marketing)/diagnostico/page.tsx`

- **Line 29** — Remove `<span className={styles.eyebrow}>Paso 1 — Agenda tu llamada</span>`.
- **Lines 31–33** — Replace subtitle with: *"30 minutos, sin costo. En esta sesión exploratoria revisamos tu operación actual, identificamos los procesos con mayor potencial de automatización y te presentamos un diagnóstico inicial honesto sobre cómo podemos generar impacto en tu negocio."*
- **Line 62** — Card title: *"¿En qué consiste la llamada?"*.
- **Line 68** — Remove the `<li>Si no, te lo decimos directo — sin rodeos</li>` bullet.
- **Line 72** — Card title: *"¿A quién va dirigido?"*.
- Bullets inside that card:
  1. *Pequeñas y Medianas empresas*
  2. *Emprendedores y dueños de negocios que operan con procesos manuales*
  3. *Freelancers que pierden tiempo en tareas repetitivas*
  4. *Negocios que buscan escalar su operación sin incrementar su personal*
  5. **ADD:** *Creadores de contenido y community managers que necesitan optimizar procesos manuales para dedicar más tiempo a la estrategia y la creatividad*

File: `src/components/CalEmbed/CalEmbed.tsx`

- **Line 89** — Fallback copy currently hardcodes "La llamada es de 15 minutos…". Update to *"30 minutos"* to match the new duration. (This only shows if `NEXT_PUBLIC_CAL_LINK` is unset, but still.)

---

## Phase 4 — /contacto

File: `src/app/(marketing)/contacto/page.tsx`

- **Line 21** — Remove `<span className={styles.eyebrow}>Contáctanos</span>`.
- **Line 41** — Remove the sentence *"Normalmente somos mucho más rápidos."*. Keep the 24-hour line.
- **Lines 81–82** — Change CalEmbed subtitle to: *"30 minutos, sin costo. Platicamos sobre tu operación y te decimos cómo podemos ayudarte."* (note: "cómo" not "si")
- **Line 87 onwards** — Remove the entire "¿Prefieres empezar con un diagnóstico?" side block. Confirm what fills that column afterward (may need layout tweak).

---

## Phase 5 — Cal.com configuration (outside the repo)

Not a code change. Needs Trev to log into Cal.com and:

1. Change the event type duration from 15 → 30 minutes.
2. Rename the visible label ("15 min meeting") so nothing on the booking widget says 15.
3. Verify `NEXT_PUBLIC_CAL_LINK` still points at the right event type (usually it does — duration is a property of the event type, not the URL).

> ⚠️ Blocker check: if Cal.com isn't updated before ship, `/diagnostico` and `/contacto` will copy-promise 30 min but the booking widget will still book 15 min slots. Schedule the Cal.com change first, then ship the code change same day.

---

## Phase 6 — /diagnostico form (DiagnosticForm.tsx)

File: `src/components/DiagnosticForm/DiagnosticForm.tsx`

### 6.1 Remove "Ciudad" field
- **Line 164** — Remove the Ciudad input. Also remove `city` from the form state interface and from any submission payload (grep `form.city`, `set("city"` to be sure you catch everything).

### 6.2 Remove "¿Por dónde llegan tus clientes?" section
- **Line 208** — Remove the full `<label>` + the checkbox group that follows it. Clean up its state key from the form interface too.

### 6.3 Update "¿Qué herramientas digitales usas actualmente?"
- **Line 278** — Change label text: `(selecciona todos)` → `(selecciona todas las que apliquen)`.
- **Line 280** — Add an "Otros" option to the array AND render a free-text input that appears when "Otros" is checked. Persist it as e.g. `other_tools: string` in form state.

### 6.4 Bug: "Inversión" step auto-submits
> The `fac_website_changes.md` doc reports: "Al llegar a la sección 'Inversión' el flujo salta automáticamente a 'Solicitud recibida' sin que el usuario complete ni envíe."

Investigation steps (before writing a fix):
1. Reproduce on a local `next dev` build. Click through stages until Inversión appears — confirm it auto-skips.
2. Read the stage advancement logic around `handleNext` (approx lines 99–100 per earlier scan) and any `useEffect` that reads current stage. Likely suspect: a `useEffect` fires submit when the active stage matches "Inversión" due to an off-by-one or dependency array issue, OR a form-level `onSubmit` bubbles from an Enter keypress inside an input on that stage.
3. Check whether the Inversión stage's "Next" button is accidentally `type="submit"` inside a form that wraps all stages.
4. Fix and add a minimal test or manual repro note in the PR description.

> Until this is diagnosed, treat the fix as an unknown-size task (est. 30 min – 2 hr). Don't bundle it with the low-risk copy PR.

### 6.5 Make form submission blocking for the calendar
> Doc: "Al hacer clic en cualquier bloque de horario disponible en el calendario, el formulario debe abrirse automáticamente antes de confirmar la cita. El usuario no debe poder completar la reservación sin antes llenar y enviar el formulario."

This is a bigger UX change than it looks — the current page has the form as an optional side widget. Options:

- **Option A (cleanest, more work):** Intercept clicks on the Cal embed iframe. Not reliably possible with a cross-origin iframe. So not this.
- **Option B (recommended):** Hide/disable the calendar until the form is submitted. Show the form first; on successful submit, reveal the calendar. This satisfies "el usuario no debe poder completar la reservación sin antes llenar y enviar el formulario."
- **Option C:** Keep calendar visible but route submission through our form before Cal. Use Cal.com's [prefill query params](https://cal.com/docs/enterprise-features/integrations) and our form's success handler to redirect to the Cal booking URL.

> ⚠️ Needs a product decision from Trev before coding. Recommend Option B for v1 — it's a 1–2 hr change versus Option C which requires Cal prefill integration.

---

## Open questions for Trev

1. **Hero narrative mismatch:** new CTA says "sin costo," but `/diagnostico` still has priced tiers ($1k–$15k). Keep, hide, or restructure pricing?
2. **Homepage pricing section** ("Elige tu diagnóstico"): doc just says "REVISAR." Keep, hide, edit?
3. **Solution card outcome bullets** on homepage (e.g. "-40% roturas de stock"): keep or strip per new copy?
4. **Manifesto attribution line:** drop "— La filosofía detrás de cada proyecto" or keep?
5. **Calendar gating UX** (Phase 6.5): confirm Option B is acceptable, or spec a different flow.
6. **Cal.com access:** who updates the event type from 15 → 30? Me via request, or you direct in the Cal dashboard?

---

## Suggested PR breakdown

- **PR 1** — Homepage + /servicios + /contacto copy and structural changes (Phases 1, 2, 4). Safest, biggest visual impact, no form risk.
- **PR 2** — /diagnostico page copy + CalEmbed fallback copy + Ciudad/Canales field removal (Phase 3 + 6.1 + 6.2). Small, safe.
- **PR 3** — "Otros" tools free-text field (Phase 6.3).
- **PR 4** — Inversión bug fix (Phase 6.4). Its own PR with repro notes.
- **PR 5** — Calendar gating behind form submission (Phase 6.5), once Option B is confirmed.
- **Cal.com dashboard** — 15 → 30 min. Done in parallel with PR 2.

Estimated total dev effort: 4–7 hours of focused work, excluding the Inversión bug which could inflate if root cause is non-obvious.
