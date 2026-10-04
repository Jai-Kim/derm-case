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
