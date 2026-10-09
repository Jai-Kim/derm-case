# DermCase — Decision Log

Real product decisions made during DermCase Assistant development. Each entry records the decision, what alternatives were considered, the reasoning, and who flagged the question.

This log exists because the small, day-to-day calls compound into the product's identity. Writing them down forces the reasoning to be defensible later.

---

## D-001 — Output format: literature brief over teaching tool
**Date:** May 2026
**Flagged by:** AI (Phase 1 week-1 plan review)

**Decision:** Reshape the prototype output from a teaching-tool format (differentials with confidence bars, classic/atypical/mimic case landscape, severity, workup) into a literature brief (1–2 diagnoses with rationale, 3–5 diagnosis-anchored references).

**Alternatives considered:**
- Keep the teaching-tool output and validate that
- Layer the literature brief on top, keep both
- Delay the reshape until after first conversations

**Reasoning:** Dermatologists in premise validation conversations need to react to the brief as a clinical tool, not evaluate it as a teaching aid. Confidence bars and case landscape framing anchor reviewers to the wrong mental model. Showing both adds noise. Delaying means the first conversations test the wrong hypothesis.

**Trade-off accepted:** Loss of the "complete demo" feel in exchange for a sharper question being asked.

---

## D-002 — Tracking: ROADMAP.md in the repo over Linear/Notion/GitHub Issues
**Date:** May 2026
**Flagged by:** User (week-1 plan check-in)

**Decision:** Track Phase 1 work items in `ROADMAP.md` and conversation outcomes in `CONVERSATIONS.md`, both committed to the repo. No external tool.

**Alternatives considered:**
- Linear or Notion
- GitHub Issues + Project board
- Plain Apple Notes / Google Doc

**Reasoning:** At 5 hours/week on a solo project, the heaviest tracking burden is the dermatologist conversation log, not engineering tasks. External tools add overhead without proportional value at this scale. Markdown in the repo means the tracking lives next to the code, gets git history for free, and disappears cleanly if Phase 1 gets killed. Revisit if collaborators join.

**Note:** GitHub Issues was attempted as a complement and blocked by an MCP-level limitation. Not worth fighting; ROADMAP.md is doing the job.

---

