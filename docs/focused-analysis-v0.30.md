# Focused analysis and changes — v0.30

## Investigation continuity

After v0.29 an environment experiment was inspectable, but the metric alternative still yielded prose. The next crosscheck claimed differences in both sources and versions without showing the second source; version differences were not justified in every encounter.

Added a small authored response-time series with timestamps, explicit values and a measurement-scope record. The crosscheck exposes a concrete QA report and neighboring-flow metrics. Its conclusion distinguishes evidence of a separate overall spike from proof of the reported failure; it no longer assumes differing versions. This remains authored evidence for the existing scene, not live metrics derived from project stability.

Required artifact readings gate the player-facing comparison. Existing direct transitions remain compatible. New snapshots preserve source evidence after reload. Multiple available artifact investigations now start as compact expandable actions rather than simultaneously opening large panels.

## First-day usability

User screenshots showed oversized gaps between introductory speeches and apparent conversation targets. Base speech margins compounded the parent layout gap. Team introductions now form a compact group, explain that colleagues are introducing themselves, and keep the next action outside the desktop scroll area. The next destination follows the existing visited-state logic (project or meeting).

Office labels during introductions are spans without click handlers, hover interaction or unread-topic dots; actual office conversations resume once the work step is reached. Other stages retain normal behavior. Team layout changes are scoped to the first-day list.

Russian first-call copy introduces human meaning before “дейли” and explains the recurring workday cadence. Glossary title is Дейли in RU and Daily in EN; both aliases still work. Meeting choice and onboarding progression are unchanged.

## Checks and limits

Targeted tests: source inspection before conclusions, required measurement scope, crosscheck after either hypothesis, saved evidence, completion; chart values/timestamps readable without color; onboarding next destination, non-interactive introduction labels, Russian glossary and recurring explanation. Browser checks cover desktop introduction layout/action, daily popover, mobile flow, metric chart and crosscheck. All 271 tests passed; production build and whitespace checks passed.

This is a focused correctness/usability pass, not a new full career or economy audit. It does not establish enjoyment or comprehensibility for a live non-IT playtester.
