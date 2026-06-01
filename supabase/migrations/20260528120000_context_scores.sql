create table if not exists public.context_scores (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  score integer not null check (score >= 0 and score <= 100),
  headline text not null,
  summary text not null,
  gaps jsonb not null default '[]'::jsonb,
  analyzed_at timestamptz not null default now()
);

alter table public.context_scores enable row level security;

create policy "Users can read own context score"
  on public.context_scores
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own context score"
  on public.context_scores
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own context score"
  on public.context_scores
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own context score"
  on public.context_scores
  for delete
  to authenticated
  using (auth.uid() = user_id);
