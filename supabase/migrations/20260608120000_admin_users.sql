-- Admin portal: privileged users (service-role access only; no user-facing RLS policies)

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null
);

comment on table public.admin_users is 'Privileged admin accounts for the Meto admin portal';

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from anon, authenticated;
grant select, insert, update, delete on table public.admin_users to service_role;

create index if not exists admin_users_email_idx on public.admin_users (lower(email));

create or replace function public.is_admin_user(check_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = check_user_id
  );
$$;

revoke all on function public.is_admin_user(uuid) from public;
grant execute on function public.is_admin_user(uuid) to service_role;
