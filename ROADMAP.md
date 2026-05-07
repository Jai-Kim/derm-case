# DermCase Assistant — Roadmap

_Last updated: May 2026_

---

## Phase 1 — Premise Validation

**Goal:** Confirm that a practicing dermatologist finds an AI-synthesized literature brief useful on a non-trivial case.

**Done criteria:**
- 5 dermatologist conversations completed on **non-trivial** real cases (uncommon presentation, treatment-resistant, edge case, atypical population — not routine bread-and-butter)
- Each conversation logged in CONVERSATIONS.md with structured signal questions
- Clear signal on the sharper success criterion: **did the brief change a management decision, OR meaningfully reduce search time on a case the derm rated non-trivial?**
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
| 1 | Rewrite system prompt → literature brief output | ✅ done | Commit 053b392, fix 1da71f0. |
| 2 | Strip UI render to match new output schema | ✅ done | Same commits. Confidence bars, case landscape, severity/workup panels removed. |
| 3 | Commit ROADMAP.md + CONVERSATIONS.md | ✅ done | Commit 45d2ccd. Updated this commit with sharpened criteria. |
| 4 | Recruit 5 dermatologists (lead: clinical partner) | 🔄 in progress | Email sent. Need 4 more via brother. |
| 5 | Run 5 conversations, log in CONVERSATIONS.md | 🔲 open | Gate: prototype + recruits ready. Each derm must bring at least one non-trivial case. |

### Where the brief is most likely to win (from pre-conversation feedback)
Concentrate test cases here, not on routine derm:
- Uncommon presentations
- Treatment-resistant disease
- Off-label treatment synthesis
- Pregnancy / immunosuppression edge cases
- Rapid updates on emerging biologic data
- Cases where morphology alone is insufficient

---

## Phase 2 — (TBD after Phase 1 signal)

Depends on what Phase 1 conversations surface. Likely directions:
- Two-phase search (targeted per-diagnosis literature queries)
- Evidence-strength visual indicators (guideline vs case report vs RCT)
- Treatment pathway comparisons (especially biologics)
- ICD-10 codes on output
- PDF export for referral attachment
- Fitzpatrick skin type structured input

## Phase 3 — (TBD)

- Case history (localStorage)
- Saved case library with search (requires backend)
