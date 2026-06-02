-- Rename Stripe columns to Polar (idempotent if already polar_*)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'stripe_customer_id'
  ) then
    alter table public.profiles rename column stripe_customer_id to polar_customer_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'stripe_subscription_id'
  ) then
    alter table public.profiles rename column stripe_subscription_id to polar_subscription_id;
  end if;
end $$;

-- Fresh installs that never had stripe_* names
alter table public.profiles
  add column if not exists polar_customer_id text,
  add column if not exists polar_subscription_id text;
