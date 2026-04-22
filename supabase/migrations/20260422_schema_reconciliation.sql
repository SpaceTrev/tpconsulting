-- ─────────────────────────────────────────────────────────────
-- Schema reconciliation — consolidates: 001_init, 20260419_create_intake_leads_tables,
-- 20260421_ops_tables, 20260422_revops_schema into a single idempotent script.
--
-- SAFE to run multiple times. Run in Supabase SQL Editor for project qsdtnnutusvkgnvnubxd.
-- Fixes: PGRST204 / "column does not exist" errors from admin-queries.ts,
-- cal-webhook/route.ts, and intake-queries.ts when earlier migrations are missing
-- or were partially applied.
-- ─────────────────────────────────────────────────────────────

BEGIN;

-- ═══════════════════════════════════════════════════════════════
-- 1. diagnostic_submissions — ensure status + payment_status
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS diagnostic_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  business_name text,
  industry text,
  tier text,
  urgency text,
  contact_name text,
  contact_whatsapp text,
  contact_email text,
  contact_preference text,
  city text,
  employees text,
  business_age text,
  customer_channels text[],
  response_time text,
  client_data_mgmt text,
  cfdi_status text,
  google_business text,
  biggest_time_waste text,
  one_thing_to_automate text,
  past_automation text,
  past_automation_detail text,
  losing_customers_how text[],
  current_tools text[],
  current_tech_spend text,
  automation_budget text,
  monthly_revenue text,
  additional_notes text
);

ALTER TABLE diagnostic_submissions ADD COLUMN IF NOT EXISTS status text DEFAULT 'nuevo';
ALTER TABLE diagnostic_submissions ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pendiente';

ALTER TABLE diagnostic_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='diagnostic_submissions' AND policyname='anon_insert_diagnostics') THEN
    CREATE POLICY anon_insert_diagnostics ON diagnostic_submissions FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='diagnostic_submissions' AND policyname='auth_all_diagnostics') THEN
    CREATE POLICY auth_all_diagnostics ON diagnostic_submissions FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='diagnostic_submissions' AND policyname='service_role_all_diagnostics') THEN
    CREATE POLICY service_role_all_diagnostics ON diagnostic_submissions FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 2. contacts — ensure status column + policies
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text,
  email text,
  whatsapp text,
  industry text,
  message text,
  source_page text
);

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status text DEFAULT 'nuevo';

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contacts' AND policyname='anon_insert_contacts') THEN
    CREATE POLICY anon_insert_contacts ON contacts FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contacts' AND policyname='auth_all_contacts') THEN
    CREATE POLICY auth_all_contacts ON contacts FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contacts' AND policyname='service_role_all_contacts') THEN
    CREATE POLICY service_role_all_contacts ON contacts FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 3. intake_submissions
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS intake_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  client_slug text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_count int DEFAULT 0,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='intake_submissions' AND policyname='service_role_all') THEN
    CREATE POLICY service_role_all ON intake_submissions FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='intake_submissions' AND policyname='anon_insert') THEN
    CREATE POLICY anon_insert ON intake_submissions FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='intake_submissions' AND policyname='auth_all_intake') THEN
    CREATE POLICY auth_all_intake ON intake_submissions FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 4. leads — create if missing, then add every column the code uses
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

-- RevOps + intake columns
ALTER TABLE leads ADD COLUMN IF NOT EXISTS stage            text        DEFAULT 'nuevo';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_name     text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS business_name    text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS industry         text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source           text        DEFAULT 'manual';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS days_in_stage    int         DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assignee         text        DEFAULT 'TB';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS whatsapp         text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email            text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_note        text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_action      text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS revenue_estimate int         DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS linked_diagnostic text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_id          text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_source      text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS estimated_price  numeric;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quote_sent_date  date;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS estimated_close_date date;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS close_date       date;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS close_reason     text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS result           text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS loss_reason      text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score       int;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_action_date date;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to      text;      -- legacy (001_init)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at       timestamptz DEFAULT now();
ALTER TABLE leads ADD COLUMN IF NOT EXISTS diagnostic_id    uuid;      -- legacy (001_init)

