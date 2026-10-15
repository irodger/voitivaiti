# UI component boundaries — v0.62.9

## Scope

Two large UI coordinators were split without changing game actions, save schema, balance or styling. Laptop.tsx shrank from 7,119 to about 2,900 bytes; Mechanic.tsx from 9,227 to about 5,200 bytes. Their public entry components remain unchanged for callers.

## Laptop

- `Laptop.tsx`: device frame, modal interaction, navigation bar and taskbar.
- `hooks/useLaptopWorkspace.ts`: local app/desk/history state, current-step synchronization, mail-to-task navigation and workspace scroll coordination. Only the same pre-existing resume/reward actions are dispatched.
- `laptopContentKind.ts`: pure screen precedence. Mail remains accessible during a pending reward, reward takes precedence over the desk, and blocked work stays blocked when history is selected.
- `LaptopContent.tsx`: shared workspace headers and the selected application's content; animation keys and ActionPanel placement are retained.

## Work stages

- `Mechanic.tsx`: stage composition and existing domain-specific renderers.
- `StepIntroduction.tsx`: task brief, causal context, initial problem history and direct stage heading. It returns a fragment so scroll selectors and CSS still see the same DOM structure.
- `StepItems.tsx`: checklist, ordered-plan and allocation controls with existing action identifiers and read-only rules.
- `StepOptions.tsx`: choice rendering and existing confirmation-dock behavior.
- `hooks/useStepExecution.ts`: scoped run timer and cleanup. The original task/step identifiers, timing and read-only guard are retained.

New mechanics should extend a focused renderer rather than add navigation or input logic back into the coordinators. No generic plugin framework or new state store was introduced.

## Validation

- 474 unit tests across 86 files passed, including four targeted screen-precedence tests.
- Production build passed with the existing large-chunk warning.
- Real-browser campaign checks on desktop and phone covered owner waiting, reply readiness after reload, inspection, returning from mail, expanded stage history and a limited-work result. No task mutations from navigation, page errors or horizontal overflow.
- Profession e2e: all 5 selected checks passed (profession matrix, frontend, QA, backend, glossary Escape). These exercise first-day onboarding, initial action, save/reload, all three device families, phone sizing and the frontend terminal/review timers.
- Updated stale e2e setup: release notes are optional on the start screen but can appear after reload; continuation uses the main work button; the mobile frame may equal viewport width.
