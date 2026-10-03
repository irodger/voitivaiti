# Focused analysis after v0.28 and v0.29 changes

## Finding

v0.27/v0.28 made source evidence and prior results inspectable, but most interactions still consisted of opening two text entries and confirming. This improves visibility but does not itself simulate an experiment. Other laptop apps have reference value, though they still largely share collected notes. This is a focused source/UI review, not a new full balance audit or evidence of enjoyment for a non-IT playtester.

## Implemented

QA investigations and story environment comparisons now expose test conditions, an explicit repeat-action control and a result produced only after testing. Selecting conditions alone reveals no result. Both orders of exploration are valid. Selected conditions persist separately from inspected evidence. The current result is shown once; previous test conditions provide comparison. Completed scene history retains all tested results.

For payment QA tests, network conditions stay slow while the interaction changes from a single click to a double click. The latter produces two requests/orders, so the difference is visible without knowing HTTP. Existing glossary handles technical fragments. Tests run on a copy: opening/selecting/repeating does not repair production or award resources. Existing comparison applies the action's original time and effects once.

## Verification

Targeted engine tests cover result timing, selected-condition reload, both orders, immutable production during experiments, invalid/optional condition selection, incomplete comparison and repeated completion. Existing long world-story and career tests use artifact actions. Browser: 390x844 selection, testing, reload and comparison; 1366x768 continuation. No user save is used.

## Remaining limits

Results are small authored simulations, not a live application/network emulator. Most other artifacts remain focused record inspection. Other professions and app-specific reference materials can be expanded gradually with evidence appropriate to their roles. Career/economy balance is unchanged; this pass makes no new balance claim.
