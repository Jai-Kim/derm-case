-- DermCase database setup and hardening.
-- Run the WHOLE file in the Supabase SQL editor. It is safe to run again at any time (idempotent).
--
-- What this stores: a signed-in user's own saved briefs (structured result plus minimal context, never the photo and
-- never free-text notes) and anonymous daily usage counters (no IDs, no IPs, no photos, no case text).
-- After running, read the "Next steps" block at the bottom.

-- =====================================================================================
-- 1. Saved cases
-- =====================================================================================
create table if not exists public.cases (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  dx         text,          -- top diagnosis label, for list display
  meta       jsonb,         -- { age, sex, area, duration, fitz }: no name, no image, no notes
  result     jsonb,         -- the structured brief (assessment / references / treatment_comparison)
  created_at timestamptz not null default now()
);

alter table public.cases enable row level security;

-- Each user can see, add and delete only their own rows. There is no UPDATE policy on purpose.
drop policy if exists "cases_select_own" on public.cases;
drop policy if exists "cases_insert_own" on public.cases;
drop policy if exists "cases_delete_own" on public.cases;
create policy "cases_select_own" on public.cases for select to authenticated using ((select auth.uid()) = user_id);
create policy "cases_insert_own" on public.cases for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "cases_delete_own" on public.cases for delete to authenticated using ((select auth.uid()) = user_id);

-- Least privilege at the table level too (RLS is the second lock, this is the first).
revoke all on public.cases from anon, authenticated;
grant select, insert, delete on public.cases to authenticated;

create index if not exists cases_user_created_idx on public.cases (user_id, created_at desc);

-- Size limits so a signed-in user cannot use the table as free storage (a real brief is about 5 KB).
-- NOT VALID: applies to every new row without failing on rows that already exist. Dropped first so the limits can change on re-run.
alter table public.cases drop constraint if exists cases_result_size;
alter table public.cases drop constraint if exists cases_meta_size;
alter table public.cases drop constraint if exists cases_dx_size;
alter table public.cases add constraint cases_result_size check (result is null or octet_length(result::text) <= 40000) not valid;
alter table public.cases add constraint cases_meta_size check (meta is null or octet_length(meta::text) <= 2048) not valid;
alter table public.cases add constraint cases_dx_size check (dx is null or char_length(dx) <= 200) not valid;

-- At most 200 saved cases per user (about 8 MB at the size limit above).
create or replace function public.cases_row_cap()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.cases c where c.user_id = new.user_id) >= 200 then
    raise exception 'case limit reached (200)' using errcode = '54000';
  end if;
  return new;
end;
$$;
drop trigger if exists cases_row_cap_trg on public.cases;
create trigger cases_row_cap_trg before insert on public.cases for each row execute function public.cases_row_cap();

-- =====================================================================================
-- 2. Account deletion (required by Google Play). A signed-in user deletes THEIR OWN account;
--    saved cases go with it through the on delete cascade above.
-- =====================================================================================
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
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

