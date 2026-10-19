# Lesson 02: Paper studio promo

- **Reference:** Instagram reel by wecreate (made by @zennn.aep, After Effects),
  https://www.instagram.com/reel/DLCcWGBpQlV/ "Don't just show your brand. Make it felt." (22.6s, 720x1280)
- **Studied:** 2026-10-19, frame by frame (0.25s and 0.1s sampling)
- **Built as:** look `paper-studio`, techniques listed below, demo project `paper-studio-demo`

## Style DNA

- **Surface:** light grey (#e6e6e4) paper with a fine halftone dot grid and a soft centre light
  (lighter middle, darker edges). Feels printed, tactile, studio-lit.
- **Palette:** deep green #1f6b52 (tiles, floors, dark scenes), signal red #c8102e (impact words,
  wipe blocks), near-black #161616 (support text), lime #b9f227 glow (one magic word).
- **Type system, three voices:** condensed bold caps in red for impact ("EVER WONDER?", "SOME
  BRANDS", "WORD"); clean grotesk in black or green for the line ("Stick in your mind?", "Visual
  Metaphors"); handwritten monoline script for the emotional word ("attention", "Text"). Glowing
  calligraphy once, for "Magic".
- **Objects:** photo-real cut-outs (brain, sneakers, phone, cup, eyeball, retro TV, statue, diamond,
  column, chess queen) with soft contact shadows.
- **Depth:** green rounded tiles with thick, long, soft drop shadows (bottom-right); an inset
  "portal" box cut into the wall with perspective walls; floor reflections.

## Structure and pacing

- Problem → reframe → proof → payoff: "Ever wonder? Some brands stick in your mind? It's not magic.
  Motion Design. Emotion to your message. Kinetic text. Grabs attention in two seconds. Visual
  metaphors explain complex ideas without a single word. It's not decoration, it's strategy that moves."
- A new idea every 1–2 seconds. Music-driven; words build on the beat.
- Every change is a motion-blur whip (vertical or horizontal), a colour-block wipe, or a zoom reveal.
  No plain cuts.

## Techniques learned

| Move | Timing seen | In the library |
|---|---|---|
| Orbit rings: object in a green disc, concentric rings draw on, dots orbit | 0.25–1.4s | `OrbitRings` |
| Tile grid: 2×2 rounded tiles pop in staggered, each with a product cut-out and label | 1.5–1.9s | `TileGrid` |
| Whip transition: content smears along an axis with directional blur, next scene snaps in | 2.0, 10.5, 15.25s | `WhipTransition` |
| 3D tilt: text and object on one plane tilt in perspective | 2.5–3.3s | `Tilt3D` |
| Glow script word: lime calligraphy with bloom | 3.75–5.0s | `GlowWord` |
| Neon write-on: outline handwriting draws on, glowing | 5.5–6.25s | `NeonWrite` |
| Zoom-out reveal: start inside an object's detail, pull back to the whole | 6.5–7.0s | `ZoomReveal` |
| Colour-block wipe: red and green rectangles slide across and leave | 8.25–9.0s | `BlockWipe` |
| Kinetic slam: word scales down from 2× with blur, a marker bar strikes through | 9.25–10.0s | `KineticSlam` |
| Pop-out card: 3D tile slides in, an object breaks out past its edge | 10.75–12.0s | `PopOutCard` |
| Word build: words appear one at a time on the beat | 11.5–12.0, 14–15s | `WordBuild` |
| Portal window: dark inset box with perspective walls showing a lit scene | 12.25–15.0s | `PortalWindow` |
| Floor reflection: giant word with a mirrored, fading reflection | 15.5–16.25s | `ReflectedWord` |
| Drop-in with shadow: object falls onto a floor, its shadow grows as it lands | 19.0–19.5s | `DropIn` |

## Rules worth keeping

- Three type voices, never more. Impact word in red caps; never two impact words at once.
- One object per idea; it must be photo-real and cast a shadow.
- Every transition carries motion blur in the direction of travel.
- Leave a beat of near-empty frame ("it's not") before the payoff.
