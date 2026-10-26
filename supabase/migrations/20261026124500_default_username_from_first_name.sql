-- Migration: 20261026124500_default_username_from_first_name.sql
-- Description: Automatically assign clean, unique default username from first name for new signups and backfill existing profiles.

-- 1. Helper function to generate clean, unique default username from name or email
create or replace function public.generate_default_username(
  p_raw_name text,
  p_email text,
  p_user_id uuid
)
returns text
language plpgsql
security definer
as $$
declare
  raw_name text;
  first_name text;
  base_username text;
  candidate text;
  suffix int := 0;
  is_taken boolean;
begin
  -- 1. Determine raw name source
  raw_name := coalesce(
    nullif(trim(p_raw_name), ''),
    nullif(trim(split_part(p_email, '@', 1)), ''),
    'user'
  );

  -- 2. Extract first name (first word before whitespace)
  first_name := split_part(trim(raw_name), ' ', 1);

  -- 3. Sanitize: lowercase, alphanumeric and underscores only
  base_username := lower(regexp_replace(first_name, '[^a-zA-Z0-9_]', '', 'g'));

  -- If empty or stripped away, fall back to email prefix
  if length(base_username) = 0 then
    base_username := lower(regexp_replace(split_part(p_email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'));
  end if;

  if length(base_username) = 0 then
    base_username := 'user';
  end if;

  -- Ensure minimum 3 characters
  if length(base_username) < 3 then
    base_username := rpad(base_username, 3, '0');
  end if;

  -- Truncate base to 16 characters max to leave room for numeric suffix
  if length(base_username) > 16 then
    base_username := substring(base_username from 1 for 16);
  end if;

  -- 4. Find next available non-reserved unique username
  candidate := base_username;

  loop
    if candidate in ('admin', 'api', 'auth', 'dashboard', 'settings', 'onboarding') then
      is_taken := true;
    else
      select exists(
        select 1 from public.profiles
        where lower(username) = candidate
          and (p_user_id is null or id != p_user_id)
      ) into is_taken;
    end if;

    exit when not is_taken;

    suffix := suffix + 1;
    candidate := substring(base_username from 1 for (20 - length(suffix::text))) || suffix::text;
  end loop;

  return candidate;
end;
$$;

-- 2. Update trigger function for all new user signups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  raw_name text;
  def_username text;
begin
  raw_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    nullif(trim(split_part(new.email, '@', 1)), ''),
    'user'
  );

  def_username := public.generate_default_username(raw_name, new.email, new.id);

  insert into public.profiles (id, display_name, username)
  values (new.id, raw_name, def_username)
  on conflict (id) do update
  set 
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    username = coalesce(public.profiles.username, excluded.username);

  return new;
end;
$$;

-- 3. Backfill existing profiles that currently have null username
do $$
declare
  r record;
  new_username text;
begin
  for r in (
    select p.id, p.display_name, u.email
    from public.profiles p
    left join auth.users u on p.id = u.id
    where p.username is null
    order by p.created_at asc
  ) loop
    new_username := public.generate_default_username(r.display_name, r.email, r.id);
    update public.profiles
    set username = new_username
    where id = r.id and username is null;
  end loop;
end;
$$;
