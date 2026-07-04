create extension if not exists pgcrypto;

create table if not exists public.knowledge_objects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (
    type in (
      'identity',
      'preference',
      'rule',
      'goal',
      'project',
      'relationship',
      'decision',
      'experience',
      'timeline',
      'achievement',
      'skill',
      'tool',
      'company',
      'technology',
      'location',
      'task',
      'documentation',
      'custom'
    )
  ),
  title text not null,
  content text not null,
  confidence numeric(3,2) not null default 1.00 check (confidence >= 0 and confidence <= 1),
  importance integer not null default 3 check (importance >= 1 and importance <= 5),
  visibility text not null default 'private' check (visibility in ('private', 'public', 'integration')),
  source text not null default 'manual' check (
    source in (
      'quick_update',
      'onboarding',
      'landing',
      'mcp',
      'profile_editor',
      'document',
      'migration',
      'manual'
    )
  ),
  status text not null default 'active' check (status in ('active', 'archived', 'superseded', 'pending_review')),
  created_by text not null default 'user' check (created_by in ('user', 'ai', 'system')),
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_verified_at timestamptz,
  unique (user_id, id)
);

create table if not exists public.knowledge_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  from_memory_id uuid not null,
  to_memory_id uuid not null,
  relation_type text not null check (
    relation_type in (
      'works_at',
      'founded',
      'maintains',
      'uses',
      'prefers',
      'depends_on',
      'blocked_by',
      'related_to',
      'contradicts',
      'supersedes',
      'verifies'
    )
  ),
  strength numeric(3,2) not null default 1.00 check (strength >= 0 and strength <= 1),
  created_at timestamptz not null default now(),
  check (from_memory_id <> to_memory_id),
  foreign key (user_id, from_memory_id)
    references public.knowledge_objects(user_id, id)
    on delete cascade,
  foreign key (user_id, to_memory_id)
    references public.knowledge_objects(user_id, id)
    on delete cascade
);

alter table public.knowledge_objects enable row level security;
alter table public.knowledge_links enable row level security;

drop policy if exists "Users manage own knowledge objects" on public.knowledge_objects;
create policy "Users manage own knowledge objects"
  on public.knowledge_objects for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own knowledge links" on public.knowledge_links;
create policy "Users manage own knowledge links"
  on public.knowledge_links for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists knowledge_objects_user_updated_at_idx
  on public.knowledge_objects (user_id, updated_at desc);

create index if not exists knowledge_objects_user_status_type_idx
  on public.knowledge_objects (user_id, status, type);

create index if not exists knowledge_objects_user_visibility_idx
  on public.knowledge_objects (user_id, visibility);

create index if not exists knowledge_objects_tags_idx
  on public.knowledge_objects using gin (tags);

create index if not exists knowledge_links_user_from_idx
  on public.knowledge_links (user_id, from_memory_id);

create index if not exists knowledge_links_user_to_idx
  on public.knowledge_links (user_id, to_memory_id);

create unique index if not exists knowledge_links_unique_relation_idx
  on public.knowledge_links (user_id, from_memory_id, to_memory_id, relation_type);

comment on table public.knowledge_objects is 'V2 source-of-truth memory objects. Additive shadow model during migration.';
comment on table public.knowledge_links is 'Relationships between V2 memory objects for graph and generated view analysis.';
