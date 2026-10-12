# Morning continuity — v0.61.1

Morning meetings use the last saved end-of-day report for the same hero/company. The report's actual calendar date is shown, including returns after weekends. The view distinguishes a saved task, a still-pending request, a received reply, an already-open obligation and a genuinely new causal fact following a delivered result.

Only available world facts are shown. Scheduled future consequences are not read. Current deadlines come from live agreements rather than the old report, so postponements and delegation are respected. Existing scenes, calendar settlement, rewards and routing are unchanged; the briefing is a pure view and the morning plan still uses the existing action.

The card is compact with expandable facts and deadlines. It directs the player to existing laptop Tasks after the meeting. Older saves without a day report, different heroes/companies and same-day reports do not fabricate a previous workday.

Validation: 458 tests / 81 files, production build, and desktop/mobile browser checks after a bounded campaign. The new causal fact and briefing persist after reload; completing the sync does not change tasks or the saved report. No horizontal overflow or page errors were found. Targeted tests cover both campaign continuations, reply states, current deadlines, delegation, serialization and missing/stale context.
