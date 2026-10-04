# Mobile installation UX

The existing manifest, registration, worker caching and update controls are preserved. Installation uses the deferred browser event already captured by `startPwa`; `installApp` now reads native `userChoice` when available.

An inline mobile-only suggestion appears at home after a paid workday, outside active tasks, conversations, incidents, walks, deliveries, montage, settings and modal dialogs. Native prompting requires an explicit button click. iPhone/iPad users get a compact inline Share → Add to Home Screen → Add instruction. Unknown capabilities do not produce a nonfunctional button. Settings retain a manual installation entry when native or iOS installation is available.

A separate `voiti-vaiti-install-ux` local-storage key stores installation and dismissal memory. One refusal delays the next suggestion by fourteen days; three refusals stop automatic suggestions. This never mutates the campaign save. Installed display mode and iOS standalone detection remain in the existing PWA controller.

Validation: 317 tests passed, including native deferred prompting, appinstalled, standalone UX suppression, iOS instructions, settings entry, dismissal persistence and existing update/worker tests. Production compilation verified separately. Actual device installation requires a supported browser on the published HTTPS origin; it has not been performed on a physical phone during this change.
