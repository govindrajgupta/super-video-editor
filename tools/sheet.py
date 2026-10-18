"""Tile rendered stills into one labelled contact sheet.

Usage: .venv/Scripts/python tools/sheet.py <compositionId> [out.jpg]
Reads out/stills/<compositionId>-<frame>.jpg, sorted by frame.
"""
import glob
import os
import re
import sys

from PIL import Image, ImageDraw

comp = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join("out", "stills", f"{comp}-sheet.jpg")
files = glob.glob(os.path.join("out", "stills", f"{comp}-*.jpg"))
files = [f for f in files if re.search(rf"{re.escape(comp)}-(\d+)\.jpg$", f)]
files.sort(key=lambda f: int(re.search(r"-(\d+)\.jpg$", f).group(1)))
ims = [Image.open(f) for f in files]
w, h = ims[0].size
cols = min(len(ims), 4)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * h), (20, 20, 20))
draw = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im, (x, y))
    draw.rectangle([x, y, x + 70, y + 24], fill=(255, 220, 0))
    draw.text((x + 6, y + 6), "f" + re.search(r"-(\d+)\.jpg$", f).group(1), fill=(0, 0, 0))
sheet.save(out, quality=85)
print(out, sheet.size)
