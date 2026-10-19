# Lesson 01: Vintage collage documentary

- **Reference:** "I Made This Viral Reel Using ONLY Remotion & Claude Code" by MoSidd, YouTube
  https://youtu.be/xOhh274Ayac (Netflix vs Blockbuster reel, about 30s)
- **Studied:** 2026-10-18 (transcript plus the creator's on-screen guide page)
- **Built as:** look `vintage-film` (`FilmLook`), project `netflix-vs-blockbuster`

## Style DNA

- Story-driven documentary reel: 6 voiceover lines, one scene each, about 5s per scene.
- Photo collage: real photos for places, cut-out people, props in front.
- Aged-film finish over everything: grain, grunge, vertical scan lines, vignette, warm faded grade,
  gate weave, and motion stepped to 12fps (stop-motion feel).
- Type: serif italic captions pulled straight from the voiceover; condensed display type for numbers
  and headlines; marigold caption boxes for punch words.

## Structure and pacing

- The voiceover is the storyboard: write it first, then derive each scene's visuals from its words.
- Each scene has one signature move. Captions land on the spoken word.
- Hard cuts between scenes with a whoosh; the music ducks under the voice and swells in the gaps.

## Techniques learned

| Move | What it is | In the library |
|---|---|---|
| Portal zoom | Camera flies through a framed photo on a wall; frame and photo welded, then detach; photo blooms B&W to colour | `projects/netflix-vs-blockbuster/scenes/Scene1Opener.tsx` (to extract) |
| Props in diamonds | Two props swing in from opposite edges inside hand-drawn dashed diamonds | `HandDiamond` |
| Slot counter | Values spin with blur, slam onto the final number | `SlotCounter` |
| Negative flicker + red eyes | Hold-keyframe invert bursts, then B&W with glowing red eyes | Scene 2 (pattern) |
| Paper drop | Front pages spring onto a desk from three directions, soft spring, focus hunt | `Newspaper` + Scene 3 |
| Grounded parallax punch | Background pushes gently, character punches harder, both anchored at the feet; shadow = the cut-out painted black and skewed | `GroundedPunch` |
| Lamp light | Swinging pendant with stacked radial glows and a light funnel | `PendantLamp` |
| Hold-keyframe highlight | Duplicate recoloured cut-out flickered on/off with no fades | Scene 5 (pattern) |
| Decaying wag | angle = A·cos(ωt)·e^(−kt) for a finger saying "no" | `decayingWag`, `FoamFinger` |

## Rules worth keeping

- Reference exact frame numbers when describing timing; read them from Studio.
- Build scene by scene, each as its own composition, then assemble a master.
- A still photo comes alive with tiny motion: cloud drift, a character boil (±0.5% scale, ±0.5°), slow push.
