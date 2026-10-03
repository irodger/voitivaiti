# Office composition and interaction — v0.32.0

The previous three-desk room could not accommodate five colleagues and the player. Its meeting coordinates overlapped, and character dimensions were based on viewport width rather than the office plate.

## Changes

- Six countable workstations, with the player laptop at lower left.
- A separate open meeting rug, six spaced destinations, and an unobstructed central aisle.
- Character dimensions now scale with the room plane. Seated pose at workstations; standing pose for walking and gatherings. Player character is visible too.
- Small per-character movement delays reduce simultaneous departure. Existing authored waypoint paths remain presentation logic, not physical collision avoidance.
- Laptop hotspot moved to the new workstation. Existing colleague conversations remain available after introductions. Character targets have expanded touch hit areas; labels move with their body.

## Asset

Built-in imagegen, final project asset public/art/office-six.webp (273728 bytes). Encoded as WebP; no manual image editing.

Final prompt: Redesign this game office background plate keeping warm premium cozy isometric 3D style, sage green walls, wood furniture, plants, window light. MUST provide SIX distinct individual computer workstations each with ONE empty chair, monitor or laptop and keyboard. All desks must be visibly countable and each chair reachable. Layout: three compact workstations along rear wall (upper half), three along left side (middle half). Broad unobstructed walking aisle through center/right. Bottom right quarter is an EMPTY open rug meeting area for five standing people; no furniture on that rug. Player laptop workstation at lower left. No humans, no characters, no text. Camera slightly more top-down than reference, full room with all six chairs visible. Landscape 4:3 composition. Avoid extra desks, avoid bulky sofa, avoid clutter obstructing aisles.

## Verification and limits

275 tests passed; production build passed. Added regression covering distinct, separated work/meeting/lunch places for all six characters. Browser checks used an isolated-origin fixture for meeting/work transitions and conversation opening; desktop and 390×844 meeting labels had no overlaps or horizontal overflow.

Characters retain the existing vector avatar palette; they are not newly generated 3D sprites. Sitting is a simplified front-facing pose. There is no general dynamic collision, furniture masking or saved autonomous NPC simulation. Existing gameplay transitions and saved campaign data are unchanged.
