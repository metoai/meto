-- Billing / plan columns on profiles
alter table public.profiles
  add column if not exists plan text not null default 'trial'
    check (plan in ('trial', 'free', 'pro')),
  add column if not exists trial_ends_at timestamptz,
  add column if not exists onboarding_ai_used text
    check (onboarding_ai_used is null or onboarding_ai_used in ('brain_dump', 'chat')),
  add column if not exists polar_customer_id text,
  add column if not exists polar_subscription_id text;

-- Backfill existing rows: 3-day trial from account creation (new signups only if still on trial)
update public.profiles
set
  trial_ends_at = coalesce(trial_ends_at, created_at + interval '3 days'),
  plan = case
    when plan is null or plan = '' then 'trial'
    else plan
  end
where trial_ends_at is null or plan is null or plan = '';

create index if not exists profiles_plan_idx on public.profiles (plan);
create index if not exists profiles_trial_ends_at_idx on public.profiles (trial_ends_at);
