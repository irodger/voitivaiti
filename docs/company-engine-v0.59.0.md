# Basic Company Engine v0.59.0

## Saved structure

New world generation attaches `Company.structure` (version 1) to the existing company. It reuses the seed, current company maturity and existing primary-project industry/name. No new industry catalogs or industry-specific simulation are introduced.

The structure contains one product linked to its project, four departments and seven teams: Product, Payments, Security, Platform, Sales, Marketing and Support. Teams own capabilities and reference dependencies by persistent team IDs. Product depends on Payments, Security and Platform. Existing primary-project problems receive an owner team; the secondary project's separate content is unchanged.

The existing Company page displays type, industry, product, departments, ownership and dependencies. Unencountered teams have no generated people. The five existing core colleagues remain. `encounterTeam` materializes one stable contact on first real team assignment; its ID is saved in the team and roster and reused after reload.

## One structural cause

A saved Marketing campaign plan launches once on its scheduled workday (day 8–12, depending on seed/weekend). Calendar advancement also covers absence. The launch creates one new performance problem in the product project, owned by Platform, and one linked world fact recording source Marketing and target Platform.

Causal routing selects that fact ahead of fresh work. It uses the existing role-specific investigation graph. The task shows the campaign forecast and last verified capacity as a small artifact: a forecast is explicitly a risk, not a confirmed incident. The player inspects both records, compares the user path with shared load, chooses an existing scope, verifies and hands off to Platform/Marketing. The exact observed data and world trigger survive reload. Assignment materializes one Marketing contact; merely launching the campaign or opening Company does not.

No immediate money/stress changes, auto-repair or auto-awarded experience are attached to launch. Existing actions and outcome handling retain their numerical effects. A completed trigger is not reassigned; limited results continue through the established consequences mechanism.

## Compatibility and scope

Old companies without a structure stay intact and do not receive retroactive campaigns. Existing saves with a structure preserve it verbatim. No reorganization, dismissal, mail or labor-market mechanics. No hundreds of NPCs or new professions.

## Validation

Tests cover seeded determinism, all dependency/ownership references, no up-front NPC expansion, one-shot launch and reload, real performance task priority over a fresh bound task, player-discovered forecast data, contact reuse, SRE view and old saves. Company render tests cover visible structure and no render-time mutations.

Full suite: 421 tests pass. Browser checks at 1280×720 and 390×844: seven teams, task link, no page errors, no horizontal overflow and no render-time NPC creation. Production build passes. Visual artifacts are under ignored `e2e-artifacts/company-engine/`.
