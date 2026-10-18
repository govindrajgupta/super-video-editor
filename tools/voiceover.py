"""Generate the voiceover with Kokoro (local, free) — one WAV per scene line.

Run:  .venv/Scripts/python tools/voiceover.py [voice] [speed]
Writes public/audio/vo-<n>.wav and src/data/voiceover.json (line text + duration in seconds).
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(ROOT, "tools", "models")
AUDIO = os.path.join(ROOT, "public", "audio")
DATA = os.path.join(ROOT, "src", "data")

LINES = [
    "In two thousand, a tiny startup called Netflix offered to sell itself to Blockbuster.",
    "The price? Fifty million dollars. Blockbuster laughed them out of the room.",
    "So Netflix built the opposite. No late fees. No stores. Customers first.",
    "Ten years later, Blockbuster was closing stores by the thousand, and filed for bankruptcy.",
    "Today, Netflix brings in over forty-five billion dollars a year. The biggest paid streaming service on Earth.",
    "That was the most expensive \"no\" in business history.",
]


def trim_silence(samples, sr, threshold=0.01, pad=0.06):
    loud = np.where(np.abs(samples) > threshold)[0]
    if len(loud) == 0:
        return samples
    start = max(0, loud[0] - int(pad * sr))
    end = min(len(samples), loud[-1] + int(pad * sr))
    return samples[start:end]


def main():
    voice = sys.argv[1] if len(sys.argv) > 1 else "am_michael"
    speed = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
    kokoro = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    os.makedirs(AUDIO, exist_ok=True)
    os.makedirs(DATA, exist_ok=True)
    out = []
    for i, text in enumerate(LINES, start=1):
        samples, sr = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
        samples = trim_silence(np.asarray(samples, dtype=np.float32), sr)
        peak = float(np.max(np.abs(samples)))
        samples = samples * (0.89 / peak)  # normalise to about -1 dBFS
        path = os.path.join(AUDIO, f"vo-{i}.wav")
        sf.write(path, samples, sr)
        seconds = round(len(samples) / sr, 3)
        out.append({"scene": i, "file": f"audio/vo-{i}.wav", "seconds": seconds, "text": text})
        print(f"vo-{i}.wav {seconds:.2f}s  {text}")
    with open(os.path.join(DATA, "voiceover.json"), "w", encoding="utf-8") as f:
        json.dump({"voice": voice, "speed": speed, "lines": out}, f, indent=2)


if __name__ == "__main__":
    main()
