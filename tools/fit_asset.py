"""Fit a new image into a reel asset slot.

Usage: .venv/Scripts/python tools/fit_asset.py <source> <target> [--cutout]
- --cutout: remove the background with rembg first (people, hands, props).
- .png target: keep transparency and trim the empty margin, so scenes size it like the original.
- .jpg target: flatten to RGB and save as JPEG.
"""
import sys

from PIL import Image

args = [a for a in sys.argv[1:] if not a.startswith("--")]
src, target = args
cutout = "--cutout" in sys.argv

im = Image.open(src)
im.load()
if max(im.size) > 2400:
    im.thumbnail((2400, 2400), Image.LANCZOS)

if cutout:
    from rembg import new_session, remove

    im = remove(im.convert("RGB"), session=new_session("birefnet-general-lite"))

if target.lower().endswith(".png"):
    im = im.convert("RGBA")
    box = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if box:
        l, t, r, b = box
        im = im.crop((max(0, l - 4), max(0, t - 4), min(im.width, r + 4), min(im.height, b + 4)))
    im.save(target, optimize=True)
else:
    im.convert("RGB").save(target, quality=90)
print(target, im.size)
