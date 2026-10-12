# Work selection — v0.62.2

Work cards reveal the existing owner, deadline, problem history, estimated duration and work description before selection. Color accents, icons and a selected checkmark distinguish work types and selected state. Urgency and queue age stay visible without repeating duration.

Selecting a card opens a separate consequence preview above the existing action dock. It does not dispatch a decision or start work. Existing priority actions and outcomes are unchanged. A short localized office joke adds personality without replacing factual context.

Validation: 465 tests in 82 files passed; production build passed (existing large-chunk warning). Desktop 1280×720 and mobile 390×844 browser checks verified selected state, consequence preview, no horizontal overflow, no page errors and unchanged saved world state when selecting a card. Confirming remains a separate action.
