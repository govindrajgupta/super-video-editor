"""Synthesize sound effects and music beds locally (no samples, no API).

Run:
  .venv/Scripts/python tools/sound.py sfx            -> public/library/sfx/*.wav (shared)
  .venv/Scripts/python tools/sound.py music <slug>   -> public/projects/<slug>/music.wav

The music follows src/projects/<slug>/data/timeline.json: one section per scene, shaped by the
scene's "mood" (underdog, tension, lift, sombre, triumph, resolve, pulse, dark).
"""
import json
import os

import numpy as np
import soundfile as sf
from scipy import signal

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SFX = os.path.join(ROOT, "public", "library", "sfx")
rng = np.random.default_rng(11)


# ---------- building blocks ----------

def t_axis(seconds):
    return np.arange(int(seconds * SR)) / SR


def noise(seconds):
    return rng.uniform(-1, 1, int(seconds * SR))


def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lowpass(x, cutoff, order=2):
    sos = signal.butter(order, cutoff, btype="low", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def highpass(x, cutoff, order=2):
    sos = signal.butter(order, cutoff, btype="high", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def sweep_filter(x, f_start, f_peak, f_end, q=1.2, peak_at=0.6):
    """Band-pass whose centre frequency glides start -> peak -> end (processed in blocks)."""
    out = np.zeros_like(x)
    n = len(x)
    block = 512
    zi = None
    for i in range(0, n, block):
        p = i / n
        if p < peak_at:
            fc = f_start * (f_peak / f_start) ** (p / peak_at)
        else:
            fc = f_peak * (f_end / f_peak) ** ((p - peak_at) / (1 - peak_at))
        lo, hi = fc / (1 + 1 / q), min(fc * (1 + 1 / q), SR / 2 - 100)
        sos = signal.butter(2, [lo, hi], btype="band", fs=SR, output="sos")
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        out[i:i + block], zi = signal.sosfilt(sos, x[i:i + block], zi=zi)
    return out


def env_exp(seconds, decay):
    return np.exp(-t_axis(seconds) / decay)


def env_ar(seconds, attack, release_start=None):
    t = t_axis(seconds)
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    if release_start is not None:
        a *= np.clip(1 - (t - release_start) / max(seconds - release_start, 1e-4), 0, 1)
    return a


def reverb(x, seconds=1.6, mix=0.3, seed=1):
    """Cheap stereo reverb: convolve with decaying noise. Returns (n, 2)."""
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    decay = np.exp(-np.arange(n) / (SR * seconds / 5))
    ir_l = r.uniform(-1, 1, n) * decay
    ir_r = r.uniform(-1, 1, n) * decay
    ir_l, ir_r = lowpass(ir_l, 6000), lowpass(ir_r, 6000)
    wet_l = signal.fftconvolve(x, ir_l)
    wet_r = signal.fftconvolve(x, ir_r)
    dry = np.pad(x, (0, len(wet_l) - len(x)))
    norm = max(np.max(np.abs(wet_l)), 1e-9) / max(np.max(np.abs(x)), 1e-9)
    return np.stack([dry * (1 - mix) + wet_l / norm * mix, dry * (1 - mix) + wet_r / norm * mix], axis=1)


def stereo(x, pan=0.0):
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * left * 1.414, x * right * 1.414], axis=1)


def save(name, x, peak=0.9):
    os.makedirs(SFX, exist_ok=True)
    if x.ndim == 1:
        x = stereo(x)
    x = x / max(np.max(np.abs(x)), 1e-9) * peak
    fade = int(0.005 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    sf.write(os.path.join(SFX, f"{name}.wav"), x.astype(np.float32), SR)
    print(f"  sfx/{name}.wav {len(x) / SR:.2f}s")


# ---------- sound effects ----------

def whoosh(seconds, f0, f1, f2, peak_at, pan_from=-0.6, pan_to=0.6):
    x = sweep_filter(noise(seconds), f0, f1, f2, q=1.5, peak_at=peak_at)
    t = t_axis(seconds) / seconds
    amp = np.where(t < peak_at, (t / peak_at) ** 2.2, np.exp(-(t - peak_at) / (1 - peak_at) * 4))
    x = x * amp
    pan = np.linspace(pan_from, pan_to, len(x))
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * left, x * right], axis=1)


