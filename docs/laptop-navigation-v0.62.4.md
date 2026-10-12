# Laptop orientation — v0.62.4

Mail and archived-step views retain a compact persistent current-work anchor outside the scrolling body. It names the current step and its application and returns to that step without dispatching a world action. The old archived-view return button was removed to avoid duplication. Empty reference applications retain their existing single return action.

The collapsed journey names the live current step. On phones its expanded stages form a vertical list, keeping future stages locked and completed stages reviewable. Duplicate header progress indicators are suppressed when the journey exists, and mobile app decoration is reduced to leave more room for work content.

Validation: 465 tests / 82 files passed; production build passed with the existing chunk warning. Browser checks at 1280×720 and 360×640 navigated through mail back to current campaign work, opened the journey and confirmed no task-state changes, page errors or horizontal overflow. Mobile screenshots confirmed the persistent return control and vertical locked-stage list.
