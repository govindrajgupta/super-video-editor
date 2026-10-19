# Asset credits

Every shared asset lives in `public/library/` and is listed in
[public/library/catalog.json](public/library/catalog.json) with its source page, licence and author.
`tools/library.py credits` lists the ones that need attribution. Raw downloads are kept out of git.

## Photos that need attribution

| File | Source | Author | License |
|---|---|---|---|
| `library/places/hq-building.png` | [Netflix headquarters.jpg](https://commons.wikimedia.org/wiki/File:Netflix_headquarters.jpg) | Coolcaesar at English Wikipedia | CC BY-SA 3.0 (this adaptation, sky removed, is shared under the same licence) |
| `library/surfaces/paper-wall.jpg` | [Free crumpled paper texture for layers](https://commons.wikimedia.org/wiki/File:Free_crumpled_paper_texture_for_layers_(2978651767).jpg) | Pink Sherbet Photography | CC BY 2.0 |

When a video uses either file, put a credit in its caption, for example:
"Netflix HQ photo by Coolcaesar (CC BY-SA 3.0); paper texture by Pink Sherbet Photography (CC BY 2.0)."
`paper-wall.jpg` appears in the vintage-film and editorial-poster looks and the `Newspaper` element.

## No attribution required

- **Unsplash License:** all people, most objects (brain, eyeball, chess queen, retro TV, Polaroid
  camera, headphones, clapperboard, smartphone, cash, clouds, gold-frame moulding), and the library,
  glass-tower, jellyfish and wood backgrounds. Exact photo links are in the catalog.
- **CC0:** `library/places/blockbuster-bg.jpg` ([The Last Blockbuster storefront](https://commons.wikimedia.org/wiki/File:The_Last_Blockbuster_storefront.jpg), UpdateNerd).
- **Public domain (trademark still applies):** `library/logos/netflix-wordmark.png`.

## Made locally

- Textures `grain.jpg` and `grunge.jpg` (generated), all sound effects and music (`tools/sound.py`).
- Voiceovers: Kokoro TTS (Apache-2.0 model) via `tools/voiceover.py`.
- Newspapers, lamp, foam finger, diamonds, idents, tiles, portals and poster furniture: drawn in code.

## References studied

Techniques were learned from these creators' public videos (see the lessons in
`skills/motion-reel/references/lessons/`); none of their footage, audio or scripts is used:
MoSidd (YouTube), wecreate / @zennn.aep (Instagram), marvix.motion (Instagram).

The people in the videos are stock models standing in for generic roles, not real executives.
