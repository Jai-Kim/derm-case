-- DermCase cloud storage — run once in the Supabase SQL editor.
-- Stores ONLY the structured case (assessment, references, treatment options)
-- plus minimal context. The raw case image is NEVER stored here.

create table if not exists public.cases (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  dx         text,          -- top diagnosis label, for list display
  meta       jsonb,         -- { age, sex, area, duration } — no name, no image
  result     jsonb,         -- the structured brief (assessment / references / treatment_comparison)
  created_at timestamptz not null default now()
);

-- Each user can only ever see and touch their own rows.
alter table public.cases enable row level security;

create policy "cases_select_own" on public.cases
  for select using (auth.uid() = user_id);
create policy "cases_insert_own" on public.cases
  for insert with check (auth.uid() = user_id);
create policy "cases_delete_own" on public.cases
  for delete using (auth.uid() = user_id);

create index if not exists cases_user_created_idx on public.cases (user_id, created_at desc);

-- Account deletion (required by Google Play for apps that create accounts).
-- Lets a signed-in user delete THEIR OWN account. Saved cases go with it via
-- the on delete cascade above. Run once in the Supabase SQL editor.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