## D-003 — Recruitment in parallel with prototype work, not after
**Date:** May 2026
**Flagged by:** AI (push-back on user's instinct)

**Decision:** Send the recruitment email to the clinical partner the same day the plan was made, not after the prototype reshape was done.

**Alternatives considered:**
- Finish the prototype reshape first, then recruit
- Recruit one derm at a time
- Wait until 5 derms confirmed before any code change

**Reasoning:** Recruitment lead time is the #1 risk for Phase 1. Waiting on the prototype to be "ready" before reaching out costs 1–2 weeks of calendar time that doesn't compress later. The prototype reshape and recruitment are independent paths — running them in parallel means the prototype is ready when scheduling firms up, not the other way around.

---

## D-004 — UI scope: polish pass over redesign
**Date:** May 2026
**Flagged by:** AI (response to user's "more Silicon Valley UI" request)

**Decision:** Strip AI-prototype tells (4-step progress theater, rotating literature ticker, artificial delays, SHOUTY uppercase labels) and tighten typography. No new visual language, no new design system.

**Alternatives considered:**
- Full redesign with gradients, hero sections, glassmorphism
- Adopt a Linear/Vercel-style command-palette aesthetic
- Leave the UI alone until Phase 2

**Reasoning:** "Silicon Valley UI" can mean three different things — polished/refined, flashy/marketing, or dense/powerful. Only the first fits a clinical tool. Conservative dermatologists trust subdued professional interfaces and distrust flashy ones. The fix isn't to add visual stuff; it's to remove the tells that make the product look like a hackathon demo.

**Trade-off accepted:** No "wow" moment in the demo. The win is the product looks like it belongs in clinic.

---

## D-005 — Sharpened Phase 1 success criterion
**Date:** May 2026
**Flagged by:** AI (after reading 5 simulated derm responses)

**Decision:** Replace the original Phase 1 success criterion ("saves time or surfaces something they wouldn't have found") with a sharper, more falsifiable version: "Did the brief change a management decision, OR meaningfully reduce search time on a case the derm rated as non-trivial?"

**Alternatives considered:**
- Keep the original wording, infer signal from open-ended feedback
- Add a quantitative score (1–10 usefulness rating)
- Wait until after 2 conversations to define the criterion

**Reasoning:** The Mixed dermatologist's feedback ("test whether it changes management decisions or merely summarizes what I already know") is the killer test. Vague criteria produce vague signal. Three binary questions per conversation give a tally we can actually decide on after 5 sessions. Adding the "non-trivial case" qualifier prevents wasted conversations on routine cases that don't test the hypothesis.

---

## D-006 — Adopt ClickUp for roadmap, epics, and architecture (reverses D-002)
**Date:** June 2026
**Flagged by:** User

**Decision:** Stand up a ClickUp workspace (General space → "DermCase Assistant" folder) as the canonical home for the roadmap (Now/Next/Later lists), future epics, and architecture docs. ROADMAP.md remains in-repo as a lightweight pointer next to the code.

**This reverses D-002**, which chose ROADMAP.md over external tools. Honest reasoning for the change:
- The project has grown past what a single markdown file serves well: 13 epics across 3 phases, a current+target architecture, and a "beyond one-page app" evolution to plan.
- Future epics and architecture diagrams want a real planning surface — phases as lists, epics as tasks with status/priority, diagrams in docs.
- ClickUp is already connected and in active use elsewhere in the workspace (Sprints, Market Research, User Interviews).
- D-002's rationale (avoid overhead at 5 hrs/week for a handful of work items) was correct *at the time*. The scope has outgrown it.

**What stays true from D-002:** the heaviest tracking burden is still the dermatologist conversation log (CONVERSATIONS.md), and the in-repo docs remain the source of truth for decisions and conversation signal. ClickUp is for forward planning, not for replacing the validation discipline.

**Guard against the obvious risk:** adopting a planning tool can become a way to *feel* productive without validating. The roadmap explicitly gates all Phase 2/3 epics on Phase 1 signal. ClickUp organizes the plan; it does not authorize building ahead of validation.

## D-007: Design system v2 ("the viewing room"), one shared stylesheet

**Date:** October 2026
**Flagged by:** User ("overhaul so it's the most trendy and doesn't look like an AI template")

**Decision:** Replace Tailwind CDN + DaisyUI and the per-page bespoke CSS with one hand-written design system (`assets/ds.css`, `assets/ds.js`) used by every page.

**Why:**
- The previous look was a stack of rounded cards on DaisyUI with a cream and green palette, which reads as a default. DaisyUI also caused the purple-theme bug (v4/v5 variable mismatch) and the repeated palette drift, because every page carried its own copy of the tokens.
- One stylesheet is the single source of truth. A token change now reaches every page.

**The look:** Grayscale chrome with black ink for action. The only color is skin: the case photo and the Fitzpatrick I to VI spectrum (top strip, skin-type picker, brief header). The DARAE mark is black line art, so it sits natively. Pretendard Variable is the only typeface, which keeps Hangul and Latin matched in a bilingual product. Evidence strength is shown as a 1 to 3 bar gauge plus a word, never color alone. Light and dark themes via tokens, WCAG AA verified for every text pair.

**Rejected:** indigo accent (generic SaaS blue-violet, and the user already flagged purple), DARAE-green on cream (a default for any Korean-medicine brief), Bricolage Grotesque (overused, mismatches Hangul).

**Also changed:** model-generated text is now HTML-escaped before rendering (it was injected raw). References without a direct link now say "Opens a PubMed search" instead of implying a direct link. Fabricated landing stats ("15+ tabs", "20 min") and the unverified "built with practicing dermatologists" claim were removed.

## D-008: Scroll motion is meaningful, scrubbed, and optional

**Date:** October 2026
**Flagged by:** User ("animation with scroll", "look at this with top class UX/UI designer's eyes")

**Decision:** Add a small scroll-driven motion layer (`assets/motion.js`, `assets/motion.css`) to the landing and About pages only. The app stays still.

**Principle:** Every animation encodes something about the product. No generic fade-up on every section.
- Pinned "light table" scene: photo, scan, assessment, comparison, a reference opening. Progress is tied to scroll, so it rewinds.
- Statement that darkens word by word as you read it.
- The Fitzpatrick strip is the scroll progress bar.
- Evidence bars grow as you reach them (strength is the point).
- Privacy shown, not told: the photo dissolves while the saved brief stays solid.

**Engineering:** A small script writes scroll progress into CSS variables rather than native `animation-timeline`, because native support still excludes Firefox stable and older iPhones. Pinning is desktop only (900px and up); phones get the same story stacked, with a gentle reveal. With reduced motion, no motion class is added and every page is fully visible and static.

**Known limit:** Landing and About copy is injected by JS, so without JS the text areas are empty (link previews use the meta description). Pre-rendering the default language is a candidate follow-up.

## D-009: First 60 seconds: instant example brief, and a controllable wait

**Date:** October 2026
**Flagged by:** User ("what's your thought as a world-class web app designer?")

**Decision:** Treat the first minute of use as the main design risk, not the visual polish.
- "Load example" (and a button in the empty state) now renders a complete, clearly labeled example brief instantly. No photo, no API call, no cost. This resolves the earlier open question about the half-working sample loader. An example cannot be saved, shared, exported or copied, so it can never be mistaken for a real case. A real analysis replaces it.
- The wait (up to a minute) shows an honest elapsed-seconds counter and a Cancel button that truly aborts the request. No fake stage-by-stage progress, because the analysis is a single call.
- Example content is qualitative only (no invented efficacy percentages), and its references open a PubMed search rather than claiming direct links.

**Photo:** CDC Public Health Image Library has public-domain psoriasis photographs (IDs 4053 and 4055). They are 1969 to 1977 film photographs, so they read as vintage. Not embedded yet: needs a human to download and review the image. Recommendation: keep the illustrated lens on the landing page, and use a real photo only where realism helps a dermatologist judge the product.

## D-010: Stronger visuals and motion, and two lessons about verification

**Date:** October 2026
**Flagged by:** User ("the animations and visuals are still a bit weak and not the most trendy", "about section doesn't load anything")

**Shipped:**
- Hero is an interactive dermatoscope. A loupe follows the cursor (and drifts on its own) and reveals dotted vessels and white scale inside the plaques, naming what is under it. Illustration only, labeled as not a real patient.
- One orchestrated entrance on load: headline words rise out of masks, the lens pulls into focus, the brief assembles.
- Sources ticker (outlined type, skin-tone separators) that speeds up with scroll and reverses when you scroll up. Copy says the tool "prefers" primary sources, which is what the prompt instructs, not a guarantee.
- Bento grid of what is inside every brief, with a cursor spotlight on each tile.
- Giant footer wordmark whose letters swell as the cursor nears (variable font weight).
- Measurement ring on the scene lens, film grain on the closing band.
- Reduced motion: nothing moves on its own; the loupe still answers the cursor.

**Lesson 1: the About page was blank for a while.** An edit to its script deleted the single line that renders its text. Tests checked animation and errors but not that words existed. Added a guard that fails if any text element is empty on any page in either language. About was fixed and shipped on its own first.

**Lesson 2: performance regressions can hide.** The pinned scene stalled (2 fps idle, 1.3 second frames) because the lens illustration used SVG noise and blur filters, which are rasterized on the CPU. Bisecting looked misleading because removing almost anything "fixed" it, which pointed to a one-time first-paint cost. The fix was to pre-render the lens once into a 20KB image (same code as the hero) and remove the filters: 62 fps idle, worst scroll frame 100 ms. Rules going forward: no SVG filters or large background images inside the pinned scene; measure frame rate, not just correctness.

## D-011: A cut-off model answer must never become an error screen

**Date:** October 2026
**Flagged by:** User (real-device test, Korean case: "JSON parse failed", raw output ended mid-word)

**Cause:** The answer hit the 2,600 output-token limit and the JSON was left unfinished. Korean uses far more tokens than English, and the prompt asked for 3 to 5 references plus uncapped treatment fields. My tests used short mocked responses, so they could not see it.

**Fix, in layers:**
1. Prevent: strict length budget in the prompt (one sentence per rationale and relevance, short phrases per treatment field, 3 to 4 references, 2 to 3 options). `max_tokens` raised only modestly, to 3,000, because the function has a 60 second ceiling and longer answers take longer.
2. Survive: if the answer is still cut off, keep everything that arrived complete, drop the half-written part, and show a banner ("cut off, some sections may be missing") with a Run again button. Stress-tested at 1,250 cut positions, including Korean text and escaped quotes.
3. Recover: the error card says plainly that the answer was too long, has a one-tap retry, and no longer dumps raw JSON.

**Still unproven:** the length budget has not been run against the live model. Re-run the failing case to confirm.

**Lesson:** the gap I kept flagging (no run against a live model) is exactly where this bug lived. Any change to the prompt or limits needs a live check.

## D-012: Android and iPhone access via an installable web app first (route 1)

**Date:** October 2026
**Flagged by:** User ("what does it take to take this to an Android native app? That's a blocker for usage")

**Decision:** Ship an installable PWA now. Defer a Play Store listing until the pilot shows the tool is useful.

**Why:** The app already runs in Android Chrome. What testers lack is a home-screen icon, full-screen launch and a place to find it. A PWA gives that in a day, on Android and iPhone, with no store. A Play listing needs a $25 account, a health apps declaration and privacy policy, review, and for a new personal account a closed test with 12 testers for 14 continuous days (organization accounts are exempt; internal testing for up to 100 testers has no review and is the pilot path). Those are weeks for something unvalidated.

**Built:** web manifest with 192, 512 and maskable icons (DARAE mark), shortcut to a new case, install button on the app page (native prompt on Android Chrome; a short how-to on iPhone), offline page.

**Service worker rules:** network-first for every same-origin page and asset, so a new deploy always shows up when online and nothing goes stale. Offline it serves the last good copy of pages already visited, or a bilingual offline page. It never touches /api and never caches responses to analysis. Cross-origin requests (fonts, Supabase) are left alone.

**Next if a Play listing is wanted:** wrap this PWA in a Trusted Web Activity (Bubblewrap or PWABuilder), host assetlinks.json under /.well-known on a stable custom domain, distribute to pilot dermatologists through internal testing, and write the privacy policy (it must disclose that photos and health details go to a third-party AI provider).

## D-013: Play Store package prepared, and the privacy claims corrected

**Date:** October 2026
**Flagged by:** User ("proceed with installable version"; read as the Play Store app, since the installable web app shipped in D-012)

**Correction first.** The landing, About, login and app copy said photos are "discarded" and "not saved on any server". That overclaimed. DermCase stores no photos, but each photo is sent to Anthropic's API, which states it deletes API inputs and outputs within 30 days (up to 2 years if flagged for a usage policy violation) and does not train on them by default. The copy also said notes are saved; they are not. All reworded. A conservative physician in the simulated replies asked exactly "are patient images stored, is PHI retained", so this matters for the pilot as much as for Play.

**Built:**
1. `/privacy`, English and Korean, in the HTML itself so it reads with JavaScript off (store reviewers and crawlers). Linked from every page and from the app next to the Analyze button.
2. Account deletion (Play requires it when accounts exist): a Delete account button in the library, backed by `delete_my_account()` in `supabase-schema.sql`. The function must be run once in Supabase.
3. "Assessment" and the Korean equivalent became "Differential to consider" (copy-out text too). Footers now carry Google's required wording: not a medical device, does not diagnose, treat, cure or prevent, consult a professional.
4. Play package: `/.well-known/assetlinks.json` (empty until fingerprints exist), `android/twa-manifest.json`, store listing in both languages, icon, feature graphics, real phone screenshots, answer sheet for Data safety and Health apps, and a step runbook (`store/`). Package name `com.jai_kim.dermcase`, host `dermcase.jai-kim.com`.
5. `tests/smoke.js` in the repo, 194 checks: files and config, secret scan, claim guard (old overclaims cannot return), both languages at 1280 and 360 wide, the analysis path with a mocked model (complete, cut-off, rejected, server error), account zone.

**Bugs found while capturing screenshots:** the Korean sample case showed English site and duration; the English landing nav overlapped the brand at 360px; the Copy button always wrote English headings.

**Not done:** the Android file itself. The build needs Google's SDK and Maven and this sandbox's network policy blocks them. PWABuilder produces it in about ten minutes (`store/README.md`).

**Risks, stated once:**
- Regulatory. The app analyzes a clinical photo and proposes a differential. Regulators can treat that as a medical device regardless of disclaimers (the US decision-support exemption excludes image analysis; Korea's MFDS regulates AI image-analysis software). Internal or closed testing for the pilot is low exposure. Get a short regulatory consult before any public production listing.
- The Data safety "shared" answer depends on Google's definition of service providers. Read it before submitting.
- The privacy page falls back to the GitHub issues link until `DERMCASE_CONTACT_EMAIL` is set in `config.js`.

**Lesson:** the earlier test suites lived outside the repo and were lost when the sandbox reset. Tests that matter live in `tests/`.

## D-014: Security hardening before the Play listing, and anonymous usage counts

**Date:** October 2026
**Flagged by:** User ("let's really tighten as much as possible"; asked for basic usage tracking once the app is ready)

**Audit findings that drove this.** `/api/analyze` was an open relay onto the Anthropic key: any caller on any website could choose the model, prompt, tools and token count (CORS was `*`). The page had no CSP and loaded code from a CDN. Model output and shared links reached the DOM with only a weak URL check. The Supabase file lacked size limits, table-level revokes and a pinned `search_path`.

**Built:**
1. Proxy locked to one job. The server owns the model (`claude-sonnet-4-6`), the full system prompt (moved out of `app.js` into `api/_lib/prompt.js`, verbatim plus a prompt-injection guard), 3000 tokens and a web search capped at 8 uses. The browser sends only `lang`, `images` and `case`. Strict validation (types, enums, sizes, base64, magic bytes), same-origin check, no CORS, generic error codes, 55 s upstream timeout, text blocks only in the response.
2. Daily cap and counters in Supabase through two functions that need a private 64-character secret (`USAGE_KEY`). Chosen over a service-role key so a leaked secret cannot read any saved case. Fails open if unset or down.
3. Strict CSP (`script-src 'self'`, no inline script, no eval), HSTS, framing, nosniff, referrer, permissions and COOP headers in `vercel.json`. Every inline script moved to `assets/js/`. `supabase-js` and Pretendard vendored (hashes in `assets/vendor/VENDOR.md`).
4. `assets/safe.js`: links from the model or a shared report are followed only on a publisher allowlist over https, else the PubMed search. `/report` is `noindex` and shows an "unverified source" notice.
5. Supabase schema rewritten to be idempotent: owner-only select, insert, delete; revoked table privileges; size limits (40 KB per brief); 200-case cap; `search_path` pinned. Tested against a real Postgres (PGlite), including re-runs.
6. Usage counts: Vercel Web Analytics on four pages (cookie-free, skipped for Do Not Track and Global Privacy Control, never on report, login or library), plus the anonymous daily tally. The privacy page, listing, Data safety sheet and pilot kit changed from "no tracking" to the accurate wording; a test blocks the old claim.
7. `SECURITY.md`, `security.txt`, tests grown from 198 to 558 checks, including hostile-link and injected-HTML attacks and proof that the CSP blocks inline script and eval.

**Independent review (separate agent, code only):** no critical findings; the validation, CSP, SQL and DOM-sink checks held. Fixed from it: a crafted `#access_token` link could sign a visitor in as the attacker (Supabase client now ignores URL sessions and uses PKCE); junk requests burned the daily cap (slots are now reserved atomically, refunded when the model does no billable work); the "unverified" notice was missing from printed reports and the date is now labelled as stated in the link; web search results declared untrusted in the prompt; function `maxDuration` set in `vercel.json`; storage limits tightened; the privacy page still listed jsDelivr; stored ids escaped; `/api/health` added so the owner can see whether counting is live.

**Not covered, stated once:** the same-origin check is not authentication, so determined direct callers are limited by the daily cap, the Vercel firewall rule and the Anthropic spend limit, not by code. Supabase dashboard settings (CAPTCHA, password policy, redirect list) and two-factor on every account are owner actions listed in `SECURITY.md`.

**Lesson:** a working demo that is public is already a production system. The expensive mistake was a relay that trusted the browser.

## D-015: The wait is streamed, honest and 100 seconds long

**Date:** October 2026
**Flagged by:** User ("fix the 55 s cutoff"; "you make the decision based on the behavioral science research")

**Problem.** A real clinical photo takes about 30 to 55 seconds (the model reads the photo, runs up to 8 literature searches, then writes). The server gave up at 55 seconds, so a slow run could throw away a paid analysis. The old loading screen was generic gray bars and a seconds counter.

**Decision.**
1. The model call is streamed. The time budget is 100 seconds inside a 120 second function limit (Vercel Hobby with Fluid compute allows up to 300). A browser that sends `Accept: application/x-ndjson` receives one JSON object per line: `ready`, `hb` (every 8 s), `search` (cleaned query), `found` (a count), `w` (characters written so far), then `done` or `error`. Any other caller still gets the single JSON body.
2. What may leave the server is fixed: the search query as plain printable text (markup characters, control and bidi characters removed, 110 characters at most), a number of sources, and a character count. Result titles, URLs, citations and ids never do. A test fails if they do.
3. If the browser goes away (Cancel, closed tab) the server aborts the model call, so a canceled run stops costing money. The slot stays used, because the model may already have run.
4. The browser gives up after 40 seconds of silence (heartbeats make that a real fault) and shows the timeout message instead of spinning.
5. The loading screen is a light table: the user's photo in a dermatoscope ring with a slow scan line, the case details pinned beside it, three stages that follow real server events, the real search queries as they happen, and a progress bar drawn with the Fitzpatrick spectrum that eases forward and never goes back. It states "usually 30 to 60 seconds", keeps Cancel, switches to "taking longer than usual" after 75 seconds, ends with the bar filling and every step ticked, then the brief appears. With reduced motion every animation is off and the bar updates in calm steps.

**Supersedes** the "no stage-by-stage progress" line in D-009: the stages are now real events, not a guess.

**Why it looks this way (research, and its limits).**

| Finding | Source | Used as |
|---|---|---|
| People value a result more, and tolerate waiting more, when they can see the work being done | Buell and Norton 2011, Management Science (the labor illusion) | Real search queries and source counts, never invented steps |
| Waits feel shorter when occupied, explained and finite | Maister 1985, The Psychology of Waiting Lines | Case details pinned, named stages, "usually 30 to 60 seconds" |
| A bar that keeps moving is judged faster than one that stalls | Harrison et al., CHI 2010 | Eased, monotonic progress; real events only ever push it forward |
| Over about 10 seconds users need a progress indicator and a way out | Nielsen, response time limits | Bar, elapsed seconds, Cancel |
| People remember the peak and the end of an experience | Kahneman et al. 1993 (peak-end) | The bar completes and every step ticks before the brief rises in |

These are lab and online studies of generic waits, not of clinicians. "30 to 60 seconds" comes from measured runs; the daily counters keep total milliseconds, so the real average can be checked after the pilot.

**Deliberately not done.** No partial differential is shown while the answer is still being written: half a differential invites anchoring on the first line. No fake progress: if the server sends nothing, the bar only drifts on time and the screen says so after 75 seconds.

**Tests.** 641 checks, including incremental streaming in a real browser, Cancel, an error inside the stream, a 40 second silence (fake clock), reduced motion, a 360 px phone with a long query, and mutation checks (sanitizer removed, disconnect abort removed, result titles leaked: each is caught).

## D-016: Supabase sign-in settings, and why there is no CAPTCHA

**Date:** October 2026
**Flagged by:** User ("you drive supabase auth settings")

| Setting | Before | Now |
|---|---|---|
| Site URL | `http://localhost:3000` (every confirmation email would have linked to a dead page) | `https://dermcase.jai-kim.com` |
| Redirect URLs | empty | empty, on purpose: the app passes no redirect, so only the Site URL can ever be used |
| Email confirmation | on | on |
| Minimum password length | 6 | 10, with upper case, lower case and digits required |
| Secure password change, require current password | off | on (the app has no change-password screen, so nothing breaks) |
| One-time code and link expiry | 3600 s | 900 s |
| Anonymous sign-ins, manual linking, phone, SAML, Web3 and all social providers | off | off |
| Leaked-password check | off | not available on the Free plan (Pro). Covered by the length and character rules |
| Usage counter functions | callable by anon and signed-in users | anon only (the proxy uses the public key plus the 64-character secret). Signed-in users cannot call them |

**CAPTCHA: skipped.** Turnstile or hCaptcha would load a third-party script and frame, which breaks the strict CSP and the "no third-party code" promise, and the app works without an account. Sign-up and sign-in are limited to 30 per 5 minutes per IP, confirmation is required, and the email sender will be capped. Revisit if the Auth log shows sign-up abuse.

**Security Advisor, after:** 0 errors. The remaining items are deliberate: `delete_my_account()` is meant for signed-in users; the three usage functions are callable by `anon` but do nothing without the secret; the two counter tables have row security on and no policy, which means nobody can read them through the API.

**Open, found while checking:** Supabase's built-in email service only delivers to members of your own Supabase organization and sends 2 emails an hour, so a dermatologist who signs up would never receive the confirmation email. Fix: a real email sender (custom SMTP, planned with Resend on jai-kim.com). Until then, accounts work only for the owner. The app itself does not need an account.

**Also noted:** there is no "forgot password" flow in the app yet. With confirmation on, a user who forgets a password has no way back in except a new address.

