# Optional: upgrade assets with ChatGPT

Every asset in the reel already comes from free photos or code, so nothing here is required.
If you want the AI-generated look the creator used (GPT Image), paste these into ChatGPT, download
the result, save it with the file name shown, and re-render. Images with a transparent background
drop straight into `public/assets/`. A replacement with different proportions may need its size
or position nudged in the scene file.

A ChatGPT subscription can't be connected to this project directly: it doesn't include API access.
Pasting the prompts by hand is the way to use it.

---

**`public/assets/founder.png`** (scenes 1 and 5)
> Photorealistic waist-up portrait of a confident tech founder in his late 30s, dark navy blazer over an open-collar white shirt, warm half-smile, looking at the camera, soft studio light, 2000s look. Transparent background PNG, vertical 2:3.

**`public/assets/boss.png`** (scene 2)
> Photorealistic waist-up portrait of an arrogant 1990s corporate CEO in a tweed suit and flat cap, round dark sunglasses, smoking a fat cigar held in his right hand, smug expression. Transparent background PNG, vertical 3:5.

**`public/assets/exec-full.png`** (scene 4)
> Photorealistic full-length photo of a grim middle-aged executive in a black three-piece suit, standing straight, arms by his sides, shoes fully visible, defeated expression. Transparent background PNG, vertical 2:5.

**`public/assets/founder-full.png`** (scene 6)
> Photorealistic full-length photo of the same tech founder, navy suit, hands folded in front, calm and quietly triumphant smile, shoes fully visible. Transparent background PNG, vertical 1:3.

**`public/assets/library-bg.jpg`** (scene 5)
> Photorealistic wood-panelled private study with tall bookshelves, a green banker's lamp and a heavy desk, warm evening light, shot straight on, vertical 9:16, no people.

**Newspapers** (scene 3) are drawn in code in `src/elements/Newspaper.tsx`. To use generated
front pages instead:
> Aged sepia newspaper front page, masthead "The Daily Report", giant condensed headline "NO LATE FEES", small columns of body text and one halftone photo, slightly crumpled, flat lay, transparent background PNG, vertical 3:4.
