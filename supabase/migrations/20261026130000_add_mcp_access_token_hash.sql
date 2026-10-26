-- Migration: 20261026130000_add_mcp_access_token_hash.sql
-- Ensure pgcrypto extension and mcp_access_token_hash column exist on profiles

create extension if not exists pgcrypto;

alter table public.profiles
  add column if not exists mcp_access_token_hash text;

create unique index if not exists profiles_mcp_access_token_hash_idx
  on public.profiles (mcp_access_token_hash)
  where mcp_access_token_hash is not null;

update public.profiles
set mcp_access_token_hash = encode(digest(mcp_access_token, 'sha256'), 'hex')
where mcp_access_token is not null
  and mcp_access_token_hash is null;
