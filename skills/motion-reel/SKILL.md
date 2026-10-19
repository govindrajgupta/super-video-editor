---
name: motion-reel
description: Make a professional motion-graphics video (vertical reel, short, promo, explainer, documentary story) with Remotion, using this plugin's library of looks, techniques and assets. Use when the user asks to make, script, storyboard, design, animate, edit, voice or render a reel or short video, or to restyle or extend one made here.
---

# Motion reel

You build vertical (1080x1920, 30fps) motion-graphics videos in the **studio**: this plugin's own
repository, a Remotion project with a growing library. Every video is a project assembled from
library pieces; anything new you build goes back into the library so the next video starts richer.

## 0. Find the studio

The studio is the folder with `src/library/`, `public/library/catalog.json` and `skills/`.
If the current folder is not it, ask the user where their clone is, or offer to clone
`https://github.com/govindrajgupta/super-video-editor`. Then, once per machine:
`npm i`, and for the Python tools a 3.12 venv in `.venv` with `rembg[cpu] kokoro-onnx soundfile`,
plus the Kokoro model files in `tools/models/` (see README).

Start Remotion Studio (`npm run dev`) early and keep it open so the user can watch scenes appear.

## 1. Brief → script → storyboard

1. Pin down: topic, audience, length (15–35s), voice-led or music-led, and the call to action.
2. Write the script first. **The voiceover is the storyboard**: 4–7 short lines, one scene each,
   ~3–6s per line. A music-led promo still gets a line list (the on-screen words).
3. For each line write: the scene, the on-screen words (pulled from the line), the emotional beat,
   one signature move, and the assets needed. Keep this in `docs/` or the project's `data/`.
4. Facts in a script must be checked before they go on screen.

## 2. Choose a look

Read `references/looks.md` and pick one look per video (or one per chapter, deliberately).
Each look fixes the palette, the type voices and the surface. Don't invent a fourth type voice.

## 3. Choose techniques

Read `references/techniques.md`. Give every scene **one** signature move from the catalog and
keep the rest quiet. If a scene needs a move the library lacks, build it as a generic, prop-driven
component in `src/library/techniques/` first, then use it (and add it to the catalog).

## 4. Assets

Search the library before the web: `.venv/Scripts/python tools/library.py search <words>`.
Missing something? Follow `references/assets-and-sound.md`: free-licence sources only, add with
`tools/library.py add ... --cutout`, and record source and licence. Run cut-outs **one at a time, in
the foreground** (the model needs ~1 GB and fails in background jobs). Never use a real person's likeness as a stand-in for a real executive.

## 5. Voice, timing, music

- Script lines go in `src/projects/<slug>/data/script.json`; `tools/voiceover.py <slug>` makes
  `vo-N.wav` and `voiceover.json` (durations).
- Voice-led: `tools/timeline.py <slug> <mood,...>` builds `timeline.json` (one scene per line).
  Music-led: write `timeline.json` by hand (scene starts, lengths, moods).
- `tools/sound.py music <slug>` builds a music bed that follows the scene moods.
- Captions appear when their word is spoken (`timeSegments` + `WordReveal`, or exact frames).

## 6. Build

- One folder per video: `src/projects/<slug>/` with the master composition and its scenes.
- Scenes are `Interactive.create({ layout: "absolute-fill" })` components in a `Track`; each scene
  wraps its content in the look. Expose the numbers worth tuning as schema props.
- Reference exact frames for every beat. Register the master in `src/Root.tsx`.
- Follow `references/craft.md` (motion, type, colour, sound). It's the quality bar.

## 7. Check, render, deliver

1. `npx tsc --noEmit` and `npx eslint src`.
2. `node tools/stills.mjs <Composition>=f1,f2,... --scale=0.3` then `tools/sheet.py` and look at
   every scene's key frames. Fix anything off before rendering.
3. Open the composition in Studio once; a red error screen there means a Track overlap or a
   runtime error the render may hide.
4. `npm run render -- <Composition>` (renders, then masters the audio to about -16 LUFS).
5. Verify the MP4: duration, 1080x1920, loudness, and exact frames with
   `ffmpeg -vf "select=eq(n\,N)"` (not `-ss`, which seeks to keyframes).
6. Update `CREDITS.md` for any attribution-licence assets, commit, and push when the user asks.

## 8. Learn from what you made

If the user corrects something or you discovered a better way, write it into the relevant
reference file. To study a new reference video, use the `learn-from-reference` skill.
