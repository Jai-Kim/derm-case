// Optional database check: runs supabase-schema.sql (twice) against an in-process Postgres and tries to break it.
//   mkdir /tmp/pgt && cd /tmp/pgt && npm i @electric-sql/pglite && cp <repo>/tests/sql-check.mjs . && node sql-check.mjs
// Exits non-zero if any expectation fails. Stubs the Supabase roles and auth.uid(). Not part of smoke.js (needs the pglite package).
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
const db = new PGlite();
const sql = fs.readFileSync(process.env.SCHEMA || new URL('../supabase-schema.sql', import.meta.url).pathname, 'utf8');
// Stub the Supabase pieces the file relies on.
await db.exec(`
create role anon nologin; create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key default gen_random_uuid());
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth to anon, authenticated;
grant usage on schema public to anon, authenticated;
`);
let n = 0;
async function run(label){ try { await db.exec(sql); console.log('OK  run', label); } catch(e){ console.log('FAIL run', label, e.message); process.exit(1);} }
await run(1); await run(2);   // idempotent
const q = async (s, p) => (await db.query(s, p)).rows;
const key = (await q('select key from private.usage_key'))[0].key;
console.log('key length', key.length);
await run(3);
console.log('key unchanged after rerun', (await q('select key from private.usage_key'))[0].key === key);

async function as(role, fn){ await db.exec(`set role ${role}`); try { return await fn(); } finally { await db.exec('reset role'); } }
const t = async (name, fn, expectErr) => { try { const r = await fn(); console.log(expectErr ? 'FAIL (no error)' : 'ok  ', name, JSON.stringify(r)); if (expectErr) process.exitCode = 1; } catch(e){ console.log(expectErr ? 'ok   ' : 'FAIL ', name, '->', e.message.slice(0,70)); if(!expectErr) process.exitCode = 1; } };

// usage functions as anon
await t('gate wrong key rejected', () => as('anon', () => q("select public.usage_gate('nope','en',5)")), true);
await t('hit wrong key rejected', () => as('anon', () => q("select public.usage_hit('nope','analyze_ok','en',100)")), true);
await t('anon cannot read usage_daily', () => as('anon', () => q('select * from public.usage_daily')), true);
await t('anon cannot read private key', () => as('anon', () => q('select * from private.usage_key')), true);
await t('authenticated cannot read private key', () => as('authenticated', () => q('select * from private.usage_key')), true);
for (let i = 1; i <= 6; i++) await t('gate call ' + i + ' (cap 5)', () => as('anon', () => q("select public.usage_gate($1,'ko',5) as g", [key])));
await t('hit ok', () => as('anon', () => q("select public.usage_hit($1,'analyze_ok','ko',20000)", [key])));
await t('hit ok again', () => as('anon', () => q("select public.usage_hit($1,'analyze_ok','ko',30000)", [key])));
await t('usage_check right key', () => as('anon', () => q('select public.usage_check($1) as v', [key])));
await t('usage_check wrong key is false, no error', () => as('anon', () => q("select public.usage_check('nope') as v")));
await t('refund gives a slot back', () => as('anon', () => q("select public.usage_hit($1,'analyze_refund','ko',0)", [key])));
await t('gate after refund (cap 5)', () => as('anon', () => q("select public.usage_gate($1,'ko',5) as g", [key])));
await t('hit junk event ignored', () => as('anon', () => q("select public.usage_hit($1,'DROP TABLE','ko',1)", [key])));
console.log(await q('select * from public.usage_daily order by evt, lang'));

// cases: RLS, size caps, row cap, no update
const A = '11111111-1111-1111-1111-111111111111', B = '22222222-2222-2222-2222-222222222222';
await db.exec(`insert into auth.users(id) values ('${A}'),('${B}')`);
const asUser = (uid, fn) => as('authenticated', async () => { await db.exec(`select set_config('request.jwt.claim.sub','${uid}',false)`); return fn(); });
await t('A inserts own case', () => asUser(A, () => q("insert into public.cases(user_id,dx,meta,result) values ($1,'psoriasis','{\"age\":\"40\"}','{\"a\":1}') returning id", [A])));
await t('A cannot insert as B', () => asUser(A, () => q("insert into public.cases(user_id,dx) values ($1,'x')", [B])), true);
await t('B sees none of A', () => asUser(B, () => q('select count(*)::int as n from public.cases')));
await t('A sees own', () => asUser(A, () => q('select count(*)::int as n from public.cases')));
await t('A cannot update', () => asUser(A, () => q("update public.cases set dx='hack'")), true);
await t('anon cannot select cases', () => as('anon', () => q('select * from public.cases')), true);
await t('oversize result rejected', () => asUser(A, () => q("insert into public.cases(user_id,result) values ($1, to_jsonb(repeat('x',250000)))", [A])), true);
await t('oversize dx rejected', () => asUser(A, () => q("insert into public.cases(user_id,dx) values ($1, repeat('x',250))", [A])), true);
await db.exec(`insert into public.cases(user_id,dx) select '${B}','x' from generate_series(1,199)`);
await t('B 200th case allowed', () => asUser(B, () => q("insert into public.cases(user_id,dx) values ($1,'x')", [B])));
await t('B 201st case blocked', () => asUser(B, () => q("insert into public.cases(user_id,dx) values ($1,'x')", [B])), true);
await t('oversize meta rejected', () => asUser(A, () => q("insert into public.cases(user_id,meta) values ($1, to_jsonb(repeat('x',3000)))", [A])), true);
await t('result under the limit accepted', () => asUser(A, () => q("insert into public.cases(user_id,result) values ($1, to_jsonb(repeat('x',30000))) returning 1", [A])));
await t('B deletes own', () => asUser(B, () => q("delete from public.cases returning 1")).then(r => r.length));
await t('anon cannot delete_my_account', () => as('anon', () => q('select public.delete_my_account()')), true);
await t('A deletes account', () => asUser(A, () => q('select public.delete_my_account()')));
console.log('users left', await q('select count(*)::int as n from auth.users'), 'cases of A', await q("select count(*)::int as n from public.cases where user_id='"+A+"'"));
