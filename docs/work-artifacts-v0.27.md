# v0.27 — small work artifacts

Evidence lives on TechnicalAction.artifact. Records have stable IDs and localized labels/data; optional records provide context without gating progress. StepProgress.artifactReadings stores inspected IDs, including unfinished comparisons. The artifact-inspect action validates the currently available graph action and record, records discovery without rewards/time penalties, and is idempotent. artifact-compare requires the substantive records, then runs the existing action once: its observation, time, effects and next actions remain authoritative.

Initial scope: Frontend starter source fragments; Frontend network/component evidence; QA reproduction conditions; SRE version/metric comparison; Product and Designer user/context evidence; saved artifact scenes. Other professions retain existing scenes and receive task context/collected evidence in laptop apps. This is a focused first set, not a full professional tool for every role.

All records are large buttons. Instructions explicitly identify the two records to compare; optional context is labeled. No correct/incorrect answer selection, repeated retry, pixel targets or penalty for inspecting context. Glossary buttons live inside record detail containers, not inside the record button.

Old direct technical-action transitions remain compatible with previous saves and simulation consumers. The player-facing artifact path uses artifact-inspect followed by artifact-compare. Completed actions cannot be repeated. Old stored scene snapshots are preserved rather than silently rebuilt.

Checks: targeted engine regressions for observation timing, incomplete comparison, irrelevant/invalid exploration, reload and duplicate prevention; role relevance and RU/EN keys; existing full suite; production build; browser at 390×844 and 1366×768 with actual laptop styles, glossary popup, reload, comparison and other app context.
