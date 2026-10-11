# Test review after causal routing

## Removed

- `problemStories`: the 30-task family/graph count test. Originally required seven cyclic families; later inverted to a ceiling of five. Neither expectation proves causal behavior. `causalRouting` and `paymentTriggers` directly protect decision sources, priority, consumption and reload.
- `roleLenses`: two duplicate all-profession routing loops. The existing role/domain/limited/shared completion matrix now also asserts the exact selected lens template. The roster coverage assertion remains in the shared-role test.
- `scripts/audits/interest-v0574.test.ts`: historical v0.57.4 report generator with no correctness assertions. It caught run errors into report text and overwrote the archived report during a normal test run. Historical report files remain untouched.

## Corrected

- The proper-fix story test now describes the actual peer review, rather than claiming an external contract update it never checks.
- The payment grade test now uses a payment base scene and payment problem together, instead of an interface scene paired with payment state.
- `vitest.config.ts` explicitly includes source regression tests and build tests. Local ignored probes and archived audit generators are not discovered by `npm test`. Puppeteer E2E stays in its existing separate command.

## Retained

Legacy save migrations, career/calendar safeguards, double-reward prevention, role completion matrix, causal chains and reload, UI regression assertions, PWA build tests, architecture boundaries and Puppeteer profession tests. Old version labels alone are not grounds for deletion: those tests still protect supported behavior.

Validation: normal `npm test` passes 413 tests in 69 files, including four build tests previously omitted from source-only runs. Production build passes. E2E files were reviewed but not changed or rerun for this test-only cleanup.
