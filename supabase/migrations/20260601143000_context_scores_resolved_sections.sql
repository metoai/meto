alter table public.context_scores
  add column if not exists resolved_sections jsonb not null default '[]'::jsonb;
