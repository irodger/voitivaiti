# v0.38.0 — background audio

Quiet synthesized room noise in office/reward phases, slow sine-pad ambience at home, on walks and on the opening screen. Scene transitions crossfade over approximately a second. No external media or audio download is required; Web Audio nodes are generated locally.

Playback starts only after a user interaction. A persistent sound switch in Settings mutes both backgrounds. Hidden pages fade and suspend; disposal releases sources and the AudioContext. Safari's prefixed AudioContext is supported. Game resets do not reset sound preferences.

Tests cover initial gesture/mute, crossfade, hidden-page suspension and disposal. Production build passed. This is gentle room ambience, without recorded voices or a detailed office soundscape.
