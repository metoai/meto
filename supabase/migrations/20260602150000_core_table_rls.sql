-- Row-level security for user-owned tables (defense in depth with API auth checks).

alter table if exists public.profiles enable row level security;
alter table if exists public.context_sections enable row level security;
alter table if exists public.compiled_profiles enable row level security;
alter table if exists public.onboarding_chats enable row level security;

-- profiles: own row only
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- context_sections: own rows + public sections readable by anyone
drop policy if exists "Users manage own sections" on public.context_sections;
create policy "Users manage own sections"
  on public.context_sections for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Public sections are readable" on public.context_sections;
create policy "Public sections are readable"
  on public.context_sections for select to anon, authenticated
  using (is_public = true);

-- compiled_profiles: own rows only
drop policy if exists "Users manage own compiled profiles" on public.compiled_profiles;
create policy "Users manage own compiled profiles"
  on public.compiled_profiles for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- onboarding_chats: own rows only
drop policy if exists "Users manage own onboarding chats" on public.onboarding_chats;
create policy "Users manage own onboarding chats"
  on public.onboarding_chats for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes for hot query paths
create index if not exists context_sections_user_display_order_idx
  on public.context_sections (user_id, display_order);

create index if not exists context_sections_user_updated_at_idx
  on public.context_sections (user_id, updated_at desc);

create index if not exists compiled_profiles_user_format_idx
  on public.compiled_profiles (user_id, format);

create index if not exists profiles_polar_customer_id_idx
  on public.profiles (polar_customer_id)
  where polar_customer_id is not null;

create index if not exists profiles_username_idx
  on public.profiles (lower(username))
  where username is not null;
