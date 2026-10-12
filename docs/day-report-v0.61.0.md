# Workday report — v0.61.0

Ending an office day captures a persistent report for that hero, company and calendar day. It lists actual completions since the saved day-start boundary, unfinished active/paused work, and eligible remaining queue obligations with agreed dates. Other heroes and delegated items are excluded. No report is fabricated for older saves without a snapshot.

Delivered results retain their committed summary. Temporary and evidence-only contributions are distinct; a named team recipient is shown only when saved team context and a completed handoff action support it. Pending consequence text is not exposed. Materials open in a read-only dialog showing recorded actions, inspected artifact rows and completed stages; viewing never resumes a task or repeats rewards.

The evening report belongs to the existing Home flow. Future days do not display a stale report as today's results. Task routing, deadlines, rewards and day settlement are unchanged.

Validation: full suite passed (451 tests / 80 files before two additional targeted campaign cases); targeted tests cover bounded/verified report handoffs, reload, no future-result disclosure, exclusion of other heroes/delegations, no fabricated prior-day completions and repeated end-day safety. Production build passed. Desktop/mobile browser checks confirmed persistent reports, unchanged tasks/active task, read-only materials, no page errors and no horizontal overflow.
