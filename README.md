# Super Video Editor

Documentary-style vertical reels built with Remotion. The first one recreates a Netflix vs
Blockbuster collage reel (six scenes, one voiceover, no After Effects), using only free assets and
local tools.

- How it's made: [docs/workflow.md](docs/workflow.md)
- Storyboard and script: [docs/storyboard.md](docs/storyboard.md)
- Asset credits: [CREDITS.md](CREDITS.md)
- Optional ChatGPT prompts for AI-generated assets: [docs/chatgpt-prompts.md](docs/chatgpt-prompts.md)

## Commands

```console
npm run dev
```
Opens Remotion Studio. `NetflixReel` is the full reel; each scene is also its own composition
under **Scenes**, with its main numbers exposed as editable props.

```console
npm run render
```
Renders the final video to `out/netflix-reel.mp4` (about 8 minutes), then masters the audio with a
limiter (about -16.5 LUFS, true peak under -1 dB). Needs `ffmpeg` on the PATH.

### Asset and audio tools (Python 3.12 venv in `.venv`)

```console
.venv/Scripts/python tools/prepare_assets.py
```
Turns photos in `assets-src/raw/` into cut-outs, backgrounds and textures in `public/assets/`.

```console
.venv/Scripts/python tools/voiceover.py am_michael 1.0
```
Regenerates the voiceover with Kokoro TTS (models in `tools/models/`).

```console
.venv/Scripts/python tools/sound.py
```
Regenerates the sound effects and the music bed.

```console
node tools/stills.mjs Scene1Opener=0,46,56 --scale=0.35
```
Renders a few frames for a quick visual check (`out/stills/`).

## Setup on a new machine

```console
npm i
uv venv .venv --python 3.12
uv pip install --python .venv/Scripts/python.exe "rembg[cpu]" kokoro-onnx soundfile
```
Then download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the kokoro-onnx GitHub releases into
`tools/models/`.

Remotion is free for individuals and teams of up to 3; larger companies need a
[company license](https://www.remotion.pro/license).
