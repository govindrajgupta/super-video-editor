# How the reel is made

This follows the workflow from MoSidd's video "I Made This Viral Reel Using ONLY Remotion & Claude
Code" (https://youtu.be/xOhh274Ayac), rebuilt here with free assets.

## The creator's method, in short

1. **Voiceover first.** Write 5–6 short lines (about 5 seconds each). The voiceover is the
   storyboard: each line becomes one scene, and its words dictate what's on screen.
2. **Storyboard prompt.** Give Claude Code the lines and ask, per line, for the scene, the on-screen
   words, the emotional beat, one signature animation, and the exact assets needed.
3. **Asset sheet.** Each scene runs on 3–4 images: a background, a character cut-out, a prop or
   two. He sourced real photos from Google Images, invented characters with GPT Image (through the
   Replicate API) and removed their backgrounds, and pulled textures and props from editors' packs.
4. **Engine once.** One prompt sets up the Remotion project (1080×1920, 30fps, one file per scene)
   plus shared motion helpers: posterize-to-12fps time, boil, drift, ping-pong and spring entrances.
5. **Film look once.** A reusable wrapper: scan lines, a grain and grunge texture sandwich,
   vignette, colour grade, and gate weave, all on the 12fps step, each layer switchable.
6. **One prompt per scene,** with exact frame numbers for every beat. Referencing frames (read off
   Remotion Studio's timeline) is far more precise than "after the zoom".
7. **Tune in Studio.** Expose the important numbers as props and drag them live until it lands.
8. **Build scene by scene,** then assemble a master reel. Fixing one scene never breaks another.
9. **Sound last.** ElevenLabs voiceover, ElevenLabs sound effects trimmed to land on the beat, a
   library music track ducked under the voice.

## Where each step lives in this project

| Step | Here |
|---|---|
| Voiceover script and storyboard | `docs/storyboard.md`, `tools/voiceover.py` |
| Asset sourcing | Wikimedia Commons and Unsplash (free licences), see `CREDITS.md` |
| Cut-outs, sky removal, gold frame, textures | `tools/prepare_assets.py` (rembg runs locally) |
| Motion helpers | `src/engine/motion.ts` |
| Film look | `src/engine/FilmLook.tsx` |
| Scenes | `src/scenes/Scene1Opener.tsx` … `Scene6No.tsx` |
| Shared parallax-punch rig (scenes 4 and 6) | `src/elements/GroundedPunch.tsx` |
| Master reel with voice, effects and music | `src/NetflixReel.tsx` |
| Sound effects and music | `tools/sound.py` |
| Swapping a new photo into an asset slot | `tools/fit_asset.py` |

## Signature moves by scene

1. **Portal zoom:** the camera flies through a gold-framed photo on a museum wall. Photo and frame
   are welded until frame 46, then the frame keeps flying while the photo settles full-screen and
   blooms from black-and-white to colour. Clouds drift behind the HQ, and the founder "boils".
2. **The offer:** props swing in inside hand-drawn diamonds, a slot machine lands on 50 MILLION, the
   boss springs up smoking, the frame flickers negative, then he goes black-and-white with red eyes.
3. **The opposite:** three front pages spring onto a desk from three directions, each on a soft
   spring, while the lens hunts focus.
4. **The fall:** two flat plates sell depth. The background pushes in gently while the man punches
   in harder, both anchored at his feet, and his shadow is his own cut-out painted black.
5. **The payoff:** a swinging lamp lights the room, the cash flickers chartreuse on hold keyframes,
   a pencil oval scribbles around "billion", then the Netflix "N" ident.
6. **The no:** scene 4's rig with a new character, plus a foam finger that wags with a decaying
   swing: angle = 28° × cos(0.52t) × e^(−0.042t).
