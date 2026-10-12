# First-screen language — v0.60.4

Russian/English controls appear on the start and character-creation screens, using each language's own name. They use the same saved preference as Settings.

Without a saved locale, the primary browser language selects Russian for ru (including regional variants), otherwise English. Saved preferences take precedence, including existing installations. Changing screens or creating a new campaign does not reset a manual choice. Server-side tools retain their previous Russian default because they have no user's browser language.

The release dialog no longer auto-opens over onboarding; the version button still opens it manually. Existing in-game release behavior is retained.

Validation: 449 tests / 79 files passed, production build passed. Browser checks covered fresh English/Russian/German preferences, first-screen switching, manual choice after reload, and the Settings selector. Desktop and mobile screenshots confirmed the language controls are immediately visible; no page errors were observed.
