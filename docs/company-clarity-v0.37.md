# Company clarity pass — v0.37.0

## Findings

The former page led with the generation seed; four unexplained numbers did not tell a newcomer which direction was good. Assigned projects looked like unavailable actions. All unresolved problem states used one generic progress label. Technical identifiers and a developer TODO appeared in the main reading flow. History expanded without bounds and legacy actor references could crash rendering.

## Changes

An identity header leads with a composite company mark: employer-family symbol, layered tile, seed-stable accent variation. It stays the same across locale and reload, without new raster assets.

Metric cards explain what numbers mean and whether higher or lower is preferable. Overall company context is explicitly separated from project state. The project card shows the current assignment as a badge and explains when switching is blocked. Actual problem states have distinct plain-language labels. Technical details are optional, workaround limitations remain visible, and missing legacy actors are handled safely.

The ten latest events form a timeline; earlier records remain expandable. No simulation, finance or promotion rules changed.

Validation: regression checks for metric direction, current project status and absent legacy actors passed. Production build and whitespace check passed. Inspected the mobile Company page in the in-app browser.
