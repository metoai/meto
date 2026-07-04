-- Project OS: repo import, focus, timeline events

alter table public.projects
  add column if not exists repo_url text,
  add column if not exists import_source text not null default 'manual'
    check (import_source in ('manual', 'github', 'gitlab', 'local', 'zip', 'profile_sync')),
  add column if not exists current_focus jsonb not null default '{}'::jsonb,
  add column if not exists last_scanned_at timestamptz;

create table if not exists public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (
    event_type in ('decision', 'change', 'scan', 'rule', 'focus', 'import', 'memory')
  ),
  title text not null,
  content text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.project_events enable row level security;

drop policy if exists "Users manage own project events" on public.project_events;
create policy "Users manage own project events"
  on public.project_events for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists project_events_project_created_idx
  on public.project_events (project_id, created_at desc);

comment on table public.project_events is 'Knowledge timeline and decision history per project.';
