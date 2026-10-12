# Mobile UI — v0.62.3

Phone layouts use the full viewport for the laptop while retaining device-family branding. Navigation targets are 48px tall; the portrait close button is 44px. Action controls remain in the existing dock. Safe-area padding protects the upper and lower hardware insets. Landscape reduces the command bar to one row.

The game header places calendar/time on a separate row to prevent overlap with settings. Office entry has a labelled full-width mobile button before the scene; the current-work brief is compact. The laptop profile retains name, role and stats but removes the large decorative photograph and duplicate current-work card on phones.

Validation: 465 tests / 82 files passed; production build passed with the existing chunk warning. Browser checks at 360×640, 390×844, 430×932 and 740×360 confirmed navigation targets, selected work, consequence preview, unchanged saved state and no horizontal overflow or page errors. Actual campaign work/owner-waiting scenes were checked at 360 and 390px. Header and compact office were visually rechecked at 360px. Hardware safe areas were implemented in CSS, not verified on a physical phone.
