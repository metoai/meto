alter table public.profiles
  add column if not exists mcp_last_used_at timestamptz;
