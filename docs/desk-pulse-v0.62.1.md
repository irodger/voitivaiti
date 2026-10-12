# Work desk clarity — v0.62.1

The laptop task screen now shows a compact summary of the current next step, colleague replies, and the work queue. Counts come from current saved state; queued work is distinguished from work that can actually be selected. Existing meeting, review, active-task, time and location gates remain unchanged.

Reply counts exclude completed steps and replies already inspected. Navigation opens the current task or scrolls to existing saved-work and queue sections. Paused personal tasks are no longer duplicated in the remainder queue; delegated work remains visible.

Validation: 465 tests across 82 files passed; production build passed. Desktop 1280×720 and mobile 390×844 browser checks confirmed reply navigation, no horizontal overflow, no duplicate paused task, no browser errors, and unchanged task state after navigation. The build retains its existing large-chunk warning.
