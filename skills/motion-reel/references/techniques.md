# Technique catalog

Each technique is a prop-driven component. Timing props are frames relative to the scene.
Import from the file named. "Lesson" says where it was learned.

## Transitions — `src/library/techniques/Transitions.tsx`

| Component | What it does | Key props | Lesson |
|---|---|---|---|
| `Whip` | Content arrives/leaves with a fast smear along one axis (directional blur) | `direction`, `inAt`, `outAt`, `frames`, `distance`, `blur` | 02 |
| `DirectionalBlur` | One-axis blur wrapper (SVG filter) used by `Whip` | `amount`, `direction` | 02 |
| `BlockWipe` | Red and green blocks sweep across; cut underneath at the midpoint | `at`, `frames`, `colors` | 02 |
| `ZoomReveal` | Start deep inside a detail, pull back to the whole shot | `at`, `frames`, `from`, `focus` | 02 |

## Typography — `src/library/techniques/Typography.tsx`

| Component | What it does | Key props | Lesson |
|---|---|---|---|
| `WordBuild` | Words appear one by one (fade, rise, blur clears) | `text`, `at`, `gap` or `times`, `wordStyle` | 02 |
| `KineticSlam` | Block crashes in from 2.2x with blur; a marker bar strikes the first line | `at`, `top`, `bottom`, `barColor` | 02 |
| `GlowWord` | Calligraphy word with neon bloom and a flicker in | `at`, `color`, `size` | 02 |
| `NeonWrite` | Outline handwriting draws on, glows, then fills softly | `at`, `text`, `frames`, `fontFamily`, `fontSize` | 02 |
| `ReflectedWord` | Giant word on a glossy floor with a fading mirror copy | `at` | 02 |
| `Tilt3D` | Children tilt in 3D perspective between two poses | `at`, `frames`, `from`, `to` ([rotX, rotY]) | 02 |

## Objects — `src/library/techniques/Objects.tsx`

| Component | What it does | Key props | Lesson |
|---|---|---|---|
| `OrbitRings` | Hero object on a disc; rings draw on; dots orbit | `at`, `size`, `disc`, `ink`; `style.left/top` = centre | 02 |
| `TileGrid` | Rounded 3D tiles pop in staggered with cut-outs and labels | `at`, `items[{src,label}]`, `cols`, `tile`, `stagger` | 02 |
| `PopOutCard` | 3D card slides in; an object breaks out past its edge | `at`, `object{src,left,top,width}`, children = card text | 02 |
| `PortalWindow` | Dark box cut into the wall with perspective walls, scene inside | `at`, `width`, `height`, `depth`, children | 02 |
| `DropIn` | Object falls onto the floor with a bounce; shadow tightens | `at`, `src`, `width`, `left`, `floorY` | 02 |
| `GroundedPunch` | Background pushes gently, character punches harder, both anchored at the feet; shadow is the cut-out painted black, flipped down from the feet and skewed ~-53° | `rig{background, character, height, feet, bgZoom, punchScale, shadowSkew, shift}` | 01 |

## Editorial — `src/library/techniques/Editorial.tsx`

| Component | What it does | Key props | Lesson |
|---|---|---|---|
| `WordReveal` + `timeSegments()` | Voice-synced captions in four voices (lead, key, script, small) | `segments`, `dark`, `align`; `timeSegments(start, frames, parts)` | 03 |
| `SelectionBox` | Dashed bounding box draws on, corner handles pop | `at`, `x`, `y`, `width`, `height` | 03 |
| `HeroCutout` | Big subject with slow push, drift, long shadow and a cloud base | `src`, `height`, `left`, `bottom`, `cloud`, `gray` | 03 |
| `TimelineStream` | Coloured edit-clip lanes flow out of a point | `at`, `x`, `y`, `lanes`, `width` | 03 |
| `PhoneMockup` | Phone frame with an image inside, tilted on grid paper | `at`, `src` or children, `width`, `tilt` | 03 |
| `CtaCard` | Gradient keyword glowing on black, purple floor glow | `at`, `lead`, `keyword` | 03 |

## Elements — `src/library/elements/`

| Component | What it does | Lesson |
|---|---|---|
| `Caption` | Serif-italic documentary caption with pop-in and fade | 01 |
| `HandDiamond`, `Underline`, `PencilOval` | Hand-drawn strokes that draw on and wobble at 8fps | 01 |
| `CaptionBox`, `SlotCounter`, `Smoke`, `PendantLamp`, `FoamFinger` | Props from the documentary look | 01 |
| `Newspaper` | Front page built in code (masthead, headline, columns) | 01 |
| `Barcode`, `RegistrationMark`, `Sparkle`, `SmallPrint`, `EditorialFurniture` | Poster furniture (in `looks/EditorialPoster.tsx`) | 03 |

## Motion helpers — `src/library/engine/motion.ts`

`posterizeFrame` / `stepIndex` (12fps step), `boil` (breathe and sway for still photos),
`wobble` (stepped hand-held jitter), `pingpong`, `decayingWag`, `isOn` (hold-keyframe ranges).
Remotion's own `interpolate(..., { posterize: 2.5 })` also steps time.

## Patterns still living inside the Netflix scenes (extract when reused)

Portal zoom through a framed photo (Scene 1), negative-flicker + red-eye glow (Scene 2), paper drop
on a desk (Scene 3), lamp-lit room with a hold-keyframe highlight (Scene 5).
