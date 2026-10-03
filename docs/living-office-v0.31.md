# Living office — v0.31.0

The gameplay office now uses an empty background plate and five independent full-body SVG characters. The bodies extend the existing avatar palette. Names are attached to their character target rather than moving independently. Characters use floor waypoints; work keeps most colleagues at their stations, while meeting/review/incident contexts gather the cast. Lunch and evening have their own destinations. A short ambient walk happens every few beats.

Movement is presentation state, not saved world progress. Reload returns people to their contextual destinations without consuming time or rewards. Existing conversations and office encounters remain the game logic. During introductions characters remain non-interactive. The timer pauses in hidden tabs and while a conversation is open; an already-started walk can finish. Reduced-motion preference disables timed wandering and makes contextual relocation immediate.

The world plane matches the background cover crop through ResizeObserver. Labels and bodies share one transform. Paths are authored, not a general collision or furniture-occlusion engine. Hero/landing retains its original illustration.

## Asset provenance

Built-in imagegen edited the existing office-premium.webp, then its output was encoded as WebP without changing composition. Final project asset: public/art/office-empty.webp.

Final prompt: Edit target: existing isometric cozy premium office. Remove both human people completely including their hands, legs, shoes. Restore empty chairs behind both monitors. Preserve EXACT furniture positions, framing, dimensions/aspect ratio, floor, desks, monitors, plants, warm afternoon light, decor and camera. No people, no text, no added objects. This is an empty background plate for animated game characters. Save output.

## Verification

274 tests passed; production build passed. New movement tests cover contextual destinations, a single wandering colleague, stationary routes and aisle waypoints. Browser QA on desktop and 390×844 checked full-body characters, movement and conversation opening. The temporary fixture did not replace the player's save on the main origin. This is a presentation upgrade, not new office quest content or autonomous AI colleagues.
