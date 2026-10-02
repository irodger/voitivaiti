# Tech and parcel art — v0.13.0

Generated with the built-in `image_gen` tool, new transparent sprite atlases. Original PNGs are preserved under the generated-images directory. WebP optimization preserves alpha; no background removal or manual image edits were used.

## Saved assets

- `public/art/tech-premium.webp` — 1254 × 1254, a 2 × 2 atlas: monitor, keyboard, headphones, router. Used by the catalog, parcel reveal and owned apartment props.
- `public/art/parcel-premium.webp` — 1774 × 887, a two-frame atlas: sealed box / open box. The sealed frame clips its empty right margin to exclude an adjacent flap.

## Tech prompt

Use case: stylized-concept. Asset type: one transparent game sprite atlas for the cozy Russian IT life game Войти Вайти. Create a square 2 by 2 sheet of FOUR distinct premium tactile 3D miniature tech objects, each perfectly centered within its own equal quadrant with generous clear transparent margins. Upper left: a 27-inch dark forest-green desktop monitor with slim bezel and elegant stand, screen glowing soft sage with minimal abstract window blocks, NO text. Upper right: a compact mechanical keyboard with creamy ivory keycaps and 4 sage accent keys, walnut side casing. Lower left: warm cream over-ear noise-cancelling headphones with sage cushions, realistic headband and soft padding. Lower right: compact ivory Wi-Fi router with two short antennas and tiny green indicator lights. Camera consistent across the entire sheet: elevated three-quarter isometric view, objects pointing slightly toward the LEFT with right side visible, warm soft light from upper left. High-end indie game rendering, finely modeled materials, rounded realistic shapes, muted sage, oak, cream palette. Objects do not touch or overlap each other or quadrant boundaries. EXACT four objects, one in each quadrant, no extra props, no labels, no lettering, no borders, no floor, no backgrounds, no logos, no watermark. Genuine transparent background, subtle shadows directly below each object only.

## Parcel prompt

Use case: stylized-concept. Asset type: single transparent horizontal 2-frame game sprite sheet. Two views of the EXACT SAME unbranded premium kraft cardboard delivery box, consistent isometric three-quarter perspective and warm soft light, tactile corrugated cardboard fibers, sage-green paper packing tape. LEFT HALF: box CLOSED, lid sealed with green tape, corners and all geometry readable. RIGHT HALF: the identical box OPEN, four cardboard flaps folded outward, cream crumpled packing paper visible around empty dark inside; no product inside. Each box centered in its own half with generous transparent margin. Full boxes and flaps visible and separate, no overlaps, no text or shipping labels, no logos, no hands, no floor, no props. Cozy high-end 3D indie game object rendering matching cream, sage, oak interiors. Genuine alpha transparent background, very soft shadow immediately under objects. Landscape 2:1 atlas, exact closed left / open right layout.

## Integration

`TechArt` uses the same atlas quadrant in each scene. Apartment coordinates are relative to its existing 4:3 frame. Deliveries use the existing order and ownership state; `home.deliveryItemId` saves the selected parcel, while `order.received` determines whether the seal is open. Inspecting a parcel is free. Unpacking installs ownership once. Closing the scene returns to shopping or the apartment. Opening stages never award immediate sleep or work bonuses; those are applied by the existing game loop.

The scene has keyboard focus, Escape closes it, and reduced-motion preferences disable the reveal animation. Text and product descriptions use RU/EN translation keys. Atlases are included in the production PWA cache.

