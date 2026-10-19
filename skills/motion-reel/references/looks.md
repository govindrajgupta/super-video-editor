# Looks

A look fixes the surface, palette, type voices and motion feel. One look per video, or one per
chapter on purpose (e.g. a dark chapter inside a light video). Code in `src/library/looks/`.

## vintage-film (`FilmLook`)

- **Use for:** history, business stories, "the rise and fall of…", documentaries, nostalgia.
- **Surface:** whatever the scene builds (photos, paper, wood), then aged-film treatment on top:
  scan lines, venetian blinds, grain, grunge, vignette, warm faded grade, gate weave.
- **Motion:** everything steps at 12fps (stop-motion). `<FilmLook grade={SOMBRE_GRADE}>` for sad beats.
- **Type:** serif italic captions (`serif`), condensed display (`display`) for numbers/headlines,
  marigold caption boxes (`CaptionBox`) for punch words.
- **Demo:** `NetflixReel` (lesson 01).

```tsx
<FilmLook grade={DEFAULT_GRADE} scanLines blinds grain grunge vignette gateWeave stopMotion>
  <SceneContent />
</FilmLook>
```

## paper-studio (`PaperStudioLook`, `PAPER`)

- **Use for:** brand/agency promos, "why X matters", product benefits, punchy music-led reels.
- **Surface:** light grey paper, fine halftone dots, soft centre light; `dark` = deep-green chapter.
- **Palette:** `PAPER.green` tiles and floors, `PAPER.red` impact words and wipes, `PAPER.ink`
  support text, `PAPER.lime` for one glowing word.
- **Type, three voices:** `condensed` caps in red (impact), `grotesk` 800 in ink/green (the line),
  `hand` script (the feeling). `calligraphy` once per video, glowing.
- **Objects:** photo-real cut-outs with contact shadows; tiles use `tileShadow()`.
- **Motion:** smooth, fast, springy. Every change is a `Whip` or `BlockWipe` or `ZoomReveal`.
- **Demo:** `PaperStudioDemo` (lesson 02).

## editorial-poster (`EditorialPosterLook`, `EDITORIAL`)

- **Use for:** voice-led narratives, creator/brand stories, "what makes a great…", thought pieces.
- **Surface:** cream poster paper with quiet layout furniture (`EditorialFurniture`: grid lines,
  registration marks, ticks, sparkles, barcode, folio). `dark` = black B&W grid chapter with a back glow.
- **Palette:** cream, ink, and one accent `EDITORIAL.orange`. Nothing else.
- **Type voices (via `WordReveal`):** `lead` small rounded sans, `key` heavy orange caps,
  `script` handwriting, `small` grotesk.
- **Subjects:** one big hero cut-out per scene (`HeroCutout`) on a cloud base, statues and
  characters work best; design-tool UI as decoration (`SelectionBox`, `TimelineStream`, `PhoneMockup`).
- **Motion:** hard cuts on the sentence start; slow push and drift inside each scene; captions
  synced to the voice. Ends on a `CtaCard`.
- **Demo:** `EditorialPosterDemo` (lesson 03).

## Adding a look

A new look is a wrapper component plus a palette constant in `src/library/looks/`, its fonts in
`src/library/engine/fonts.ts`, a demo project, a lesson file, and an entry here.
