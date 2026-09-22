-- Create table for CLI device authorization flow (similar to GitHub device code flow)
create table if not exists public.cli_auth_sessions (
  id uuid primary key default gen_random_uuid(),
  device_code text not null unique,
  user_id uuid references auth.users(id) on delete cascade,
  token text,
  username text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'expired', 'consumed')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '10 minutes')
);

create index if not exists cli_auth_sessions_device_code_idx
  on public.cli_auth_sessions (device_code);

create index if not exists cli_auth_sessions_expires_at_idx
  on public.cli_auth_sessions (expires_at);

alter table public.cli_auth_sessions enable row level security;

-- Only service role has full access; authenticated users can update pending sessions they approve
create policy "Service role manages all CLI auth sessions"
  on public.cli_auth_sessions
  for all
  using (auth.jwt() ->> 'role' = 'service_role');
