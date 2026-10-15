# Professional laptop tools and evidence refactor — v0.62.10

## Architecture

`AppContext.tsx` is now a shared evidence shell (about 3 KB instead of 6.5 KB). Local search, source selection and reset behavior live in `hooks/useAppEvidence.ts`. `AppEvidencePanels.tsx` has focused editor, diagnostic, preview and conversation views, plus shared record/note views. Existing evidence filtering remains in the pure `appEvidence.ts` collector.

`content/laptopTools.ts` defines professional tool labels, descriptions and icon identifiers. `hooks/useLaptopTools.ts` resolves those descriptors for the active hero and locale. The launcher, taskbar, app header, return banner, journey icons and empty apps use the same catalog. Add a profile here rather than profession checks across UI components.

## Tools

- Designer: Figma and Prototype, with a light material/editor surface rather than a code editor.
- UX researcher: Research and Findings.
- Analysts: Data & models and Checks.
- Product: Product plan and Metrics.
- Project/delivery: Project plan and Dependencies.
- Manual QA: Test cases and Test runs; automation QA keeps coding tools.
- Support: Cases and Diagnostics.
- Architects: System design and Checks.
- Coding engineering roles retain IDE/Console behavior.

These are in-game workspaces; no external Figma integration was added. Existing AppId values (`ide`, `browser`, `console`, `chat`) remain stable in saves and task definitions. Tool labels describe the professional surface rather than changing task routing or outcomes.

`editorEvidence.ts` maps professional editors to material already recorded in legacy slots. Design observations inspected in a preview can be shown in Figma; selected planning facts from chat can appear in Project plan. Only stored observations, selected items, inspected rows and previously collected sources are presented. Original source apps keep their evidence. No rewards, work completion or new knowledge are granted by browsing.

## Validation

- 478 tests across 88 files passed; production build passed with the existing large-chunk warning.
- Catalog tests distinguish non-coding and coding roles and cover every existing profession and stable app id.
- Evidence tests exclude unread design rows and unselected plan items and retain correct material after JSON reload.
- Profession browser suite: 9 checks passed for frontend, backend, QA, designer, product, analyst and project, including the matrix and glossary Escape.
- Additional suite: 6 checks passed for designer, project, UX research, data analyst and support, including the matrix. Ten distinct professions were exercised across the two runs.
- A completed designer task was opened in Figma at 1280×720 and 360×640. Actual observations appeared, navigation left tasks unchanged, and no page errors or horizontal overflow occurred.
