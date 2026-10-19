# Super Video Editor

A Claude Code plugin plus a Remotion studio for professional motion-graphics reels. The studio is a
growing library of **looks**, **techniques** and **assets**. Claude builds each new video from it,
and learns new styles from reference videos you share.

## Install the plugin

At the prompt of a Claude Code terminal session:

```console
/plugin install super-video-editor --marketplace govindrajgupta/super-video-editor
```

From a shell:

```console
claude plugin install super-video-editor --marketplace govindrajgupta/super-video-editor
```

In the Claude desktop app: click **+** next to the prompt box, then **Plugins**, **Add marketplace**
with `govindrajgupta/super-video-editor`, then **Add plugin**.

The plugin adds two skills:

- **motion-reel**: make a reel. Brief, script, storyboard, look, techniques, assets, voice, music,
  build, check and render.
- **learn-from-reference**: study a YouTube or Instagram video and turn its style and moves into
  reusable library pieces, plus a written lesson.

## What's in the library

| Looks | Learned from |
|---|---|
| `vintage-film`: aged-film documentary collage | [MoSidd, Netflix vs Blockbuster reel](https://youtu.be/xOhh274Ayac) |
| `paper-studio`: tactile grey paper, green tiles, red impact type | [wecreate / @zennn.aep](https://www.instagram.com/reel/DLCcWGBpQlV/) |
| `editorial-poster`: cream poster, layout furniture, voice-synced captions | [marvix.motion](https://www.instagram.com/reel/DXtv0xbEcFD/) |

- Around 30 techniques (whips, wipes, kinetic slams, orbit rings, tile grids, pop-out cards,
  portals, reflections, drop-ins, grounded parallax punch, word-synced captions, selection boxes,
  timeline streams, phone mock-ups, CTA cards…): see
  [skills/motion-reel/references/techniques.md](skills/motion-reel/references/techniques.md).
- Assets with tags, sources and licences: [public/library/catalog.json](public/library/catalog.json).
- Lessons from each reference: [skills/motion-reel/references/lessons/](skills/motion-reel/references/lessons/).

## Projects

| Composition | What it is |
|---|---|
| `NetflixReel` | Netflix vs Blockbuster documentary (vintage-film) |
| `PaperStudioDemo` | Music-led motion-design promo (paper-studio) |
| `EditorialPosterDemo` | Voice-led editorial piece with a call to action (editorial-poster) |

## Commands

```console
npm run dev
```
Opens Remotion Studio with every project and its scenes.

```console
npm run render -- PaperStudioDemo
```
Renders any composition to `out/<name>.mp4` and masters the audio (about -16 LUFS, true peak
under -1 dB). Needs `ffmpeg` on the PATH.

### Python tools (3.12 venv in `.venv`)

| Command | Does |
|---|---|
| `tools/library.py add <url-or-file> <kind>/<name> [--cutout] ...` | Add an asset (download, cut out, trim, catalog) |
| `tools/library.py search <words>` / `list [kind]` / `credits` | Find assets / list / attribution needed |
| `tools/voiceover.py <slug>` | Voiceover from `src/projects/<slug>/data/script.json` (Kokoro, local) |
| `tools/timeline.py <slug> <moods>` | One scene per voiceover line → `timeline.json` |
| `tools/sound.py music <slug>` / `sfx` | Music bed from scene moods / shared sound effects |
| `tools/prepare_assets.py` | Rebuilds the first project's library assets |
| `node tools/stills.mjs <Comp>=f1,f2 --scale=0.3` + `tools/sheet.py <Comp>` | Contact sheet of frames |

## Setup on a new machine

```console
npm i
uv venv .venv --python 3.12
uv pip install --python .venv/Scripts/python.exe "rembg[cpu]" kokoro-onnx soundfile
```
Then download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the
[kokoro-onnx releases](https://github.com/thewh1teagle/kokoro-onnx/releases) into `tools/models/`.

## Credits and licences

See [CREDITS.md](CREDITS.md). Remotion is free for individuals and teams of up to 3; larger
companies need a [company licence](https://www.remotion.pro/license).