-- jsonb columns (handle legacy TEXT 'notes' from 001_init.sql)
DO $$
DECLARE
  notes_type text;
BEGIN
  SELECT data_type INTO notes_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'notes';

  IF notes_type IS NULL THEN
    ALTER TABLE leads ADD COLUMN notes jsonb DEFAULT '[]'::jsonb;
  ELSIF notes_type <> 'jsonb' THEN
    -- Legacy text column — convert to jsonb. Rescue any non-empty text into a single note entry.
    ALTER TABLE leads ADD COLUMN notes_new jsonb DEFAULT '[]'::jsonb;
    UPDATE leads SET notes_new =
      CASE
        WHEN notes IS NULL OR notes = '' THEN '[]'::jsonb
        ELSE jsonb_build_array(jsonb_build_object('at', extract(epoch from now())*1000, 'author', 'SYS', 'text', notes))
      END;
    ALTER TABLE leads DROP COLUMN notes;
    ALTER TABLE leads RENAME COLUMN notes_new TO notes;
    ALTER TABLE leads ALTER COLUMN notes SET DEFAULT '[]'::jsonb;
  END IF;
END $$;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS timeline jsonb DEFAULT '[]'::jsonb;

-- Drop any legacy status CHECK constraint that might reject new stage-driven inserts.
-- (001_init.sql created `status text CHECK (status IN ('nuevo','...'))` — code uses `stage` instead
--  and never writes status, so the column can stay but the restrictive check must not block inserts.)
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class cls ON cls.oid = con.conrelid
    WHERE cls.relname = 'leads' AND con.contype = 'c'
  LOOP
    -- Drop any CHECK constraint whose definition mentions the old status enum values.
    IF (SELECT pg_get_constraintdef(con.oid) FROM pg_constraint con WHERE con.conname = r.conname) LIKE '%status%' THEN
      EXECUTE format('ALTER TABLE leads DROP CONSTRAINT %I', r.conname);
    END IF;
  END LOOP;
END $$;

-- Auto-generated lead_id (L-001, L-002, …)
CREATE SEQUENCE IF NOT EXISTS lead_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_lead_id() RETURNS trigger AS $$
BEGIN
  NEW.lead_id := 'L-' || LPAD(nextval('lead_id_seq')::text, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_lead_id ON leads;
CREATE TRIGGER set_lead_id BEFORE INSERT ON leads
  FOR EACH ROW WHEN (NEW.lead_id IS NULL)
  EXECUTE FUNCTION generate_lead_id();

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='leads' AND policyname='auth_all_leads') THEN
    CREATE POLICY auth_all_leads ON leads FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='leads' AND policyname='service_role_all_leads') THEN
    CREATE POLICY service_role_all_leads ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 5. clients
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  contact_name text,
  contact_email text,
  contact_whatsapp text,
  industry text,
  tier text,
  status text DEFAULT 'active' CHECK (status IN ('active','paused','churned')),
  monthly_subscription numeric,
  start_date date,
  notes text,
  lead_id uuid REFERENCES leads(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hardening: ensure every column the app touches exists, regardless of whether
-- origin's thin 20260421_ops_tables.sql ran earlier (which lacks several columns
-- below). admin-queries.ts::createClient writes email/company/phone; projects page
-- JOIN selects clients(contact_name, industry, tier, monthly_subscription).
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_name         text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_email        text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_whatsapp     text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email                text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS company              text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS phone                text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS industry             text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tier                 text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS monthly_subscription numeric;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS start_date           date;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes                text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS lead_id              uuid;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_at           timestamptz DEFAULT now();

