alter table public.profiles
  add column if not exists ai_calls_used integer not null default 0,
  add column if not exists ai_usage_period_start timestamptz;

comment on column public.profiles.ai_calls_used is 'LLM API calls consumed in the current usage period';
comment on column public.profiles.ai_usage_period_start is 'Start of the current AI usage counting window';
