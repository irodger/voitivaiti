# Workday priority pass — v0.60.0

## Finding

End-of-day logic retained urgency-based penalties alongside the newer concrete expectation/deadline system. A waiting item could receive an urgency penalty before its agreed due date, or receive both the legacy penalty and deadline pressure when overdue. This made agreements unreliable and obscured the effect of choosing another task.

## Change

Items with an expectation now use deadline pressure as their single waiting-pressure mechanism. Legacy items without expectations retain the previous urgency rules. Completion effects, escalation thresholds, task routing and balance coefficients are unchanged.

Both initial and remainder priority selection show actual remaining eligible obligations before confirmation. The preview distinguishes future, today, overdue and unagreed deadlines; excludes completed/delegated work; and explains that choosing a priority does not move other deadlines. It does not simulate outcomes or mutate the world.

## Validation

438 tests / 77 files and production build passed. Targeted tests cover no premature high-urgency penalty, a single overdue reaction, an extension preserved after serialization, and accurate read-only previews. Isolated desktop 1280×720 and mobile 390×844 browser checks found no page errors or horizontal overflow; choosing a preview leaves saved state unchanged.