-- =====================================================================================
-- 3. Anonymous usage counters and the daily analysis cap
--    Only counts per day, event and language, plus total milliseconds. The API server calls the two functions below.
--    They only work with a secret that lives in a private table and in the Vercel setting USAGE_KEY.
--    That secret can do nothing except add to these counters and read whether the cap has room.
-- =====================================================================================
create table if not exists public.usage_daily (
  day  date   not null,
  evt  text   not null,
  lang text   not null default '',
  n    bigint not null default 0,
  ms   bigint not null default 0,
  primary key (day, evt, lang)
);
alter table public.usage_daily enable row level security;      -- no policies: nobody can read or write it through the API
revoke all on public.usage_daily from anon, authenticated;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.usage_key (
  id  boolean primary key default true check (id),
  key text not null
);
alter table private.usage_key enable row level security;
revoke all on private.usage_key from public, anon, authenticated;
-- A random 64-character secret, generated inside the database. Created once; re-running does not change it.
insert into private.usage_key (key)
values (replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
on conflict (id) do nothing;

-- Reserves one of today's slots if any are left. 'analyze_start' therefore means "reached the model":
-- the server gives the slot back (usage_hit 'analyze_refund') when the model call fails before doing billable work.
create or replace function public.usage_gate(p_key text, p_lang text, p_cap integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_day  date := (now() at time zone 'utc')::date;
  v_lang text := case when p_lang in ('ko', 'en') then p_lang else '' end;
  v_used bigint;
begin
  if p_key is null or not exists (select 1 from private.usage_key k where k.key = p_key) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(hashtext('dermcase_usage_gate'));   -- one at a time, so parallel requests cannot overshoot the cap
  select coalesce(sum(u.n), 0) into v_used from public.usage_daily u where u.day = v_day and u.evt = 'analyze_start';
  if v_used >= greatest(coalesce(p_cap, 150), 1) then
    insert into public.usage_daily as u (day, evt, lang, n) values (v_day, 'analyze_capped', v_lang, 1)
      on conflict (day, evt, lang) do update set n = u.n + 1;
    return false;
  end if;
  insert into public.usage_daily as u (day, evt, lang, n) values (v_day, 'analyze_start', v_lang, 1)
    on conflict (day, evt, lang) do update set n = u.n + 1;
  return true;
end;
$$;

create or replace function public.usage_hit(p_key text, p_evt text, p_lang text, p_ms integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_day  date := (now() at time zone 'utc')::date;
  v_lang text := case when p_lang in ('ko', 'en') then p_lang else '' end;
  v_ms   bigint := greatest(least(coalesce(p_ms, 0), 600000), 0);
begin
  if p_key is null or not exists (select 1 from private.usage_key k where k.key = p_key) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_evt = 'analyze_refund' then
    perform pg_advisory_xact_lock(hashtext('dermcase_usage_gate'));
    update public.usage_daily u set n = greatest(u.n - 1, 0) where u.day = v_day and u.evt = 'analyze_start' and u.lang = v_lang;
    return;
  end if;
  if p_evt not in ('analyze_ok', 'analyze_rejected', 'analyze_truncated', 'analyze_error', 'analyze_timeout') then
    return;
  end if;
  insert into public.usage_daily as u (day, evt, lang, n, ms) values (v_day, p_evt, v_lang, 1, v_ms)
    on conflict (day, evt, lang) do update set n = u.n + 1, ms = u.ms + v_ms;
end;
$$;

-- Side-effect-free check that the secret is the right one. Used by /api/health to show whether counting and the cap are live.
create or replace function public.usage_check(p_key text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select p_key is not null and exists (select 1 from private.usage_key k where k.key = p_key);
$$;

-- Only the server proxy calls these, using the publishable key (role anon) plus the secret in private.usage_key.
-- Signed-in users never need them, so 'authenticated' gets nothing. The Security Advisor still lists the anon grant:
-- that is deliberate (a wrong key raises an error and does nothing; the key is 64 random hex characters).
revoke all on function public.usage_gate(text, text, integer) from public, authenticated;
revoke all on function public.usage_hit(text, text, text, integer) from public, authenticated;
revoke all on function public.usage_check(text) from public, authenticated;
grant execute on function public.usage_gate(text, text, integer) to anon;
grant execute on function public.usage_hit(text, text, text, integer) to anon;
grant execute on function public.usage_check(text) to anon;

-- =====================================================================================
-- Next steps (run these separately in the SQL editor)
-- =====================================================================================
-- A. Show the usage secret ONCE, copy it into Vercel as USAGE_KEY (mark it Sensitive), then redeploy:
--      select key from private.usage_key;
--    To rotate it later:  update private.usage_key set key = replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
--
-- B. Check every public table has row level security on (every row must say true):
--      select tablename, rowsecurity from pg_tables where schemaname = 'public';
--
-- C. Read the usage numbers any time (last 30 days, newest first):
--      select day,
--             sum(n) filter (where evt = 'analyze_start')     as reached_model,
--             sum(n) filter (where evt = 'analyze_ok')        as ok,
--             sum(n) filter (where evt = 'analyze_rejected')  as rejected,
--             sum(n) filter (where evt = 'analyze_truncated') as cut_off,
--             sum(n) filter (where evt in ('analyze_error', 'analyze_timeout')) as failed,
--             sum(n) filter (where evt = 'analyze_capped')    as blocked_by_cap,
--             round(sum(ms) filter (where evt = 'analyze_ok') / nullif(sum(n) filter (where evt = 'analyze_ok'), 0) / 1000.0, 1) as avg_seconds,
--             sum(n) filter (where evt = 'analyze_start' and lang = 'ko') as korean
--      from public.usage_daily where day > current_date - 30 group by day order by day desc;
