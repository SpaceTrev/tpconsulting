-- ── Leads: RevOps columns ─────────────────────────────────────
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_source text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS estimated_price numeric;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quote_sent_date date;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS estimated_close_date date;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS result text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS loss_reason text;

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

-- ── automation_catalog: add seed-compatible columns ───────────
ALTER TABLE automation_catalog ADD COLUMN IF NOT EXISTS avg_deploy_hours numeric;
ALTER TABLE automation_catalog ADD COLUMN IF NOT EXISTS monthly_cost_estimate numeric;
ALTER TABLE automation_catalog ADD COLUMN IF NOT EXISTS is_template boolean NOT NULL DEFAULT true;
ALTER TABLE automation_catalog ADD COLUMN IF NOT EXISTS tech_stack text;

-- ── Upsells ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS upsells (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upsell_id            text,
  client_id            uuid REFERENCES clients(id) NOT NULL,
  type                 text,  -- servicio_adicional | expansion | renovacion
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
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'auth_all_upsells' AND tablename = 'upsells'
  ) THEN
    CREATE POLICY auth_all_upsells ON upsells FOR ALL TO authenticated USING (true);
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

-- ── Automation catalog seed (only if empty) ───────────────────
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
