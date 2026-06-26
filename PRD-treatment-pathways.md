# PRD — Treatment Pathway Comparison

_Status: Draft · Author: PM (AI) + Jai · Phase: 2 candidate · Last updated: June 2026_

---

## TL;DR

Today DermCase returns a literature brief: an assessment plus a list of references. That **summarizes** what a dermatologist could find themselves. The next big feature should make the tool **change a management decision** — the only success bar that matters from Phase 1 feedback.

The bet: when a case has more than one viable treatment path (which is exactly the edge-case scenario where the tool earns its keep), generate a **case-specific, side-by-side comparison of treatment options**, each grounded in current literature with evidence strength, and surface the trade-offs a clinician actually weighs (efficacy, speed of onset, monitoring burden, contraindications for this patient, cost/access).

This is deliberately not the safe choice. It is the choice most likely to produce the reaction "I wouldn't have structured it that way myself."

---

## Why this, why now

### The signal from Phase 1 recruitment responses
- **Mixed academic/private derm (highest-signal):** the product risk is not "can AI summarize literature" — it's "whether the output is differentiated enough to justify behavioral change." Named the killer test: *does it change management or just summarize what I already know?*
- **Younger derm:** explicitly requested side-by-side biologic / treatment pathway comparison.
- **Academic derm:** highest value is uncommon presentations, treatment-resistant disease, edge-case biologic decisions "where nobody remembers the latest paper."
- **Private derm:** wants to get to relevant treatment options faster, and to trust the references.
- **Conservative derm:** wants clear separation of evidence quality (guideline vs case report) — which this feature foregrounds rather than buries.

### The competitive gap
OpenEvidence, Glass Health, UpToDate AI all converge on the same output: a well-cited answer or summary. Almost none produce a **case-shaped, decision-oriented treatment comparison**. A reference list is a commodity. A structured "here are your 3 viable paths for THIS patient, and here's what separates them" is not.

### Why it fits DermCase specifically
Dermatology is unusually treatment-pathway-rich: topicals vs phototherapy vs systemics vs biologics, with real trade-offs in monitoring, onset, pregnancy/immunosuppression safety, and cost. This is the specialty where a treatment comparison has the most decision value.

---

## Problem statement

A practicing dermatologist working a non-trivial case (treatment-resistant, off-label question, comorbidity that complicates the usual first-line, or a biologic-selection decision) currently has to assemble the decision themselves: pattern-match from memory, search JAAD/PubMed, text colleagues, check anecdotes in physician groups. The literature brief helps with one slice (search) but stops short of the actual decision: **which treatment, for this patient, and why over the alternatives.**

---

## Goals & non-goals

### Goals
1. When a case warrants it, produce 2–4 viable treatment options compared side by side, specific to the patient context entered.
2. For each option, surface the decision-relevant axes: efficacy evidence + strength, speed of onset, monitoring/safety burden, key contraindications for THIS patient, and access/cost where known.
3. Ground every efficacy claim in a real, recent citation with an evidence-strength tag (reuse the existing 6-level system).
4. Make it obvious when the model is uncertain or when evidence is thin — no false confidence.

### Non-goals
- Not a prescribing engine. It does not tell the physician what to do; it structures the decision they will make.
- Not a dosing calculator (Phase 3+ at the earliest).
- Not a replacement for the literature brief — this is an additional, conditionally-shown section.
- No auth, persistence, or analytics (still out for now).

---

## Key design decisions to resolve

### 1. When does the comparison show?
**Option A — Always.** Every case gets a treatment comparison.
**Option B — Conditional.** Only when the model judges the case has genuinely competing viable paths; routine cases just get the brief.
**Recommendation: B.** Forcing a comparison onto a clear-cut case is exactly the "summarizes what I already know" failure mode. The comparison should appear when it earns its place. The model returns an empty/optional block for routine cases.

### 2. Single call or two-phase?
The current architecture is a single Claude call with web search. A real treatment comparison needs: (a) confirm diagnosis, (b) search per-treatment evidence, (c) synthesize trade-offs. That's the two-phase search idea finally paying for itself.
**Recommendation:** Phase 1 of the call establishes the diagnosis + candidate treatments; Phase 2 runs targeted per-treatment literature searches; final synthesis composes the comparison. Progressive render: assessment appears first, comparison fills in.

### 3. How to handle the medico-legal surface?
The conservative derm's warning about "clinical assessment" language applies double here. A treatment comparison reads as closer to advice.
**Recommendation:** Frame explicitly as "literature-derived options for physician consideration," keep the existing disclaimer, and never rank a single "best" — present options with trade-offs and let the clinician decide. Decision-support framing, not recommendation framing.

---

## Proposed output schema (additive)

Extends the current schema with an optional `treatment_comparison` block:

```
{
  "assessment": [ ... ],          // unchanged
  "references": [ ... ],          // unchanged
  "treatment_comparison": {       // OPTIONAL — present only when case warrants
    "rationale": "1 sentence on why these options are in contention for this patient",
    "options": [
      {
        "name": "Treatment name",
        "evidence_level": "rct",            // reuse existing 6-level system
        "efficacy": "What the literature shows for this indication",
        "onset": "Expected time to meaningful response",
        "monitoring": "Required labs/monitoring burden",
        "key_consideration": "The single most decision-relevant factor for THIS patient (e.g. contraindicated in pregnancy)",
        "source": "Journal, year — DOI"
      }
    ]
  }
}
```

UI: a third result section, "Treatment options," rendered as a compact comparison (cards on mobile, table-like on wide screens), each option tagged with its evidence pill. Hidden entirely when the block is absent.

---

## Success metrics (Phase 1 validation lens)

This feature is validated by the same sharpened criterion, applied specifically:
- **Primary:** In ≥3 of 5 conversations on non-trivial cases, the derm says the comparison changed or sharpened a management decision (not just confirmed it).
- **Secondary:** The derm trusts the evidence tags enough to act on them (spot-check: do the citations hold up?).
- **Guardrail:** Zero instances where a derm flags the comparison as clinically unsafe or misleadingly confident. This guardrail outranks the primary metric — one unsafe output is more informative than three useful ones.

---

## Risks & how we de-risk

| Risk | Severity | Mitigation |
|------|----------|------------|
| Model fabricates efficacy data or citations | High | Two-phase search grounds each option in retrieved literature; evidence tags force the model to commit to a source class; spot-check protocol in conversations. |
| Reads as prescribing advice (medico-legal) | High | Options-with-trade-offs framing, never a single "best"; explicit physician-consideration language; existing disclaimer. |
| Latency — two-phase is slower | Medium | Progressive render; assessment shows immediately, comparison streams in. Set expectation with the quiet spinner. |
| Over-triggers on routine cases | Medium | Conditional display; model instructed to omit when one path is clearly standard. |
| Scope creep toward a dosing/prescribing tool | Medium | Hard non-goal in this PRD; revisit only after Phase 1. |

---

## What this explicitly defers

- PDF export, Fitzpatrick selector, case history — all still backlog. This PRD argues they are incremental; this feature is directional.
- Building this does **not** front-run the five conversations. If anything, it gives those conversations a sharper artifact to react to. But the conversations remain the gate: if the premise fails, this feature dies with it.

---

## Recommendation

Build a thin version of this **after the first 1–2 conversations**, not before. Those conversations will tell us whether treatment comparison is the right cut or whether the literature brief alone already clears the bar. If you need a bigger demo artifact now, this is the one to prototype — but prototype it knowing the conversations may redirect it.

This is the feature I'd bet the product's relevance on. It's also the one most likely to fail loudly — which is exactly why it's worth testing.
