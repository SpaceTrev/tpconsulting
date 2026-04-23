# FAC (thefac.co) — Task Audit & Recovery Prompts

**Generated:** April 22, 2026  
**Source:** Full conversation history Apr 7-22 + live Supabase schema audit  
**v3** — verified against actual database state

---

## Actual Supabase Schema (verified just now)

**Tables that EXIST:** system_state, agent_status, model_status, commands, diagnostic_submissions, contacts, leads

**Tables the code references but DON'T EXIST:** clients, projects, automation_catalog, deployed_automations, upsells

**Leads table actual columns:** id, created_at, updated_at, contact_name, contact_email, contact_whatsapp, industry, source, status, diagnostic_id, notes, assigned_to

**Leads columns the code expects but DON'T EXIST:** lead_source, estimated_price, quote_sent_date, close_date, close_reason, lead_score, next_action, next_action_date, revenue_estimate

**The 'assignee' bug:** createLead() uses 'assignee' — the actual column is 'assigned_to'

---

## What's LIVE and Working

- Marketing site at thefac.co (Next.js 15, CSS Modules, Vercel, auto-deploy from GitHub main)
- Design system "The Intellectual Kinetic" (Solarized Light + terracotta, built via Claude Design)
- Admin dashboard at /admin with sidebar, KPI cards, pipeline view (mock data)
- Supabase auth gate (trevbdev@gmail.com + pabstrada@gmail.com in ALLOWED_EMAILS)
- Route group structure ((marketing) vs /admin) — nav/footer isolation
- Dark/light theme toggle
- DiagnosticForm (6-stage progressive)
- WhatsApp floating button with real numbers (+13038299013 Trev, +52 2281773964 Pablo)
- Domain thefac.co on Namecheap, pointed to Vercel
- Cal.com API key exists (cal_live_1b8a464f9100e025f4b5f6018bf04b09) but embed not wired

## What's BROKEN on Production

1. "Nuevo Lead" button → "Error al guardar el lead" — createLead() uses 'assignee', actual column is 'assigned_to'
2. Calendar embed on /diagnostico shows WhatsApp fallback — NEXT_PUBLIC_CAL_LINK env var not set on Vercel
3. Diagnostico page may show form before calendar (regression from parallel PR merges)
4. Supabase 404s — admin code references 5 tables that don't exist (clients, projects, automation_catalog, deployed_automations, upsells)
5. Supabase 400s — code references RevOps columns on leads table that were never added
6. WebSocket/realtime connections failing (possible API key encoding issue)
7. Pablo's Supabase auth account — may not exist (service role key format issue during creation attempt)

## What was NEVER Finished

