"""The shared asset library: add, search and list assets in public/library (catalog.json).

Run with the project venv (.venv/Scripts/python tools/library.py ...):

  add <file-or-https-url> <kind>/<name> [--cutout] [--tags a,b] [--desc "..."]
      [--source Unsplash] [--page https://...] [--license "Unsplash License"] [--author "..."]
      Downloads (if a URL), optionally removes the background, trims/resizes, saves to
      public/library/<kind>/<name>.png|.jpg and records it in the catalog. A cut-out or any
      image with transparency is saved as PNG; everything else as JPEG.
  search <words...>      Find assets whose name, tags or description match all words.
  list [kind]            List assets, optionally of one kind.
  credits                Assets whose licence asks for attribution.

Kinds: people, objects, places, surfaces, textures, logos, ui, sfx, music.
"""
import io
import json
import os
import sys
import urllib.request
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(ROOT, "public", "library")
CATALOG = os.path.join(LIB, "catalog.json")
KINDS = {"people", "objects", "places", "surfaces", "textures", "logos", "ui", "sfx", "music"}
ATTRIBUTION = ("CC BY", "CC-BY")
MAX_SIDE = 2400


def load():
    if not os.path.exists(CATALOG):
        return []
    with open(CATALOG, encoding="utf-8") as f:
        return json.load(f)


def save(entries):
    entries.sort(key=lambda e: e["file"])
    with open(CATALOG, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
        f.write("\n")


def opt(args, name, default=None):
    if name in args:
        i = args.index(name)
        return args[i + 1] if i + 1 < len(args) else default
    return default


def fetch(src):
    if src.startswith("https://"):
        req = urllib.request.Request(src, headers={"User-Agent": "super-video-editor/0.1 (asset library)"})
        with urllib.request.urlopen(req, timeout=90) as r:
            if not r.headers.get("Content-Type", "").startswith("image/"):
                raise SystemExit(f"Not an image: {src}")
            return r.read()
    with open(src, "rb") as f:
        return f.read()


def add(args):
    from PIL import Image

    src, target = args[0], args[1]
    kind, name = target.split("/", 1)
    if kind not in KINDS:
        raise SystemExit(f"Unknown kind '{kind}'. Use one of: {', '.join(sorted(KINDS))}")
    im = Image.open(io.BytesIO(fetch(src)))
    im.load()
    if max(im.size) > MAX_SIDE:
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    cutout = "--cutout" in args
    if cutout:
        im.thumbnail((1800, 1800), Image.LANCZOS)  # plenty for a cut-out, and kinder on memory
        from rembg import new_session, remove

        try:
            im = remove(im.convert("RGB"), session=new_session("birefnet-general-lite"))
        except Exception as err:  # noqa: BLE001 - the large model can run out of memory
            print(f"  birefnet failed ({str(err)[:60]}...), retrying with isnet-general-use")
            im = remove(im.convert("RGB"), session=new_session("isnet-general-use"))
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    os.makedirs(os.path.join(LIB, kind), exist_ok=True)
    if cutout or has_alpha:
        im = im.convert("RGBA")
        box = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
        if box:
            l, t, r, b = box
            im = im.crop((max(0, l - 4), max(0, t - 4), min(im.width, r + 4), min(im.height, b + 4)))
        rel = f"{kind}/{name}.png"
        im.save(os.path.join(LIB, rel), optimize=True)
    else:
        rel = f"{kind}/{name}.jpg"
        im.convert("RGB").save(os.path.join(LIB, rel), quality=90)

    entries = [e for e in load() if e["file"] != f"library/{rel}"]
    entries.append({
        "file": f"library/{rel}",
        "kind": kind,
        "size": list(im.size),
        "cutout": cutout or has_alpha,
        "tags": [t.strip() for t in (opt(args, "--tags", "") or "").split(",") if t.strip()],
        "description": opt(args, "--desc", ""),
        "source": opt(args, "--source"),
        "page": opt(args, "--page", src if src.startswith("https://") else None),
        "license": opt(args, "--license"),
        "author": opt(args, "--author"),
        "added": date.today().isoformat(),
    })
    save(entries)
    print(f"library/{rel} {im.size[0]}x{im.size[1]}")


def show(entries):
    for e in entries:
        size = "x".join(map(str, e.get("size") or [])) or "-"
        print(f"{e['file']:<44} {size:>10}  {', '.join(e.get('tags', []))}  | {e.get('description', '')}")


def search(words):
    words = [w.lower() for w in words]
    hits = [
        e for e in load()
        if all(w in " ".join([e["file"], " ".join(e.get("tags", [])), e.get("description", "")]).lower() for w in words)
    ]
    show(hits)


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "add" and len(args) >= 2:
        add(args)
    elif cmd == "search" and args:
        search(args)
    elif cmd == "list":
        show([e for e in load() if not args or e["kind"] == args[0]])
    elif cmd == "credits":
        show([e for e in load() if any(a in (e.get("license") or "") for a in ATTRIBUTION)])
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
