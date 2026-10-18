"""Turn the downloaded photos in assets-src/raw into the files the scenes use (public/assets).

Run with the project venv:  .venv/Scripts/python tools/prepare_assets.py [step ...]
Steps: cutouts, hq, clouds, backgrounds, logo, frame, textures (default: all).
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "assets-src", "raw")
OUT = os.path.join(ROOT, "public", "assets")

# name in public/assets -> (source file, max height)
CUTOUTS = {
    "founder": ("founder.jpg", 2000),
    "happy-founder": ("happy-founder-alt.jpg", 2400),
    "sad-exec": ("sad-exec.jpg", 2400),
    "boss": ("boss.jpg", 2400),
    "cash-hand": ("cash-hand.jpg", 1400),
    "cash-stacks": ("cash-stacks.jpg", 1600),
    "exec-full": ("exec-full.jpg", 2400),
    "founder-full": ("founder-full.jpg", 2400),
}

BACKGROUNDS = {
    "blockbuster-bg": ("blockbuster.jpg", None),
    "library-bg": ("library.jpg", 2400),
    "glass-tower-bg": ("glass-tower.jpg", 2400),
    "wood-desk": ("wood-desk-alt.jpg", None),
    "paper-wall": ("paper-wall.jpg", 2400),
}


def raw(name):
    return Image.open(os.path.join(RAW, name))


def save(im, name, **kw):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    im.save(path, **kw)
    print(f"  {name} {im.size}")


def fit_height(im, max_h):
    if max_h and im.height > max_h:
        im = im.resize((round(im.width * max_h / im.height), max_h), Image.LANCZOS)
    return im


def trim(im, pad=4):
    box = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


def cutouts():
    from rembg import new_session, remove

    session = new_session("birefnet-general-lite")
    for name, (src, max_h) in CUTOUTS.items():
        if os.path.exists(os.path.join(OUT, f"{name}.png")):
            continue  # delete the PNG to redo a cutout
        im = fit_height(raw(src).convert("RGB"), max_h)
        cut = remove(im, session=session)
        save(trim(cut), f"{name}.png", optimize=True)


def hq():
    """Netflix HQ with the clear blue sky removed, so clouds can drift behind it."""
    im = raw("netflix-hq.jpg").convert("RGB")
    hsv = np.asarray(im.convert("HSV")).astype(np.float32)
    h, s, v = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2] / 255
    sky = (h > 185) & (h < 235) & (s > 0.12) & (v > 0.5)
    labels, _ = ndimage.label(sky)
    top = set(np.unique(labels[:40])) - {0}
    mask = np.isin(labels, list(top))
    mask = ndimage.binary_opening(mask, iterations=1)
    alpha = Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    out = im.convert("RGBA")
    out.putalpha(alpha)
    save(out, "hq-building.png", optimize=True)


def clouds():
    """White clouds on transparent, keyed from a blue-sky photo."""
    im = raw("clouds.jpg").convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255
    lo, hi = a.min(axis=2), a.max(axis=2)
    whiteness = np.clip((lo - 0.5) / 0.35, 0, 1) * np.clip(1 - (hi - lo - 0.05) / 0.35, 0, 1)
    whiteness = np.clip(whiteness * 1.6, 0, 1) ** 0.8
    rgba = np.dstack([a, whiteness]) * 255
    out = Image.fromarray(rgba.astype(np.uint8), "RGBA")
    save(trim(out, pad=0), "clouds.png", optimize=True)


def backgrounds():
    for name, (src, max_h) in BACKGROUNDS.items():
        im = fit_height(raw(src).convert("RGB"), max_h)
        save(im, f"{name}.jpg", quality=90)


def logo():
    """Netflix wordmark with the white background keyed out."""
    im = raw("netflix-logomark.png").convert("RGB")
    a = np.asarray(im).astype(np.float32)
    red = np.clip((a[..., 0] - a[..., 1]) / 120, 0, 1)
    rgba = np.dstack([np.full_like(a[..., 0], 229), np.full_like(a[..., 0], 9), np.full_like(a[..., 0], 20), red * 255])
    save(trim(Image.fromarray(rgba.astype(np.uint8), "RGBA"), pad=2), "netflix-wordmark.png", optimize=True)


def frame(outer=(1480, 2320), border=200):
    """Mitred gilt frame built from the moulding strip of a gilded wall panel. Inside is transparent.

    The default leaves a 1080x1920 opening, so a full reel frame fits inside it exactly.
    """
    src = raw("gold-frame.jpg").convert("RGB")
    strip = src.crop((0, 300, 440, 1900))  # outer moulding, inner edge on the right
    strip = strip.resize((border, round(strip.height * border / strip.width)), Image.LANCZOS)
    w, h = outer
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    def side(length):
        tile = Image.new("RGB", (border, length))
        y = 0
        while y < length:
            tile.paste(strip, (0, y))
            y += strip.height
        return tile

    left = side(h)
    right = left.transpose(Image.FLIP_LEFT_RIGHT)
    top = side(w).rotate(-90, expand=True)
    bottom = top.transpose(Image.FLIP_TOP_BOTTOM)
    from PIL import ImageDraw

    def paste_poly(img, pos, poly):
        m = Image.new("L", (w, h), 0)
        ImageDraw.Draw(m).polygon(poly, fill=255)
        layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        layer.paste(img, pos)
        canvas.paste(layer, (0, 0), m)

    b = border
    paste_poly(left, (0, 0), [(0, 0), (b, b), (b, h - b), (0, h)])
    paste_poly(right, (w - b, 0), [(w, 0), (w, h), (w - b, h - b), (w - b, b)])
    paste_poly(top, (0, 0), [(0, 0), (w, 0), (w - b, b), (b, b)])
    paste_poly(bottom, (0, h - b), [(0, h), (b, h - b), (w - b, h - b), (w, h)])
    save(canvas, "gold-frame.png", optimize=True)


def textures(size=(1080, 1920), seed=7):
    rng = np.random.default_rng(seed)
    w, h = size
    grain = rng.normal(128, 38, (h, w))
    grain = ndimage.gaussian_filter(grain, 0.6)
    save(Image.fromarray(np.clip(grain, 0, 255).astype(np.uint8)), "grain.jpg", quality=88)

    # Grunge: stacked blotchy noise, dust specks and a few vertical scratches.
    g = np.zeros((h, w))
    for scale, amp in ((180, 1.0), (60, 0.5), (16, 0.25)):
        n = rng.normal(0, 1, (h // scale + 2, w // scale + 2))
        n = np.asarray(Image.fromarray(n.astype(np.float32)).resize((w, h), Image.BICUBIC))
        g += amp * n
    g = (g - g.min()) / (g.max() - g.min())
    g = 0.72 + 0.28 * g
    for _ in range(900):
        y, x = rng.integers(0, h), rng.integers(0, w)
        r = rng.integers(1, 4)
        g[max(0, y - r):y + r, max(0, x - r):x + r] *= rng.uniform(0.35, 0.8)
    for _ in range(14):
        x = rng.integers(0, w)
        y0, y1 = sorted(rng.integers(0, h, 2))
        g[y0:y1, x:x + 1] *= 0.6
    save(Image.fromarray((g * 255).astype(np.uint8)), "grunge.jpg", quality=88)


STEPS = {
    "cutouts": cutouts,
    "hq": hq,
    "clouds": clouds,
    "backgrounds": backgrounds,
    "logo": logo,
    "frame": frame,
    "textures": textures,
}

if __name__ == "__main__":
    for step in sys.argv[1:] or STEPS:
        print(step)
        STEPS[step]()
