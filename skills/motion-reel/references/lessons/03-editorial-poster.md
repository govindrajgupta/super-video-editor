# Lesson 03: Editorial poster narrative

- **Reference:** Instagram reel by marvix.motion, https://www.instagram.com/reel/DXtv0xbEcFD/
  (18.8s, 720x1280), a voiceover about what an editor's "aura" is
- **Studied:** 2026-10-19, frame by frame (0.5s overview, 0.1s around every cut)
- **Built as:** look `editorial-poster`, techniques listed below, demo project `editorial-poster-demo`

## Style DNA

- **Surface:** warm cream paper (#f6e8d4) like a printed poster, with layout furniture: thin grid
  lines, crop/registration marks, measurement ticks, small sparkle stars (✦), barcodes, tiny
  publisher text in the corners, and 3–4 line paragraphs of small print.
- **Palette:** cream base, near-black text, one hot orange #ff5a1f for the key phrase. A dark
  chapter flips to black-and-white with a grid and a white back glow.
- **Type system:** small clean sans for the lead-in ("you know what real"); heavy rounded sans in
  orange for the key phrase ("AURA", "THE TIMELINE", "under control"); a handwritten script word
  for the turn ("is", "and suddenly", "everything feels").
- **Subjects:** one big hero cut-out per scene, often a statue or character (crowned king, Spartan,
  TV-headed editor, classical bust, masked figure), sitting on a soft cloud or mist base, with a
  long soft shadow.
- **Design-tool UI as decoration:** a selection bounding box with corner handles around the subject,
  editing-timeline layer bars, phone mock-ups, grid paper.

## Structure and pacing

- Voiceover-led: every caption is the spoken line, revealed word by word in sync (karaoke).
- One scene per sentence, hard cuts exactly on the sentence start; within a scene, a slow push-in and
  a little drift so it never sits still.
- Ends on a call-to-action card: gradient text ("comment "XML"") glowing on black.

## Techniques learned

| Move | Timing seen | In the library |
|---|---|---|
| Word-synced captions: each word fades/slides in on its spoken time; orange line pops | throughout | `WordReveal` |
| Editorial furniture: grid, registration marks, ticks, barcode, sparkles, small print | throughout | `EditorialFurniture`, `Barcode` |
| Selection box: dashed bounding box with corner handles draws on around the subject | 0.5–1.75s | `SelectionBox` |
| Hero cut-out on a cloud base, long soft shadow, slow push | 0.5–1.75, 4.2–5.8s | `HeroCutout` |
| Timeline stream: coloured editing-layer bars slide out from an object | 2.0–4.1s | `TimelineStream` |
| Phone mock-up with media inside, tilted on grid paper | 6.0–7.9s | `PhoneMockup` |
| Dark grid chapter: B&W subject, grid lines, white back glow | 9.5–11.9s | `DarkGridScene` |
| CTA card: gradient glowing text on black with a purple floor glow | 17.0–18.8s | `CtaCard` |
| Hard cut on the sentence start | 4.1→4.2, 9.4→9.5s | (editing rule) |

## Rules worth keeping

- One accent colour. Everything else is cream, black or grey.
- The furniture is quiet: thin lines, small type, low contrast. It frames, never competes.
- Captions are always synced to the voice; a word appears when it is said, not before.