-- Ensure clients.lead_id has FK to leads(id) — only add if not already constrained.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'clients_lead_id_fkey' AND conrelid = 'clients'::regclass
  ) THEN
    BEGIN
      ALTER TABLE clients ADD CONSTRAINT clients_lead_id_fkey
        FOREIGN KEY (lead_id) REFERENCES leads(id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='clients' AND policyname='auth_all_clients') THEN
    CREATE POLICY auth_all_clients ON clients FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='clients' AND policyname='service_role_all_clients') THEN
    CREATE POLICY service_role_all_clients ON clients FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 6. projects
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id) NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'planning' CHECK (status IN ('planning','in_progress','testing','live','paused','completed')),
  assigned_to text,
  start_date date,
  target_date date,
  hours_spent numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hardening: origin's 20260421_ops_tables.sql uses `assignee`, my earlier version
-- used `assigned_to`; it also omits start_date/target_date/hours_spent. Projects
-- page inserts with hours_spent=0 and selects both naming conventions as needed.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description    text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS assignee       text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS assigned_to    text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date     date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_date    date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS hours_spent    numeric DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS notes          text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at     timestamptz DEFAULT now();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='auth_all_projects') THEN
    CREATE POLICY auth_all_projects ON projects FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='service_role_all_projects') THEN
    CREATE POLICY service_role_all_projects ON projects FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 7. automation_catalog
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS automation_catalog (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text,
  complexity text CHECK (complexity IN ('simple','medium','complex')),
  avg_deploy_hours numeric,
  monthly_cost_estimate numeric,
  is_template boolean NOT NULL DEFAULT true,
  tech_stack text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE automation_catalog ADD COLUMN IF NOT EXISTS avg_deploy_hours      numeric;
ALTER TABLE automation_catalog ADD COLUMN IF NOT EXISTS monthly_cost_estimate numeric;
ALTER TABLE automation_catalog ADD COLUMN IF NOT EXISTS is_template           boolean NOT NULL DEFAULT true;
ALTER TABLE automation_catalog ADD COLUMN IF NOT EXISTS tech_stack            text;

ALTER TABLE automation_catalog ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='automation_catalog' AND policyname='auth_all_catalog') THEN
    CREATE POLICY auth_all_catalog ON automation_catalog FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='automation_catalog' AND policyname='service_role_all_catalog') THEN
    CREATE POLICY service_role_all_catalog ON automation_catalog FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 8. deployed_automations
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS deployed_automations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id),
  client_id uuid REFERENCES clients(id) NOT NULL,
  catalog_id uuid REFERENCES automation_catalog(id),
  name text NOT NULL,
  status text DEFAULT 'backlog' CHECK (status IN ('backlog','building','testing','live','paused','failed')),
  assigned_to text,
  last_run_at timestamptz,
  error_count int DEFAULT 0,
  monthly_cost numeric DEFAULT 0,
  config jsonb DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hardening: origin's 20260421 omits assigned_to + config jsonb. Projects page
-- selects id,name,status,error_count,monthly_cost,last_run_at,assigned_to.
ALTER TABLE deployed_automations ADD COLUMN IF NOT EXISTS project_id    uuid;
ALTER TABLE deployed_automations ADD COLUMN IF NOT EXISTS catalog_id    uuid;
ALTER TABLE deployed_automations ADD COLUMN IF NOT EXISTS assigned_to   text;
ALTER TABLE deployed_automations ADD COLUMN IF NOT EXISTS last_run_at   timestamptz;
ALTER TABLE deployed_automations ADD COLUMN IF NOT EXISTS error_count   int     DEFAULT 0;
ALTER TABLE deployed_automations ADD COLUMN IF NOT EXISTS monthly_cost  numeric DEFAULT 0;
ALTER TABLE deployed_automations ADD COLUMN IF NOT EXISTS config        jsonb   DEFAULT '{}'::jsonb;
ALTER TABLE deployed_automations ADD COLUMN IF NOT EXISTS notes         text;
ALTER TABLE deployed_automations ADD COLUMN IF NOT EXISTS updated_at    timestamptz DEFAULT now();