def shutter():
    def click(seconds=0.012):
        return highpass(noise(seconds), 2500) * env_exp(seconds, 0.003)

    x = np.zeros(int(0.35 * SR))
    for at, gain in ((0.0, 1.0), (0.07, 0.7)):
        c = click()
        i = int(at * SR)
        x[i:i + len(c)] += c * gain
    whirr = bandpass(noise(0.2), 800, 2400) * env_ar(0.2, 0.01, 0.05) * 0.25
    x[int(0.02 * SR):int(0.02 * SR) + len(whirr)] += whirr
    return reverb(x, 0.6, 0.15)


def focus_hunt(seconds=0.6):
    t = t_axis(seconds)
    f = 210 + 40 * np.sin(2 * np.pi * 7 * t)
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    gate = (np.sin(2 * np.pi * 3.2 * t) > -0.3).astype(float)
    x = bandpass(saw, 300, 2200) * gate * env_ar(seconds, 0.02, seconds - 0.1)
    return stereo(x * 0.6, -0.2)


def cha_ching():
    cha = bandpass(noise(0.08), 2500, 7000) * env_exp(0.08, 0.02)
    t = t_axis(1.6)
    bell = np.zeros_like(t)
    for f, a, d in ((2093, 1.0, 0.7), (2890, 0.6, 0.5), (4186, 0.45, 0.35), (5420, 0.3, 0.25), (1046, 0.35, 0.9)):
        bell += a * np.sin(2 * np.pi * f * t) * np.exp(-t / d)
    x = np.zeros(int(1.9 * SR))
    x[: len(cha)] += cha * 0.8
    i = int(0.09 * SR)
    x[i:i + len(bell)] += bell * 0.5
    j = int(0.22 * SR)
    x[j:j + len(bell)] += bell * 0.35
    return reverb(x, 1.2, 0.25)


def neon_buzz(seconds=4.5):
    t = t_axis(seconds)
    hum = sum(np.sign(np.sin(2 * np.pi * 120 * k * t)) / k ** 1.5 for k in (1, 2, 3))
    hum = lowpass(hum, 1800) * 0.35 + bandpass(noise(seconds), 3000, 8000) * 0.05
    flicker = np.ones_like(t)
    for a, b in ((0.0, 0.05), (0.09, 0.13), (0.2, 0.24)):
        flicker[int(a * SR):int(b * SR)] = 0.0
    crackle = np.zeros_like(t)
    for _ in range(30):
        i = rng.integers(0, len(t) - 400)
        crackle[i:i + 300] += highpass(noise(300 / SR), 3000) * rng.uniform(0.2, 0.6)
    x = (hum + crackle) * flicker * env_ar(seconds, 0.01, seconds - 0.6)
    return stereo(x, 0.3)


def slot_spin(seconds=0.95):
    x = np.zeros(int(seconds * SR))
    at = 0.0
    gap = 0.03
    while at < seconds - 0.02:
        c = bandpass(noise(0.01), 1500, 5000) * env_exp(0.01, 0.002)
        i = int(at * SR)
        x[i:i + len(c)] += c
        at += gap
        gap *= 1.06
    return stereo(x, 0.0)


def slot_stop():
    t = t_axis(0.5)
    thud = np.sin(2 * np.pi * (90 * np.exp(-t * 6) + 45) * t) * np.exp(-t / 0.09)
    click = highpass(noise(0.5), 2000) * np.exp(-t / 0.004)
    ding_t = t_axis(1.2)
    ding = (np.sin(2 * np.pi * 1568 * ding_t) + 0.5 * np.sin(2 * np.pi * 2349 * ding_t)) * np.exp(-ding_t / 0.4)
    x = np.zeros(int(1.4 * SR))
    x[: len(thud)] += thud + click * 0.6
    i = int(0.04 * SR)
    x[i:i + len(ding)] += ding * 0.35
    return reverb(x, 0.9, 0.2)


