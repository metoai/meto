alter table public.profiles
  add column if not exists mcp_access_token text;

create unique index if not exists profiles_mcp_access_token_unique_idx
  on public.profiles (mcp_access_token)
  where mcp_access_token is not null;
