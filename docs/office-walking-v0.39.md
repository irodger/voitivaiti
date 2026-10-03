# Office walking v0.39.0

Four-frame walking atlas: `public/art/office-walk.webp` (271,820 bytes, alpha WebP). Four appearance columns match the existing static atlas. Animation runs only during travel; seated and standing art remains unchanged. Horizontal facing follows actual position updates, including route turns. Near-vertical motion retains the last horizontal facing. Reduced-motion users receive instant position changes without walking animation.

## Generated art provenance

Tool: built-in imagegen. Reference: `public/art/office-people.webp`.
Original generated files preserved under `C:/Users/raxen/.codex/generated_images/01a0a753-21bf-7282-9f51-8c6feba040b1/`.
Final source: `exec-a931994f-4bd2-44a3-a741-cc9566e65491.png`.
Encoded to WebP with Pillow, quality 82, method 6; no raster retouching.

Initial prompt:

Create a precise game walking sprite atlas matching the four characters in this reference. Output ONLY 4 columns by 4 rows on transparent alpha, no lettering or borders. Canvas portrait aspect 2:3, every tile identical aspect 2:3. COLUMN 1 green sweater black hair glasses man; COLUMN 2 terracotta jacket bob hair woman; COLUMN 3 blue shirt dark skin curly hair man; COLUMN 4 mustard sweater brown hair beard man. Same identities and cozy polished 3D miniature game rendering as reference. All figures walk facing screen RIGHT, front three-quarter view. ROWS are four consecutive walk-cycle animation frames, NOT different characters. Row1 left foot extended forward/right, right leg back, arms opposite. Row2 passing pose feet close, left foot supports weight, right foot lifts. Row3 RIGHT foot extended forward/right and LEFT leg back, arms reversed from row1. Row4 opposite passing pose, right foot supports weight left foot lifts. Strong readable difference between stride frames, correct anatomy. All 16 figures exact same scale, their body center aligned to tile center, soles baseline at 94% tile height, top of hair at 8%. Keep safe padding, feet and hands wholly inside each tile, no overlaps. Full bodies, no chair, no ground, no shadows outside silhouette. Preserve reference clothing, face and body proportions across all frames.

Final edit prompt:

Remove the entire brown colored background from this sprite sheet, making it genuinely transparent alpha. Preserve ALL sixteen figures exactly, their positions, poses, clothes, colors, scale and grid. No redesign. Clean cutout alpha around every character and transparent gaps, including between legs and arms. Keep same 1024x1536 canvas, 4 columns 4 rows. Also ensure row3 strides use the opposite legs from row1 and row4 the opposite passing leg from row2, preserving identity.

## Verification

Seven movement regression tests pass; production build passes; diff whitespace check passes. Alpha verified numerically (859,251 fully transparent pixels in source). This is a four-frame stylized cycle with mirrored left/right views, not an eight-direction animation set.