ALTER TABLE deployed_automations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='deployed_automations' AND policyname='auth_all_deployed') THEN
    CREATE POLICY auth_all_deployed ON deployed_automations FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='deployed_automations' AND policyname='service_role_all_deployed') THEN
    CREATE POLICY service_role_all_deployed ON deployed_automations FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 9. upsells
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS upsells (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upsell_id            text,
  client_id            uuid REFERENCES clients(id) NOT NULL,
  type                 text,
  description          text,
  estimated_price      numeric,
  stage                text NOT NULL DEFAULT 'identified',
  identified_date      date DEFAULT CURRENT_DATE,
  quote_sent_date      date,
  estimated_close_date date,
  result               text,
  loss_reason          text,
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE upsells ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='upsells' AND policyname='auth_all_upsells') THEN
    CREATE POLICY auth_all_upsells ON upsells FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='upsells' AND policyname='service_role_all_upsells') THEN
    CREATE POLICY service_role_all_upsells ON upsells FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

CREATE SEQUENCE IF NOT EXISTS upsell_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_upsell_id() RETURNS trigger AS $$
BEGIN
  NEW.upsell_id := 'U-' || LPAD(nextval('upsell_id_seq')::text, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_upsell_id ON upsells;
CREATE TRIGGER set_upsell_id BEFORE INSERT ON upsells
  FOR EACH ROW WHEN (NEW.upsell_id IS NULL)
  EXECUTE FUNCTION generate_upsell_id();

-- ═══════════════════════════════════════════════════════════════
-- 10. Seed automation_catalog (only if empty)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO automation_catalog
  (name, description, category, complexity, avg_deploy_hours, monthly_cost_estimate, is_template, tech_stack)
SELECT name, description, category, complexity::text,
       avg_deploy_hours, monthly_cost_estimate, is_template, tech_stack
FROM (VALUES
  ('Bot de WhatsApp',        'Respuestas automáticas a preguntas frecuentes, horarios, ubicación, menú',          'whatsapp',   'simple',  4,  100, true, 'whatsapp_api,claude_haiku'),
  ('Prospección de leads',   'Scraping + enriquecimiento + calificación automática con IA',                       'lead_gen',   'complex', 20, 500, true, 'apify,claude_sonnet,sheets'),
  ('CFDI 4.0 automatizado',  'Facturación electrónica automática via Facturapi',                                  'invoicing',  'medium',  12, 200, true, 'facturapi,n8n'),
  ('Google Reviews monitor', 'Monitoreo y alertas de reseñas nuevas en Google Business',                          'marketing',  'simple',  6,  50,  true, 'google_api,n8n'),
  ('CRM con WhatsApp',       'Pipeline de clientes integrado con WhatsApp Business',                              'crm',        'medium',  16, 300, true, 'supabase,whatsapp_api'),
  ('Dashboard de métricas',  'Panel en tiempo real con KPIs del negocio',                                         'operations', 'medium',  12, 150, true, 'supabase,nextjs'),
  ('Secuencia de seguimiento','Follow-up automático por WhatsApp 3-5 toques',                                     'whatsapp',   'simple',  8,  150, true, 'whatsapp_api,n8n'),
  ('SEO local + Google Business','Optimización de perfil, keywords, contenido local',                             'marketing',  'medium',  10, 100, true, 'google_api,claude'),
  ('Agendamiento automático','Citas por WhatsApp + iCal sync',                                                    'operations', 'simple',  6,  50,  true, 'cal_api,whatsapp_api'),
  ('Pipeline de contenido',  'IA genera, programa y publica contenido en redes',                                  'marketing',  'complex', 24, 400, true, 'claude,buffer,n8n')
) AS v(name, description, category, complexity, avg_deploy_hours, monthly_cost_estimate, is_template, tech_stack)
WHERE NOT EXISTS (SELECT 1 FROM automation_catalog LIMIT 1);

COMMIT;

-- ═══════════════════════════════════════════════════════════════
-- Verification (read-only — run this after the migration)
-- ═══════════════════════════════════════════════════════════════
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_schema='public' AND table_name='leads' ORDER BY ordinal_position;
--
-- SELECT tablename FROM pg_tables WHERE schemaname='public'
-- AND tablename IN ('leads','clients','projects','automation_catalog',
--                   'deployed_automations','upsells','intake_submissions',
--                   'contacts','diagnostic_submissions')
-- ORDER BY tablename;