def paper_slap():
    t = t_axis(0.4)
    slap = lowpass(noise(0.4), 3000) * np.exp(-t / 0.035)
    thump = np.sin(2 * np.pi * 110 * t) * np.exp(-t / 0.06)
    rustle = bandpass(noise(0.4), 2000, 6000) * np.exp(-t / 0.12) * 0.25
    return reverb(slap + thump * 0.8 + rustle, 0.5, 0.12)


def glitch():
    x = np.zeros(int(0.16 * SR))
    seg = int(0.02 * SR)
    for i in range(0, len(x), seg):
        f = rng.uniform(200, 2400)
        tt = np.arange(min(seg, len(x) - i)) / SR
        x[i:i + len(tt)] = np.sign(np.sin(2 * np.pi * f * tt)) * rng.uniform(0.4, 1)
    x = np.round(x * 4) / 4
    return stereo(x * 0.6 + bandpass(noise(0.16), 1000, 8000) * 0.3, 0.0)


def boom():
    t = t_axis(2.2)
    f = 35 + 30 * np.exp(-t * 3)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.7)
    rumble = lowpass(noise(2.2), 200) * np.exp(-t / 0.5) * 0.6
    return reverb(np.tanh((sub + rumble) * 1.6), 1.5, 0.25)


def ta_dum():
    def hit(seconds, f_hi, f_lo, decay):
        t = t_axis(seconds)
        f = f_lo + (f_hi - f_lo) * np.exp(-t * 18)
        tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / decay)
        return np.tanh(tone * 1.8) + lowpass(noise(seconds), 400) * np.exp(-t / 0.05) * 0.5

    ta = hit(0.5, 160, 70, 0.18)
    t = t_axis(3.0)
    chord = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * a for f, a in ((55, 1), (82.4, 0.6), (110, 0.5), (164.8, 0.3)))
    dum = hit(3.0, 120, 42, 0.9) + chord * np.exp(-t / 1.1) * 0.6
    x = np.zeros(int(3.6 * SR))
    x[: len(ta)] += ta * 0.7
    i = int(0.38 * SR)
    x[i:i + len(dum)] += dum
    return reverb(lowpass(x, 3000), 2.4, 0.35)


def scribble():
    t = t_axis(0.35)
    x = bandpass(noise(0.35), 2500, 7000) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t)) ** 2
    return stereo(x * env_ar(0.35, 0.02, 0.25), 0.2)


def pop():
    t = t_axis(0.09)
    f = 900 * np.exp(-t * 30) + 180
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.03)
    return stereo(x, 0.0)


def make_sfx():
    save("whoosh-long", whoosh(1.4, 250, 3200, 500, 0.62))
    save("whoosh-quick", whoosh(0.45, 600, 4200, 900, 0.45))
    save("whoosh-entrance", whoosh(0.7, 300, 2600, 700, 0.55, 0.6, -0.4))
    save("shutter", shutter())
    save("focus-hunt", focus_hunt())
    save("cha-ching", cha_ching())
    save("neon-buzz", neon_buzz(), peak=0.5)
    save("slot-spin", slot_spin())
    save("slot-stop", slot_stop())
    save("paper-slap", paper_slap())
    save("glitch", glitch())
    save("boom", boom())
    save("ta-dum", ta_dum())
    save("scribble", scribble(), peak=0.6)
    save("pop", pop(), peak=0.6)


# ---------- music ----------

NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def hz(name, octave):
    return 440 * 2 ** ((NOTE[name] + 12 * (octave + 1) - 69) / 12)


