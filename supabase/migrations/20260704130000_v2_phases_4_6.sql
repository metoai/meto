-- Phase 4: generated views cache
create table if not exists public.generated_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  view_type text not null,
  target_key text not null,
  content text not null default '',
  content_hash text not null default '',
  source_memory_version text,
  generated_at timestamptz not null default now(),
  unique (user_id, view_type, target_key)
);

alter table public.generated_views enable row level security;

drop policy if exists "Users manage own generated views" on public.generated_views;
create policy "Users manage own generated views"
  on public.generated_views for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists generated_views_user_type_idx
  on public.generated_views (user_id, view_type);

-- Phase 5: workspace mode
alter table public.profiles
  add column if not exists workspace_mode text not null default 'personal'
  check (workspace_mode in ('personal', 'developer'));

-- Phase 6: developer projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null,
  name text not null,
  description text not null default '',
  status text not null default 'active' check (status in ('active', 'archived', 'paused')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.project_memories (
  project_id uuid not null references public.projects(id) on delete cascade,
  memory_id uuid not null,
  role text not null default 'context' check (
    role in (
      'architecture',
      'stack',
      'rules',
      'tasks',
      'business',
      'database',
      'api',
      'deployment',
      'issues',
      'context'
    )
  ),
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (project_id, memory_id),
  foreign key (user_id, memory_id)
    references public.knowledge_objects(user_id, id)
    on delete cascade
);

alter table public.projects enable row level security;
alter table public.project_memories enable row level security;

drop policy if exists "Users manage own projects" on public.projects;
create policy "Users manage own projects"
  on public.projects for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own project memories" on public.project_memories;
create policy "Users manage own project memories"
  on public.project_memories for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists projects_user_status_idx
  on public.projects (user_id, status);

create index if not exists project_memories_project_idx
  on public.project_memories (project_id);

comment on table public.generated_views is 'V2 materialized views from knowledge_objects (sections, compile, MCP handoff).';
comment on column public.profiles.workspace_mode is 'personal | developer — controls portal UX without splitting backends.';
comment on table public.projects is 'V2 developer workspace project entities.';
