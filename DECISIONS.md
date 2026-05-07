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
