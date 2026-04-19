-- ============================================================
-- TPConsulting — Initial Schema (matches 26-question form)
-- ============================================================

CREATE TABLE IF NOT EXISTS diagnostic_submissions (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  -- Stage 1: Tu Negocio
  business_name         TEXT,
  industry              TEXT,
  city                  TEXT,
  employees             TEXT,
  business_age          TEXT,
  -- Stage 2: Tu Operación
  customer_channels     TEXT[],
  first_contact_process TEXT,
  response_time         TEXT,
  client_data_mgmt      TEXT,
  cfdi_status           TEXT,
  google_business       TEXT,
  current_tools         TEXT[],
  current_tech_spend    TEXT,
  -- Stage 3: Tu Mayor Dolor
  biggest_time_waste    TEXT,
  one_thing_to_automate TEXT,
  past_automation       TEXT,
  past_automation_detail TEXT,
  losing_customers_how  TEXT[],
  urgency               TEXT,
  additional_notes      TEXT,
  -- Stage 4: Inversión / Contacto
  automation_budget     TEXT,
  monthly_revenue       TEXT,
  tier                  TEXT NOT NULL,
  contact_name          TEXT NOT NULL,
  contact_whatsapp      TEXT NOT NULL,
  contact_email         TEXT NOT NULL,
  contact_preference    TEXT,
  -- Pipeline
  payment_status        TEXT DEFAULT 'pending',
  lead_status           TEXT DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS contacts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  whatsapp    TEXT,
  industry    TEXT,
  message     TEXT,
  source_page TEXT,
  status      TEXT DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS leads (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  contact_name    TEXT NOT NULL,
  contact_email   TEXT NOT NULL,
  contact_whatsapp TEXT,
  industry        TEXT,
  source          TEXT,
  status          TEXT DEFAULT 'new'
                  CHECK (status IN ('new','contacted','responded','diagnostic_scheduled','proposal_sent','negotiating','client','lost')),
  diagnostic_id   UUID REFERENCES diagnostic_submissions(id),
  notes           TEXT,
  assigned_to     TEXT
);

ALTER TABLE diagnostic_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY anon_insert_diagnostics ON diagnostic_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY anon_insert_contacts ON contacts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY auth_all_diagnostics ON diagnostic_submissions FOR ALL TO authenticated USING (true);
CREATE POLICY auth_all_contacts ON contacts FOR ALL TO authenticated USING (true);
CREATE POLICY auth_all_leads ON leads FOR ALL TO authenticated USING (true);