CHORDS = {
    "Am": [("A", 2), ("C", 3), ("E", 3), ("A", 3)],
    "F": [("F", 2), ("A", 2), ("C", 3), ("F", 3)],
    "G": [("G", 2), ("B", 2), ("D", 3), ("G", 3)],
    "C": [("C", 3), ("E", 3), ("G", 3), ("C", 4)],
    "Dm": [("D", 3), ("F", 3), ("A", 3), ("D", 4)],
    "E": [("E", 2), ("G", 2), ("B", 2), ("E", 3)],
}


def pad(freqs, seconds, brightness=1200, attack=0.6):
    t = t_axis(seconds)
    x = np.zeros_like(t)
    for f in freqs:
        for detune in (-0.004, 0, 0.004):
            x += 2 * ((t * f * (1 + detune) + rng.uniform()) % 1) - 1
    x = lowpass(x / (len(freqs) * 3), brightness)
    return x * env_ar(seconds, attack, seconds - min(0.8, seconds / 3))


def pluck(f, seconds=1.2, decay=0.35):
    t = t_axis(seconds)
    x = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.3 * np.exp(-t * k / decay) for k in range(1, 6))
    return x * np.clip(t / 0.003, 0, 1)


def kick():
    t = t_axis(0.4)
    f = 45 + 90 * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)


def snare():
    t = t_axis(0.25)
    return bandpass(noise(0.25), 1200, 7000) * np.exp(-t / 0.06) * 0.7 + np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05) * 0.5


def hat():
    t = t_axis(0.05)
    return highpass(noise(0.05), 7000) * np.exp(-t / 0.012)


