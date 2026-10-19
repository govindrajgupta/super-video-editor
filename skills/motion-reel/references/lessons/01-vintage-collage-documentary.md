# Lesson 01: Vintage collage documentary

- **Reference:** "I Made This Viral Reel Using ONLY Remotion & Claude Code" by MoSidd, YouTube
  https://youtu.be/xOhh274Ayac (Netflix vs Blockbuster reel, about 30s)
- **Studied:** 2026-10-18 (transcript plus the creator's on-screen guide page, read frame by frame)
- **Built as:** look `vintage-film` (`FilmLook`), technique `GroundedPunch`, project `netflix-vs-blockbuster`

## The creator's rules (follow these on every video in this look)

1. **The voiceover is the storyboard.** Don't describe visuals to yourself; write the voiceover and
   let its words dictate the scene ("laughed them out" forces an arrogant laughing character,
   "$45 billion" forces the money shot). 5–6 lines, about 5s each, 25–30s total.
2. **Storyboard prompt, per line:** the scene, the on-screen words (pulled straight from the line),
   the emotional beat, **one** signature animation, and the exact assets needed. Build scene by scene.
3. **You don't need an original story.** Retell a story that already works, better.
4. **Assets are the easy part.** 3–4 images per scene (background, character, a prop or two). What
   makes it viral is the animation and choreography layered on top.
5. **Reference exact frames**, read off Remotion Studio's timeline, when describing any timing or fix
   ("motion blur from frame 56 to 67"), never "right after the zoom".
6. **A still must come alive:** cloud drift, a character boil, a slight shift of the whole scene.
7. **Stagger and vary direction**, or a group reads as a glitch: one item per spoken beat (~1.3s
   apart), each from a different edge, each on a soft spring.
8. **Build scene by scene, each its own composition**, then merge into a master: fixing one scene
   never breaks another.
9. **Tune in Studio:** every scene is prop-controlled (punch scale, shadow angle, hand position,
   grade) and the values are dragged live until they land.
10. **Fine-tune placement** by eye at the exact frame (logo resting on a hand, eyes aligned).
11. **Mix so the words always win:** voice on top at full level; music ducks under it and swells in
    the gaps; each sound effect punches through for a beat then ducks back. Effects are trimmed to
    their attack so the hit lands on the frame, never a frame early.

## The engine (set up once, every scene inherits it)

- Project: vertical 1080x1920, 30fps, one composition and one file per scene, a shared engine file.
- Motion helpers: a **posterize-time** helper that snaps time to **12fps** steps (stop-motion), a
  **boil** wobble, a slow **drift**, a **ping-pong** oscillator, a spring **entrance**.
- **Film look**, layered top to bottom, each layer with a toggle, all on the 12fps step:
  - **Scan lines:** vertical lines, a 1.6px black line at 16% opacity repeating every 8px, blurred 0.7px.
  - **Texture sandwich:** film grain on **multiply**, **inverted** with brightness 1.35 and contrast
    1.02, at **55%** opacity; then grunge on **colour-burn** at **16%**.
  - **Vignette:** radial ellipse 92% x 82% centred at 50% / 48%, clear until 55%, fading to black at
    50% opacity by the edge.
  - **Grade:** saturate 0.86, contrast 1.08, sepia 0.16, brightness 0.95 (exposed as props per scene).
  - **Gate weave:** jitter the whole frame with a stepped wiggle at 12fps, about 5px of travel, and
    scale everything up 1.012 so the weave never reveals an edge.
  - The asset sheet's treatment stack also includes **venetian blinds** and a **corner blur**.

## Scene specs (his frame numbers at 30fps)

1. **Opener, portal zoom.** B&W framed photo (founder in front of HQ, in a gold frame) on a paper
   museum wall with a small serif plaque "In 2000". Slow push: wall 1.0→1.16 over 0–46. Zoom-through:
   from 46, accelerate to ~6.8x by 76. **Weld:** until 62 the photo and frame move as one (content
   scale = 0.369 x wall scale). **Detach:** after 62 the frame keeps accelerating past the edges while
   the photo settles 0.75→1.0 by 72 and cross-fades B&W→colour. Motion-blur burst 0→~9px→0 across
   54/61/72. Wall and plaque blur 0→8px over 52–72 and fade. Clouds drift left behind the building
   (cloud 1 to about -525px over the scene, cloud 2 at 0.6x speed). Character boil: scale ±0.5% on a
   slow sine, sway ±0.5° over ~140 frames, on the 12fps step. Then serif-italic captions.
2. **The offer.** Red sunburst backdrop (#a01218 → #7c0d12 → #58080c) with faint rays. Logo hand slides
   in from one edge (~17), cash hand from the opposite edge (~47), each inside a hand-drawn wireframe
   diamond drawn on with a dashed stroke, wobbling on an 8fps boil. Slot-machine counter spins values
   (billion / dollars / trillion) over 72–82 and slams onto MILLION. Boss rises on a spring (~84),
   punches to 1.09x over 96–116, sways gently. Cigar smoke: a smoke-on-black clip on **screen** blend,
   contrast crushed, top edge feathered, anchored to the cigar ember and moving with the boss.
   Marigold caption box pops "laughed" then "them out" (130–163). At 165, hold-keyframe negative
   flicker (invert + hue shift, 2–3 frame bursts); at 174 the boss goes B&W with red light-rays from
   his eyes.
3. **The opposite.** Dark wood desk, focus hunt (blur clearing over ~14 frames), slow Ken Burns push.
   Three front pages, one at a time, soft spring (stiffness ~42, mass ~1.1, glide ~0.9s, small bounce,
   scale 1.1→1.0, stop-motion boil): NO LATE FEES from the LEFT at 20 (rotated ~-26°, lands ~x470/y980
   at -7°), NO STORES from the RIGHT at 60 (lands ~x620/y940 at +6°), CUSTOMER FIRST from the BOTTOM at
   100 (lands ~x540/y1010 at -3°). Serif-italic "built the opposite." fades in early, out by 48.
4. **The fall.** Two flat plates, depth by animation: anchor everything at the man's feet
   (~x560/y1690). Building 1.0→1.12 over 8–80, easing out. Man punches 1.0→~1.7x over 0–58, drifting
   toward camera, scaled around his feet. **The shadow is the man:** duplicate the cut-out, paint it
   black, **flip it straight down from his feet and skew ~-53°** so it lies along the ground, blur 7px,
   55% opacity. Left stack "closed a / 1000 / stores" from 24, a line every ~6 frames, fading to ~30%
   as he moves. Around 60 he slides ~235px left with a motion-blur streak. "declared bankruptcy" on the
   right over 70–78 with a hand-drawn yellow underline and a tightening focus vignette. Grade: saturate
   0.62, contrast 1.12, sepia 0.06, brightness 0.94.
5. **The payoff.** Five flat plates (study background, founder in a chair, desk with stacked cash, the
   cash alone, a hanging lamp). **Lamp light drawn, not photographed:** at the bulb, four radial
   gradients on screen blend (white-hot core, wider warm bloom, flat glow at the shade mouth, big faint
   ambient spill) plus a blurred funnel beam down behind the character, edges faded by a side mask;
   all parented to the lamp, which swings ±3° over ~2s. **The light responds to focus:** when the lens
   defocuses, the hot core blooms ~2.4x into a soft bokeh disc and the halo grows. Cash highlight: the
   cash cut-out duplicated, recoloured chartreuse (sepia 1, saturate 5, hue-rotate 18°), flickered with
   hold keyframes (on 23–28, off 29–31, on 32–61, off 62–63, on 64–71). Headline "Forty five / billion /
   dollars in revenue" staggered 9–54, a hand-drawn yellow pencil oval around "billion" over 31–40.
   Camera: vintage focus hunt, open at 0.88x defocused, whoosh in to 1.0 as focus clears by 21, dip out
   of focus ~43–63, creep to 1.08x. Grade: saturate 0.82, contrast 1.06, sepia 0.14, brightness 0.93.
   Then the Netflix "ta-dum" ident over "the biggest streaming service".
6. **The "no".** Scene 4 cloned: same parallax punch from the feet, same shadow, push, film look and
   step. Swap the character (smiling, hands folded; fix the aspect ratio), put him on the emptied
   Blockbuster street, centred. "The most / expensive" stacked left from 8; "in history" fades in
   40–48. A red foam finger from bottom-right at ~24, sliding in and scaling 0.72→1 over ~12 frames,
   then wagging about the wrist: angle = 28° x cos(0.52t) x e^(-0.042t); ~250px, in front of the
   character, under the left caption. Grade as scene 4; punch 1.7x by 58; shadow -53° at 55%.

## Sound spec

- Voiceover: ElevenLabs, a calm documentary narrator, one pass for all six lines (stability 50,
  similarity 75, style 11). The VO file is the timeline: every scene is cut to its gaps.
- Effects: long whoosh for the zoom-through, quick whooshes for pans, vintage camera shutter for the
  museum opener, cha-ching for the money hit, flickering neon buzz under the lamp, focus-hunt motor.
- Music: a library track that climbs from quiet underdog to triumphant, low under the voice.

## Asset sources he used

Google Images for real photos (HQ, storefront, tower, desk, paper wall); GPT Image through Replicate
for invented characters and newspaper fronts, background-removed into cut-outs; edit-pack collections
for grain, grunge, frame, lamp, hands, foam finger and the ident.

## How our build differs, and why

- **Timings are compressed to our voiceover** (Kokoro reads faster), so captions land on the spoken
  word: e.g. scene 1 pushes over 0–30, zooms 30–60, welds to 46, settles by 56.
- Characters are stock models, not lookalikes of the real executives.
- Smoke is procedural (no smoke clip); the logo swings in without a hand; the payoff uses the founder
  cut-out behind a desk instead of a seated photo.
