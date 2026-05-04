# DermCase Assistant — Roadmap

_Last updated: May 2026_

---

## Phase 1 — Premise Validation

**Goal:** Confirm that a practicing dermatologist finds an AI-synthesized literature brief useful during or after a real case.

**Done criteria:**
- 5 dermatologist conversations completed on real cases
- Each conversation logged in CONVERSATIONS.md
- Clear signal (yes/no/maybe) on: does the literature brief save time or surface something they wouldn't have found?
- Decision point: proceed to Phase 2, pivot output format, or stop

**Timeline:** ~4 weeks from first conversation

**Constraints:**
- No auth, persistence, or analytics
- No visual UI redesign
- Prototype output = literature brief only (not teaching-tool output)
- 5 hrs/week available

### Phase 1 Work Items

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Rewrite system prompt → literature brief output | 🔲 open | Strip confidence, similar_cases, severity, workup. Output: assessment + targeted references. |
| 2 | Strip UI render to match new output schema | 🔲 open | Remove confidence bars, case landscape, severity/workup panels. Keep form + image upload intact. |
| 3 | Commit ROADMAP.md + CONVERSATIONS.md | ✅ done | This commit. |
| 4 | Recruit 5 dermatologists (lead: clinical partner) | 🔄 in progress | Email sent. Need 4 more via brother. |
| 5 | Run 5 conversations, log in CONVERSATIONS.md | 🔲 open | Gate: prototype changes (#1, #2) must ship first. |

---

## Phase 2 — (TBD after Phase 1 signal)

Depends on what Phase 1 conversations surface. Likely directions:
- Two-phase search (targeted per-diagnosis literature queries)
- ICD-10 codes on output
- PDF export for referral attachment
- Fitzpatrick skin type structured input

## Phase 3 — (TBD)

- Case history (localStorage)
- Saved case library with search (requires backend)
