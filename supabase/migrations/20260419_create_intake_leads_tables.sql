-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qsdtnnutusvkgnvnubxd/sql

-- ── intake_submissions ────────────────────────────────────────
create table if not exists intake_submissions (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  client_slug  text        not null,
  answers      jsonb       not null default '{}'::jsonb,
  completed_count int      default 0,
  submitted_at timestamptz default now()
);

alter table intake_submissions enable row level security;

-- Allow service role to do everything
create policy "service_role_all" on intake_submissions
  for all to service_role using (true) with check (true);

-- Allow anon to insert only (form submissions)
create policy "anon_insert" on intake_submissions
  for insert to anon with check (true);

-- ── leads ─────────────────────────────────────────────────────
create table if not exists leads (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  stage            text        not null default 'nuevo',
  contact_name     text,
  business_name    text,
  industry         text,
  source           text        default 'manual',
  days_in_stage    int         default 0,
  assignee         text        default 'TB',
  whatsapp         text,
  email            text,
  last_note        text,
  next_action      text,
  revenue_estimate int         default 0,
  linked_diagnostic text,
  timeline         jsonb       default '[]'::jsonb,
  notes            jsonb       default '[]'::jsonb
);

alter table leads enable row level security;

create policy "service_role_all" on leads
  for all to service_role using (true) with check (true);

-- ── Add status + payment_status to diagnostic_submissions ─────
alter table diagnostic_submissions
  add column if not exists status text default 'nuevo',
  add column if not exists payment_status text default 'pendiente';

-- ── Add status to contacts ────────────────────────────────────
alter table contacts
  add column if not exists status text default 'nuevo';
