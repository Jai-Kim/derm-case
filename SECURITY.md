# DermCase security

DermCase is a literature-brief tool for clinicians. It handles clinical photos and case details, so the security model is written down here and enforced by tests (`node tests/smoke.js`).

## Report a vulnerability

Email jaikyeong.kim@gmail.com (also in `/.well-known/security.txt`). Please do not open a public issue for a live vulnerability. Include the page, the steps, and what you could reach. I will acknowledge within a few days. There is no bounty.

## Threat model

| Asset | Threat | Control |
|---|---|---|
| Anthropic API budget | Anyone calling `/api/analyze` directly, or using visitors' browsers to do it | The server owns the model, prompt, token limit and tools; strict request validation; same-origin check; per-instance burst filter; daily cap (default 150) with anonymous counters; Vercel firewall rate limit; Anthropic monthly spend limit (set in the Anthropic Console) |
| Clinical photos and case text | Leak through logs, storage or third parties | Photos are never stored by DermCase; the server logs no request content; the only recipient is Anthropic; no third-party scripts or fonts load in the browser |
| Saved briefs | Another user reading them, or storing junk | Row level security with select, insert and delete for the owner only; no update; table privileges revoked from `anon`; size limits and a 500-case cap per user |
| User's browser (XSS) | Hostile model output, a hostile shared link or a hostile saved case running script | `script-src 'self'` with no inline scripts and no eval; all dynamic text escaped; links followed only to an allowlist of publishers over https; `/report` shows an "unverified source" notice |
| Page integrity | Framing, MIME sniffing, downgrade, plugin content | `frame-ancestors 'none'`, `X-Frame-Options`, `nosniff`, HSTS, `object-src 'none'`, `base-uri 'none'`, `Permissions-Policy`, COOP |
| Supply chain | A CDN or package serving altered code | `supabase-js` and the Pretendard font are vendored with pinned hashes (`assets/vendor/VENDOR.md`); the API has no npm dependencies; no build step |
| Secrets | Committed keys | `.gitignore` blocks keystores; the test suite scans every tracked file for key patterns; git history was checked |
| Usage counters | Someone inflating or exhausting them | The two counter functions only work with a 64-character secret held in a private table and in Vercel (`USAGE_KEY`). That secret can only add to the counters; it cannot read cases or users |

## What is deliberately not here

- No accounts are required, so there is no login to brute force on the analysis path.
- No Supabase service-role key is used anywhere. A leaked `USAGE_KEY` cannot expose a single saved case.
- The same-origin check is not authentication. It stops other websites from using visitors' browsers. A person with `curl` can still call the endpoint, which is why the daily cap, the firewall rate limit and the Anthropic spend limit exist.

## Checklist for the owner

| # | Where | Action |
|---|---|---|
| 1 | Supabase, SQL editor | Run the whole `supabase-schema.sql`. Safe to re-run. Then run `select key from private.usage_key;`, copy the value |
| 2 | Vercel, project Settings, Environment Variables | Add `USAGE_KEY` with that value, set it as Sensitive, for Production. Optional: `DAILY_ANALYSIS_CAP` (default 150). Redeploy |
| 3 | Vercel, project Settings, Web Analytics | Enable Web Analytics (page views, cookie-free) |
| 4 | Anthropic Console, Limits | Set a monthly spend limit. This is the hard backstop for the API budget |
| 5 | Vercel, Settings, Environment Variables | Confirm `ANTHROPIC_API_KEY` is marked Sensitive and is not set for Preview deployments you do not need |
| 6 | Supabase, Authentication | Require email confirmation; set minimum password length 10 or more; enable leaked-password protection if your plan has it; enable CAPTCHA (Turnstile or hCaptcha) on sign-up and sign-in; set Site URL to `https://dermcase.jai-kim.com` and keep the Redirect URLs list to that domain only |
| 7 | Supabase, SQL editor | `select tablename, rowsecurity from pg_tables where schemaname = 'public';` Every row must say `true`. Also open Advisors, Security Advisor, and clear any warning |
| 8 | GitHub, Settings, Code security | Turn on Dependabot alerts and secret scanning push protection |
| 9 | Accounts | Turn on two-factor authentication for GitHub, Vercel, Supabase, Anthropic and Google Play |

## Rotating the usage secret

`update private.usage_key set key = replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');` then copy the new value into Vercel `USAGE_KEY` and redeploy. Until then, counting and the daily cap are off (the analysis keeps working).

## Reading the numbers

The query for daily counts is at the bottom of `supabase-schema.sql`. Page views are in the Vercel dashboard, Web Analytics.
