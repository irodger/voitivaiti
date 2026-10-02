# Neighborhood art — v0.12.0

Generated with the built-in `image_gen` tool in image-reference mode. PNG originals are preserved in the generated images directory; shipped assets are encoded as WebP without changing the composition.

## Shipped assets

- `public/art/neighborhood-premium.webp` — sunset courtyard, park and riverside, 1448 × 1086. Style reference: `public/art/apartment-premium.webp`.
- `public/art/neighborhood-night.webp` — matching night lighting, 1448 × 1086. Reference: the generated sunset image.

## Sunset prompt

Use case: stylized-concept. Production environment background for cozy Russian IT life sim Войти Вайти, landscape 4:3. Create an inviting ISOMETRIC MINIATURE CITY BLOCK DIORAMA where a junior worker can take an evening walk. The attached apartment is a STYLE REFERENCE only: premium tactile handcrafted 3D look, soft believable textures, sage green and warm terracotta palette, golden sunset with warm glowing windows and lanterns, cinematic ambient occlusion, finely detailed cozy environment. Outdoor scene with ONE modest mid-rise apartment building on LEFT BACK, welcoming lit entrance near x26% y52%; peaceful paved residential courtyard and one bench LEFT FRONT at x28% y76%; a tiny green park with mature trees, path and bench CENTER RIGHT at x65% y65%; a narrow canal / river promenade on FAR RIGHT BACK at x78% y30%, a little pedestrian bridge and warm lamp posts. Places are connected by plausible paved paths. Keep routes visually readable and the courtyard/park/river separate. This is a small lived-in neighborhood, not a whole city map. A few subtle planters, bicycles near the building, fallen leaves, calm reflected evening light on water; no cars, no close-up people, no UI or lettering, no coffee shop. Isometric full diorama centered filling the image with narrow muted sage margin, all edges visible, high-end indie game art, soft sunset shadows, no logos, no floating interface or map markers.

## Night prompt

Edit this game environment into a true NIGHT LIGHTING VARIANT. Preserve EXACT composition, camera, 4:3 framing, all apartment building geometry, canal, benches, bridge, tree and walkway positions. No objects move, no new props. Replace golden sunset with deep soft blue moonlit night. Apartment windows glow amber, each lamppost casts a small warm pool on the paving, reflections from lamps shimmer in dark blue canal water. Sage-and-oak palette stays recognizable under moonlight. Interior windows give a cozy lived-in feeling. Rich realistic 3D miniature diorama, readable silhouettes and paths; do not make scene too dark, preserve fine textures, soft ambient occlusion, premium indie-game rendering. No text, no characters, no UI. This is a matching night sprite of the same neighborhood game scene, keep placement invariant so the game hotspots remain accurate.

## Integration

The scene keeps a shared 4:3 frame for artwork and route buttons. Screen positions: courtyard (27%, 65%), park (66%, 62%), riverside (83%, 36%). Mobile moves the riverside label inward to 78% to keep it visible. At night (22:00–06:00) the matching night image replaces the sunset lighting. Route trails and the player marker appear after choosing a route, along with the resulting observation. Reduced-motion preferences disable the decorative animations.

The engine owns route availability, time and recovery. A saved walk stores its day, phase, route, observation and actual stress change. Returning before selection costs nothing. Returning after a completed walk keeps the evening activity completed. Other evening activities remain available. Routes have stable IDs: `courtyard`, `park`, `river`; existing `evening_choice` events include `routeId`, `minutes` and `day`.

