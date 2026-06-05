alter table if exists public.profiles enable row level security;
alter table if exists public.context_sections enable row level security;

drop policy if exists "Public profiles with public sections are readable" on public.profiles;
create policy "Public profiles with public sections are readable"
  on public.profiles
  for select
  to anon
  using (
    username is not null
    and exists (
      select 1
      from public.context_sections
      where context_sections.user_id = profiles.id
        and context_sections.is_public = true
    )
  );

revoke all privileges on table public.profiles from anon;
revoke select, insert, update, references (
  id,
  username,
  display_name,
  created_at,
  updated_at,
  polar_customer_id,
  polar_subscription_id,
  plan,
  trial_ends_at,
  onboarding_ai_used,
  ai_calls_used,
  ai_usage_period_start
) on table public.profiles from anon;
grant select (id, username, display_name) on table public.profiles to anon;

revoke all privileges on table public.context_sections from anon;
revoke select, insert, update, references (
  id,
  user_id,
  section_type,
  title,
  content,
  display_order,
  is_public,
  created_at,
  updated_at
) on table public.context_sections from anon;
grant select (
  user_id,
  section_type,
  title,
  content,
  display_order,
  is_public
) on table public.context_sections to anon;
