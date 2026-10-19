# Assets and sound

## The asset library

Everything shared lives in `public/library/<kind>/` and is listed in `public/library/catalog.json`
(file, kind, size, cut-out, tags, description, source, page, licence, author, date added).
Kinds: people, objects, places, surfaces, textures, logos, ui, sfx, music.

```console
.venv/Scripts/python tools/library.py search chess queen
.venv/Scripts/python tools/library.py list objects
.venv/Scripts/python tools/library.py credits
.venv/Scripts/python tools/library.py add <https-url-or-file> objects/<name> --cutout --tags a,b --desc "..." --source Unsplash --page <url> --license "Unsplash License"
```

`add` downloads, removes the background (`--cutout`), trims to the subject, saves PNG (with
transparency) or JPG, and records the entry. Run cut-outs one at a time and in the foreground: the
background-removal model needs about 1 GB, and it fails ("bad allocation", "Failed to allocate")
when two run together or when it runs as a background job (about 25s each in the foreground).

Project-only files (voiceover, music, screenshots) go in `public/projects/<slug>/`.

## Where to find images

Free-licence sources that work from this machine:

- **Unsplash** (Unsplash License, no attribution required). Search in the browser at
  `https://unsplash.com/s/photos/<query>?license=free`; the page passes a short bot check by
  itself. Image files: `https://images.unsplash.com/photo-<id>?w=2000&q=88&fm=jpg`. Never use
  Unsplash+ (`plus.unsplash.com`) images.
- **Wikimedia Commons** (check each licence; CC BY / CC BY-SA need a credit line). Its API works from
  the shell; use standard thumbnail widths (960, 1280, 1920) and go slowly (it rate-limits).
- **Pexels** (Pexels License): `images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?w=2000`.
- Google Images shows a CAPTCHA to the automated browser; don't try to get past it.

Pick photos on plain or simple backgrounds for anything that becomes a cut-out. For full-body people
the feet must be in frame (cast shadows need them). Real people: use generic stand-ins, never a
real person's likeness presented as someone else.

## Voiceover (Kokoro, local and free)

`src/projects/<slug>/data/script.json`:

```json
{ "voice": "af_heart", "speed": 1.0, "lines": ["First line.", "Second line."] }
```

`tools/voiceover.py <slug>` writes `public/projects/<slug>/vo-N.wav` and `data/voiceover.json`.
Good voices: `af_heart` (warm female, best quality), `am_michael` (calm male narrator),
`bm_george` (British male). Write numbers as words ("two thousand") so they're read right.

## Timing

- Voice-led: `tools/timeline.py <slug> <mood,mood,...>` makes `data/timeline.json` with one scene
  per line (`from`, `durationInFrames`, `voAt`, `voFrames`, `mood`). Scenes import it.
- Captions: `timeSegments(voAt - from, voFrames, parts)` spreads words by length across the line.

## Music and effects

- `tools/sound.py music <slug>` builds a bed from the timeline moods: underdog, tension, lift,
  sombre, triumph, resolve, pulse (modern promo groove), dark.
- `tools/sound.py sfx` rebuilds the shared effects in `public/library/sfx/` (whooshes, pop, slap,
  boom, ta-dum, scribble, glitch, cha-ching, shutter, focus-hunt, neon-buzz, slot-spin/stop).
- Overlapping sounds must not sit in one `<Track>`; give each `<Audio>` its own row.
