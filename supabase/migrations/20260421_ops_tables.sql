-- clients
create table if not exists clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  company     text,
  phone       text,
  status      text not null default 'active',   -- active | inactive
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- projects
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references clients(id) on delete set null,
  name        text not null,
  description text,
  status      text not null default 'planning',  -- planning | in_progress | testing | live | paused | completed
  assignee    text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- automation_catalog
create table if not exists automation_catalog (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  description      text,
  category         text not null default 'custom',  -- lead_gen | whatsapp | crm | invoicing | marketing | operations | custom
  complexity       text not null default 'simple',  -- simple | medium | complex
  estimated_hours  numeric(6,2),
  monthly_cost     numeric(10,2),
  tools            text[],
  run_count        integer not null default 0,
  active_count     integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- deployed_automations
create table if not exists deployed_automations (
  id              uuid primary key default gen_random_uuid(),
  catalog_id      uuid references automation_catalog(id) on delete set null,
  client_id       uuid references clients(id) on delete cascade,
  project_id      uuid references projects(id) on delete set null,
  name            text not null,
  status          text not null default 'backlog',  -- backlog | building | testing | live | paused | failed
  last_run_at     timestamptz,
  error_count     integer not null default 0,
  monthly_cost    numeric(10,2),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- RLS
alter table clients              enable row level security;
alter table projects             enable row level security;
alter table automation_catalog   enable row level security;
alter table deployed_automations enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'auth_all_clients') then
    create policy auth_all_clients on clients for all to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'auth_all_projects') then
    create policy auth_all_projects on projects for all to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'auth_all_catalog') then
    create policy auth_all_catalog on automation_catalog for all to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'auth_all_deployed') then
    create policy auth_all_deployed on deployed_automations for all to authenticated using (true);
  end if;
end $$;