1. English version with US pricing ($500 / $2.5K / $7.5K / $20K analysis tiers)
2. Email forwarding (hola@thefac.co → trevbdev@gmail.com) — Namecheap
3. Pedro Zalpa's custom intake form at /diagnostico/pedro-zalpa
4. Projects page, Automations page, Orchestration tab — built with mock data, not wired to real DB (tables don't even exist yet)
5. Admin mobile responsiveness refinements
6. Blog page (stub only)
7. Fake testimonials still on site — Trev said remove them
8. Casos de Éxito page still in main nav — Trev said hide until real case studies exist
9. Services pricing shows fixed prices — should say "A cotizar" for implementation (only analysis tiers get fixed prices)
10. Trevor's bio needs rework — pitch as high-level expert, not employee-of-the-month vibes
11. Enterprise section missing — Trev wants a callout for large businesses
12. Integrations list on /soluciones too short — needs expanding
13. Consulting Playbook doc outdated (still says "FAM", missing 2 weeks of strategic decisions)
14. Claude Design prompt for admin tabs (Projects/Automations/Orchestration) — ran out of Design credits, waiting for reset
15. User profile concept in admin — no user indicator when logged in
16. Linear ticket planning for FAC consulting

**Separate projects (not tpconsulting):**
17. Trading indicator v5.1 Pine errors — box.set_border_style fixed but Trev reported still broken
18. Campermind interview reply (Gmail, Apr 16) — status unknown
19. Full trade history analysis across all eval accounts
20. SteveWillDoIt brand strategy side mission — uploaded but purpose unclear

---

## Recovery Prompts

Each prompt is self-contained. Fire them one at a time in Cowork or Claude Code. Verify on production before moving to the next.

---

### PROMPT 1: Fix Supabase Schema (do this first — everything depends on it)

```
REPO: SpaceTrev/tpconsulting
SUPABASE PROJECT: qsdtnnutusvkgnvnubxd

TASK: Fix all Supabase schema mismatches so the admin dashboard stops erroring.

VERIFIED CURRENT STATE (as of Apr 22):
Tables that exist: system_state, agent_status, model_status, commands, diagnostic_submissions, contacts, leads
Tables that DON'T exist but code references: clients, projects, automation_catalog, deployed_automations, upsells

The leads table has these columns: id, created_at, updated_at, contact_name, contact_email, contact_whatsapp, industry, source, status, diagnostic_id, notes, assigned_to
The code expects additional columns that don't exist: lead_source, estimated_price, quote_sent_date, close_date, close_reason, lead_score, next_action, next_action_date, revenue_estimate

STEPS:
1. Read src/lib/admin-queries.ts to find every Supabase query and what tables/columns they reference
2. Read any migration files in supabase/migrations/ — they were generated but never run
3. Create ONE migration that:
   a. Adds missing columns to leads table (lead_source, estimated_price, etc.)
   b. Creates clients table
   c. Creates projects table  
   d. Creates automation_catalog table
   e. Creates deployed_automations table
   f. Creates upsells table
   g. Sets up RLS policies (public can insert diagnostic_submissions and contacts; authenticated can do everything)
4. Run the migration against Supabase project qsdtnnutusvkgnvnubxd
5. Fix createLead() in admin-queries.ts: change 'assignee' to 'assigned_to'
6. Verify every admin page loads without 404/400 errors
7. Commit, PR, merge. Verify on thefac.co/admin.

DO NOT add new features. Only fix schema mismatches and the column name bug.
```

---

### PROMPT 2: Fix Diagnostico Page (Calendar + Form Order)

```
REPO: SpaceTrev/tpconsulting

TASK: Fix /diagnostico so it works correctly on production.

Requirements:
1. Calendar/booking CTA must appear FIRST (above the fold)
2. The diagnostic form should be COLLAPSED below, optional
3. If NEXT_PUBLIC_CAL_LINK env var is not set, show a polished WhatsApp booking CTA — not a broken placeholder

Steps:
1. Read src/app/(marketing)/diagnostico/page.tsx
2. Verify component order: CalEmbed (or WhatsApp CTA) FIRST → CollapsibleForm below
3. If form appears first, fix the order
4. The Cal.com API key is cal_live_1b8a464f9100e025f4b5f6018bf04b09 but we need the actual BOOKING PAGE URL (like cal.com/thefac/consulta). If no booking URL is configured in Cal.com yet, make the WhatsApp CTA the primary experience and make it look intentional.
5. If you can set NEXT_PUBLIC_CAL_LINK on Vercel, do it. Otherwise note what Trev needs to do.

Commit, PR, merge, verify on thefac.co/diagnostico.
```

---

### PROMPT 3: Fix Admin "Nuevo Lead" Button

```
REPO: SpaceTrev/tpconsulting

TASK: Fix the "Nuevo Lead" modal. It shows "Error al guardar el lead."

Root cause: createLead() in src/lib/admin-queries.ts uses 'assignee' but the actual Supabase column is 'assigned_to'.

Steps:
1. In src/lib/admin-queries.ts, find createLead() and change 'assignee' to 'assigned_to'
2. Check every field in the insert — make sure each maps to a real column in the leads table
3. The leads table columns are: id, created_at, updated_at, contact_name, contact_email, contact_whatsapp, industry, source, status, diagnostic_id, notes, assigned_to
4. If the insert references columns that don't exist yet (like revenue_estimate), either remove them or run Prompt 1 first
5. Test creating a lead through the modal
6. Commit, PR, merge, verify on production

NOTE: Best to run Prompt 1 first so all columns exist.
```

---

### PROMPT 4: Verify Pablo's Login

```
REPO: SpaceTrev/tpconsulting  
SUPABASE PROJECT: qsdtnnutusvkgnvnubxd

TASK: Make sure Pablo can log into thefac.co/admin.

1. Confirm 'pabstrada@gmail.com' is in ALLOWED_EMAILS in src/app/admin/layout.tsx
2. Check if a Supabase auth user exists for pabstrada@gmail.com (use Supabase admin API or dashboard)
3. If not, create one. Set a temporary password and tell Trev to share it with Pablo.
4. Test the login at thefac.co/admin

Pablo: pabstrada@gmail.com / +52 2281773964
```

---

### PROMPT 5: Admin UI Polish (Dark Mode + Z-index + Mobile)

```
REPO: SpaceTrev/tpconsulting

TASK: Fix visual bugs in admin dashboard.

Known issues (from Trev's screenshots Apr 21):
1. Dark mode — hardcoded colors that don't adapt. All colors must use CSS custom properties from data-theme.
2. Top bar has visual glitches/overlaps
3. Drawer close (X) button blocked by nav z-index — drawers need z-index 1000+
4. Mobile: sidebar should collapse to hamburger
5. Confirm marketing Nav/Footer do NOT appear on /admin routes

Steps:
1. Audit src/app/admin/layout.tsx — no Nav/Footer imports from marketing
2. Fix z-index: drawers > topbar > sidebar
3. Replace any hardcoded colors with var(--bg-canvas), var(--fg-1), etc.
4. Test dark mode on every admin page
5. Test at 375px viewport width

Commit, PR, merge, verify.
```

---

### PROMPT 6: Wire Admin to Real Supabase Data

```
REPO: SpaceTrev/tpconsulting
SUPABASE PROJECT: qsdtnnutusvkgnvnubxd

TASK: Replace mock data with real Supabase queries in admin pages.

Currently all admin pages import mock data from src/lib/admin-data.ts. Wire to real tables.

Pages:
1. /admin (Overview) — real counts from leads, contacts, diagnostic_submissions
2. /admin/diagnosticos — real diagnostic_submissions
3. /admin/leads — real leads table
4. /admin/contactos — real contacts table
5. /admin/projects — real projects table (must exist — run Prompt 1 first)
6. /admin/automations — real automation_catalog + deployed_automations (must exist)

Rules:
- Use lazy Supabase client pattern from src/lib/supabase.ts
- export const dynamic = 'force-dynamic' on every admin page (prevents Vercel prerender crash)
- Handle empty state gracefully ("No hay datos aún" not error screens)
- Keep existing UI exactly as-is

Prerequisite: Prompt 1 must be done first.
Commit, PR, merge, verify.
```

---

### PROMPT 7: Marketing Site Content Fixes

```
REPO: SpaceTrev/tpconsulting

TASK: Fix content that Trev flagged on the marketing site.

1. REMOVE fake testimonials — replace with real stats about automation potential
2. HIDE Casos de Éxito from main nav — keep route in footer. Mark Airbnb case as "Caso piloto"
3. FIX services pricing — implementation = "A cotizar" (no fixed prices). Only diagnostic analysis keeps fixed tiers: $1K / $5K / $10K / $15K MXN
4. FIX Trevor's bio — pitch as expert: "Casi una década diseñando sistemas de automatización y arquitectura de software para empresas Fortune 500 — actualmente Starbucks." No employee-of-the-month, no Amazon.
5. ADD enterprise callout: "¿Empresa grande? Contáctanos para soluciones enterprise a medida."
6. EXPAND /soluciones integrations list — add: CFDI/SAT, SPEI payments, iCal sync, Google Sheets, Mercado Pago, Stripe, Meta Ads, SEO reporting

Commit, PR, merge, verify.
```

---

### PROMPT 8: Fix WebSocket / Realtime

```
REPO: SpaceTrev/tpconsulting

TASK: Fix or remove failing Supabase realtime subscriptions.

Admin pages have WebSocket subscriptions that fail. Likely causes:
1. API key encoding issue in env vars (whitespace/newline)
2. Realtime not enabled on tables
3. Client misconfigured

Quick fix option: if realtime isn't critical right now, remove subscriptions and use manual refresh. The admin is Trevor + Pablo only — they can click refresh.

If keeping realtime:
1. Check Vercel env vars for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY — trim whitespace
2. Supabase project: qsdtnnutusvkgnvnubxd
3. Enable realtime on leads and diagnostic_submissions tables
4. Test locally

Commit, PR, merge, verify.
```

---

### PROMPT 9: Pedro Zalpa Custom Intake Form

```
REPO: SpaceTrev/tpconsulting

TASK: Build Pedro's personalized intake form at /diagnostico/pedro-zalpa

Pedro is a close friend, prospective Creator-Operator tier client:
- Zamgüis (sandwichería/restaurant, 3 locations: GDL, Cabo, Zamora)
- Food/travel creator brand (13K followers)
- Brand deals
- Possibly a lab business

The form should:
1. Be at /diagnostico/pedro-zalpa with a polished multi-step UI
2. Pre-fill known info (Zamgüis, 3 locations)
3. 8-12 questions: businesses, team size, tools, pain points, revenue, content workflow, time drains
4. Use IK design system (CSS Modules, terracotta, tonal nesting — no Tailwind)
5. On submit → save to Supabase diagnostic_submissions table
6. Notify Trevor (webhook or email)

A placeholder may exist at src/components/intakes/PedroZalpaForm.tsx. Build the real version.

Commit, PR, merge, verify.
```

---

### PROMPT 10: English Version with US Pricing

```
REPO: SpaceTrev/tpconsulting

TASK: Add English language support with US pricing.

1. Install next-intl for i18n
2. Create messages/es.json and messages/en.json
3. Add language switcher to Nav
4. Default locale: es

US pricing:
- Diagnostic analysis: $500 / $2,500 / $7,500 / $20,000 USD
- Implementation: "Contact for quote"
- Subscriptions: proportional from MXN

Translate all marketing pages. Admin stays Spanish.
Keep exact same design — only text and prices change.

Commit, PR, merge, verify both locales work.
```

---

### PROMPT 11: Seed Automation Catalog

```
SUPABASE PROJECT: qsdtnnutusvkgnvnubxd

TASK: Seed automation_catalog with 10+ starter automations.

Prerequisite: Prompt 1 must be done (table must exist).

Automations:
1. WhatsApp Business Bot
2. CFDI/SAT Invoice Automation
3. Google Reviews Response Bot
4. CRM Setup & Pipeline
5. Appointment Booking System
6. Social Media Auto-posting
7. Email Drip Sequences
8. Airbnb Host Lead Generation
9. Inventory/Menu Management
10. Executive Dashboard

Each row: name, description, category, estimated_hours, base_price_mxn, complexity, status.

Run the INSERT SQL directly against Supabase.
```

---

### PROMPT 12: Email Forwarding (Manual)

```
TASK: Set up email forwarding for thefac.co.

Domain registrar: Namecheap
Goal: hola@thefac.co → trevbdev@gmail.com, pablo@thefac.co → pabstrada@gmail.com

This requires logging into Namecheap dashboard. Provide step-by-step instructions for Trev to follow, or use computer-use tools if Namecheap is open.
```

---

### PROMPT 13: Update Consulting Playbook

```
TASK: Create an updated FAC Consulting Playbook document (.docx).

The old doc was called "FAM-Master-Plan-Consulting-Playbook.docx" and is outdated (still says FAM, missing 2 weeks of decisions).

Must include:
- Brand: FAC (Flywheel Automation Consulting) at thefac.co
- Three-layer architecture: Public → Admin → Orchestration
- Modular Bottleneck Framework (Escuchar → Rankear → Proponer → Medir → Expandir)
- Engagement Ladder: Quick Win ($15-25K) → Traction ($40-60K) → System ($100-150K) → Partnership ($20-35K/mo)
- Client tiers: Main Street vs Creator-Operator
- Diagnostic pricing: $1K / $5K / $10K / $15K MXN (US: $500-$20K)
- Subscription model: $1.8K / $2.5K / $3.5K MXN/mo
- Automation Catalog flywheel model
- Clients: Rubén (Airbnb cleaning GDL), Pedro Zalpa (Zamgüis)
- Dynamic intake forms per prospect
- Tech stack: Next.js 15, CSS Modules, Supabase, Vercel, Cal.com
- Co-founders: Trevor Benavides + Pablo Estrada
- Philosophy and the consulting-first → library compounds → enterprise self-serve model

Professional formatting. Save as .docx.
```

---

### PROMPT 14: Admin User Profile

```
REPO: SpaceTrev/tpconsulting

TASK: Add basic user profile to admin.

1. User initials/avatar in top bar from Supabase auth
2. Dropdown: email, sign out
3. Optional: /admin/profile page

IK design system. CSS Modules. No Tailwind.
Commit, PR, merge, verify.
```

---

### PROMPT 15 (separate project): Trading Indicator Fixes

```
REPO: SpaceTrev/space-trading

The SMC Killzones indicator (indicators/smc-killzones-v5.1.pine) has Pine v6 errors.
box.set_border_style() was fixed (commit 799163a) but Trev said it still doesn't compile.

Read the full source. Identify any remaining Pine v6 issues.
If errors aren't obvious from code, ask Trev for TradingView error screenshots.

Fix, commit, PR.
```

---

### PROMPT 16 (separate): Campermind Interview

```
Check Gmail (trevbdev@gmail.com) for a Campermind interview request from around April 16, 2026.
If unreplied, draft an acceptance reply for Trev's review.
If already handled, just report status.
```

---

## Execution Order

**Phase 1 — Stop the bleeding:**
1. Prompt 1 → Supabase schema fix (everything depends on this)
2. Prompt 3 → Nuevo Lead button fix
3. Prompt 2 → Diagnostico page fix
4. Prompt 8 → WebSocket fix or removal
5. Prompt 5 → Admin UI polish
6. Prompt 4 → Pablo's login

**Phase 2 — Real data + content:**
7. Prompt 6 → Wire admin to real Supabase data
8. Prompt 7 → Marketing site content fixes
9. Prompt 11 → Seed automation catalog

**Phase 3 — New features:**
10. Prompt 9 → Pedro's intake form
11. Prompt 10 → English version
12. Prompt 14 → Admin user profile
13. Prompt 13 → Updated playbook doc

**Phase 4 — Separate:**
14. Prompt 12 → Email forwarding
15. Prompt 15 → Trading indicator
16. Prompt 16 → Campermind interview
