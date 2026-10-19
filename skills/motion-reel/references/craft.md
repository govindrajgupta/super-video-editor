# Craft: the quality bar

What separates a professional reel from a slideshow. Check every scene against this before rendering.

## Story and pacing

- Hook in the first second: an image or a question, never a logo.
- One idea per scene, one signature move per scene. If two things fight, cut one.
- Vertical reels: 3–6s per voiced scene, 1.5–3s per music-led beat. Total 15–35s.
- Leave one near-empty beat before the payoff ("it's not…"). Contrast makes the payoff land.
- End on a clear button: a verdict line, a logo ident, or a call to action.

## Motion

- Nothing linear: ease out on arrivals (`Easing.out(Easing.cubic|exp)`), ease in on exits,
  springs for pops (damping 10–15). Overshoot only on small, light objects.
- Stagger groups (3–6 frames apart); never move a group as one block.
- Every transition carries motion blur in its direction of travel (`Whip`, blur filters).
- A still never sits still: slow push (1.00→1.06 over the scene), drift, boil, cloud movement.
- Time beats to the voice: an on-screen word appears when it is spoken, within ±3 frames.
- Hold a finished frame long enough to read it: about 0.4s per 3 words after the last word lands.

## Typography

- Each look has its voices (see `looks.md`); use no more than three in a frame.
- Impact words: one per frame. Size contrast of at least 2:1 between impact and support text.
- Keep text inside the safe zone: 90px from the sides, 220px from the top, 380px from the bottom
  (platform UI covers the bottom).
- Words come from the voiceover. Don't paraphrase on screen what the voice says.

## Colour and light

- Palette per look, plus at most one accent. Grade the whole scene, not single elements.
- Every cut-out needs a contact shadow or drop shadow matching the light direction.
- Cut-outs from different photos: match them with a shared grade, grain and shadow colour.

## Sound

- Voice on top at all times; music ducks under the voice and lifts in gaps.
- A sound for every major move (whoosh for whips, pop for pops, slap for landings), trimmed to land
  on the frame of impact, never early.
- Final master: about -16 LUFS integrated, true peak under -1 dBTP (`npm run render` does this).

## Technical checks

- `npx tsc --noEmit` and `npx eslint src` clean.
- Contact sheet of every scene (stills + `tools/sheet.py`); look at each frame for overlaps,
  cut-off text, unwanted edges of cut-outs (push cropped edges off-frame), and mirrored artefacts.
- Studio opens the composition without a red error screen (a `Track` can't hold overlapping items;
  put overlapping sounds outside a Track).
- Cut-outs: check there is no halo or leftover background; re-run with `--cutout` on a cleaner photo if so.
- Licences recorded in `public/library/catalog.json`; attribution ones listed in `CREDITS.md`.
