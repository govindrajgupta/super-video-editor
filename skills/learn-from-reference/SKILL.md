---
name: learn-from-reference
description: Study a reference video (YouTube, Instagram reel, TikTok, or a local file) and turn what it does into reusable library pieces for the motion-reel studio. Use when the user shares a video link or file and says to learn from it, check it, study it, copy its style, or "train" on it.
---

# Learn from a reference video

The goal is not to copy one video. It is to extract its **style DNA** and **techniques** as
generic, prop-driven pieces the studio can reuse for any topic, and to write down what you learned.

## 1. Watch it properly

Use the built-in browser. Work in the page; don't download the video unless the user agrees.

- **YouTube:** open the watch page, wait out any ad, then read captions from the player's own
  `timedtext` network request (fetch the body with `read_network_requests`; or hook `fetch`/XHR and
  reload the captions module). Creators often show their prompts or guide on screen: read them.
- **Instagram:** the normal page is behind a login wall; open `https://www.instagram.com/reel/<id>/embed/`,
  which exposes a `<video>` with a direct source.
- **Frame grids:** in the page, seek the `<video>` and draw frames into a fixed full-screen
  `<canvas>`, then screenshot it:

```js
window.__seek = async (t) => { const v = document.querySelector('video'); v.pause(); v.currentTime = t;
  await new Promise(r => { v.addEventListener('seeked', r, {once: true}); setTimeout(r, 3000); }); };
window.__grid = async (times, cols, tw) => { const v = document.querySelector('video');
  let c = document.getElementById('__g'); if (!c) { c = document.createElement('canvas'); c.id = '__g'; document.body.appendChild(c); }
  const th = Math.round(tw * v.videoHeight / v.videoWidth), rows = Math.ceil(times.length / cols);
  c.width = cols * tw; c.height = rows * th;
  c.style.cssText = `position:fixed;left:0;top:0;width:100vw;height:${c.height / c.width * 100}vw;z-index:2147483647;background:#000`;
  const ctx = c.getContext('2d');
  for (let i = 0; i < times.length; i++) { await window.__seek(times[i]);
    ctx.drawImage(v, (i % cols) * tw, Math.floor(i / cols) * th, tw, th);
    ctx.fillStyle = '#ff0'; ctx.fillRect((i % cols) * tw, Math.floor(i / cols) * th, 54, 22);
    ctx.fillStyle = '#000'; ctx.font = 'bold 16px sans-serif'; ctx.fillText(times[i].toFixed(1), (i % cols) * tw + 4, Math.floor(i / cols) * th + 17); } };
```

Pass order: an overview every 0.5s (8 columns), then every 0.25s (6 columns), then 0.1s around
each cut, then 3-column close-ups of the frames that show type, texture and depth best.
For a screen recording with small text, draw a cropped region (`drawImage(v, sx, sy, sw, sh, ...)`)
so it fills the canvas.

## 2. Break it down

Write down, with timestamps:

- **Style DNA:** surface/background, palette (hex), type voices (and closest Google Fonts),
  objects and how they're lit, depth cues (shadows, extrusion, reflections), texture overlays.
- **Structure and pacing:** the script or on-screen words, scene lengths, how scenes change
  (cut, whip, wipe, zoom), music vs voice.
- **Techniques:** every distinct move, what triggers it, its timing in frames at 30fps, its easing.
- **Rules:** what the creator never does (as useful as what they do).

## 3. Record the lesson

Create `skills/motion-reel/references/lessons/NN-<name>.md` (next number), following lesson 01's
depth: reference link and creator, date studied, the creator's rules (every one stated or shown),
the exact specs (values, frame timings, blend modes, layer order, easing), a techniques table (move,
timing seen, library component), the sound spec, and a "How our build differs" section. Write down
everything the creator states or shows, not a summary: the lesson is what future videos are held to.
Credit the creator.

## 4. Build it into the library

- New look → `src/library/looks/<Name>.tsx` (wrapper + palette), fonts in `engine/fonts.ts`.
- New moves → generic components in `src/library/techniques/` (timing as props, no topic baked in).
  Reuse existing pieces where a move is a variation.
- Assets the demo needs → `tools/library.py add` (free-licence, recorded).
- A short demo project in `src/projects/<look>-demo/` that uses the new pieces with an original
  script (never copy the reference's words or footage), registered in `src/Root.tsx`.

## 5. Update the docs and verify

- Add the look to `skills/motion-reel/references/looks.md` and each component to `techniques.md`.
- Anything learned about craft goes into `craft.md`.
- Type-check, lint, render stills of the demo and look at them, open it in Studio, then tell the user
  what was learned and show the demo frames. Commit and push only when the user asks.