def place(buf, x, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    buf[i:i + n] += x[:n]


BEAT = 60 / 100  # 100 bpm


def chord(name, octave_shift=0):
    return [hz(n, o + octave_shift) for n, o in CHORDS[name]]


def section_underdog(mus, drums, a, b):
    place(mus, pad(chord("Am"), b - a + 0.6, 900, 1.2) * 0.5, a)
    for k, (n, o) in enumerate([("A", 4), ("E", 4), ("C", 5), ("B", 4), ("A", 4), ("E", 4)]):
        if a + 0.4 + k * BEAT * 1.5 < b:
            place(mus, pluck(hz(n, o)) * 0.25, a + 0.4 + k * BEAT * 1.5)


def section_tension(mus, drums, a, b):
    t = a
    while t < b - 0.05:
        place(mus, pluck(hz("A", 1), 0.4, 0.25) * 0.5, t)
        place(drums, hat() * 0.35, t + BEAT / 4)
        t += BEAT / 2
    place(mus, pad(chord("E"), b - a + 0.4, 700, 0.8) * 0.35, a)


def section_lift(mus, drums, a, b):
    prog = ["F", "G", "Am", "C"]
    span = (b - a) / len(prog)
    for k, c in enumerate(prog):
        place(mus, pad(chord(c), span + 0.4, 1500, 0.15) * 0.4, a + k * span)
        for j, f in enumerate(chord(c, 1)):
            place(mus, pluck(f, 0.8) * 0.18, a + k * span + j * span / 4)
    t = a
    while t < b - 0.05:
        place(drums, kick() * 0.7, t)
        t += BEAT


def section_sombre(mus, drums, a, b):
    half = (b - a) / 2
    place(mus, pad(chord("Dm"), half + 0.6, 700, 0.8) * 0.45, a)
    place(mus, pad(chord("Am"), half + 0.8, 600, 0.8) * 0.45, a + half)
    place(mus, pad([hz("A", 1)], b - a, 300, 1.0) * 0.4, a)


def section_triumph(mus, drums, a, b):
    prog = ["C", "G", "Am", "F"]
    span = (b - a) / len(prog)
    for k, c in enumerate(prog):
        place(mus, pad(chord(c), span + 0.4, 2600, 0.05) * 0.5, a + k * span)
        place(mus, pluck(hz(CHORDS[c][0][0], 1), span, 0.8) * 0.7, a + k * span)
    t, n = a, 0
    while t < b - 0.05:
        place(drums, kick() * 0.8, t)
        if n % 2 == 1:
            place(drums, snare() * 0.55, t)
        place(drums, hat() * 0.3, t + BEAT / 2)
        t += BEAT
        n += 1


def section_resolve(mus, drums, a, b):
    place(mus, pad(chord("C") + [hz("E", 4), hz("G", 4)], b - a + 2.5, 2000, 0.05) * 0.55, a)
    place(mus, pluck(hz("C", 2), 3.0, 1.4) * 0.8, a)
    place(drums, kick() * 0.8, a)


def section_pulse(mus, drums, a, b):
    """Modern promo groove: four-on-the-floor, off-beat hats, plucky minor arps."""
    prog = ["Am", "F", "C", "G"]
    span = (b - a) / len(prog)
    for k, c in enumerate(prog):
        place(mus, pad(chord(c), span + 0.3, 1800, 0.02) * 0.32, a + k * span)
        step, t = BEAT / 4, a + k * span
        notes = chord(c, 1)
        i = 0
        while t < a + (k + 1) * span - 0.02:
            place(mus, pluck(notes[i % len(notes)], 0.35, 0.18) * 0.16, t)
            t += step
            i += 1
    t, n = a, 0
    while t < b - 0.05:
        place(drums, kick() * 0.85, t)
        place(drums, hat() * 0.32, t + BEAT / 2)
        if n % 2 == 1:
            place(drums, snare() * 0.4, t)
        t += BEAT
        n += 1


def section_dark(mus, drums, a, b):
    """Low, wide and serious: sub drone, minor pad, a slow heartbeat kick."""
    place(mus, pad([hz("D", 1), hz("A", 1)], b - a + 0.8, 260, 0.6) * 0.5, a)
    place(mus, pad(chord("Dm"), b - a + 0.8, 900, 1.0) * 0.3, a)
    t = a
    while t < b - 0.05:
        place(drums, kick() * 0.6, t)
        place(drums, kick() * 0.35, t + 0.22)
        t += BEAT * 2


SECTIONS = {
    "underdog": section_underdog,
    "tension": section_tension,
    "lift": section_lift,
    "sombre": section_sombre,
    "triumph": section_triumph,
    "resolve": section_resolve,
    "pulse": section_pulse,
    "dark": section_dark,
}


def make_music(slug):
    path = os.path.join(ROOT, "src", "projects", slug, "data", "timeline.json")
    with open(path, encoding="utf-8") as f:
        timeline = json.load(f)
    fps = timeline["fps"]
    end = timeline["durationInFrames"] / fps
    total = end + 2.5
    mus = np.zeros(int(total * SR))
    drums = np.zeros_like(mus)
    scenes = timeline["scenes"]
    for i, scene in enumerate(scenes):
        a = scene["from"] / fps
        b = scenes[i + 1]["from"] / fps if i + 1 < len(scenes) else end
        mood = scene.get("mood", "pulse")
        if mood not in SECTIONS:
            raise SystemExit(f"Unknown mood '{mood}' in scene {scene['id']}. Use one of: {', '.join(SECTIONS)}")
        SECTIONS[mood](mus, drums, a, b)

    mix = reverb(mus, 2.2, 0.3, seed=4)[: len(mus)] + stereo(drums, 0.0) * 0.8
    mix = mix / np.max(np.abs(mix)) * 0.85
    fade = int(2.0 * SR)
    mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
    out_dir = os.path.join(ROOT, "public", "projects", slug)
    os.makedirs(out_dir, exist_ok=True)
    sf.write(os.path.join(out_dir, "music.wav"), mix.astype(np.float32), SR)
    print(f"  projects/{slug}/music.wav {len(mix) / SR:.1f}s")


if __name__ == "__main__":
    import sys

    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "sfx":
        make_sfx()
    elif cmd == "music" and len(sys.argv) > 2:
        make_music(sys.argv[2])
    else:
        raise SystemExit("Usage: sound.py sfx | sound.py music <project-slug>")
