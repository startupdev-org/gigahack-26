-- Run in the Supabase SQL Editor if public.profiles is missing.
-- This migration leaves the existing orders table and its policies untouched.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  company text not null default '',
  email text not null default '',
  notify_orders boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, company, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'company', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do update set
    name = excluded.name,
    company = excluded.company,
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Add profiles for accounts created before the trigger was installed.
insert into public.profiles (id, name, company, email)
select
  id,
  coalesce(raw_user_meta_data->>'name', ''),
  coalesce(raw_user_meta_data->>'company', ''),
  coalesce(email, '')
from auth.users
on conflict (id) do nothing;
