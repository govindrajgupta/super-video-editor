"""Generate a project's voiceover with Kokoro (local, free): one WAV per script line.

Run:  .venv/Scripts/python tools/voiceover.py <project-slug> [voice] [speed]
Reads  src/projects/<slug>/data/script.json   {"voice", "speed", "lines": [...]}
Writes public/projects/<slug>/vo-<n>.wav and src/projects/<slug>/data/voiceover.json
(each line's text and duration, which the scenes and music use for timing).
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(ROOT, "tools", "models")


def trim_silence(samples, sr, threshold=0.01, pad=0.06):
    loud = np.where(np.abs(samples) > threshold)[0]
    if len(loud) == 0:
        return samples
    start = max(0, loud[0] - int(pad * sr))
    end = min(len(samples), loud[-1] + int(pad * sr))
    return samples[start:end]


def main():
    if len(sys.argv) < 2:
        raise SystemExit("Usage: voiceover.py <project-slug> [voice] [speed]")
    slug = sys.argv[1]
    data_dir = os.path.join(ROOT, "src", "projects", slug, "data")
    with open(os.path.join(data_dir, "script.json"), encoding="utf-8") as f:
        script = json.load(f)
    voice = sys.argv[2] if len(sys.argv) > 2 else script.get("voice", "am_michael")
    speed = float(sys.argv[3]) if len(sys.argv) > 3 else float(script.get("speed", 1.0))

    kokoro = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    audio_dir = os.path.join(ROOT, "public", "projects", slug)
    os.makedirs(audio_dir, exist_ok=True)
    out = []
    for i, text in enumerate(script["lines"], start=1):
        samples, sr = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
        samples = trim_silence(np.asarray(samples, dtype=np.float32), sr)
        samples = samples * (0.89 / float(np.max(np.abs(samples))))  # about -1 dBFS
        sf.write(os.path.join(audio_dir, f"vo-{i}.wav"), samples, sr)
        seconds = round(len(samples) / sr, 3)
        out.append({"scene": i, "file": f"projects/{slug}/vo-{i}.wav", "seconds": seconds, "text": text})
        print(f"vo-{i}.wav {seconds:.2f}s  {text}")
    with open(os.path.join(data_dir, "voiceover.json"), "w", encoding="utf-8") as f:
        json.dump({"voice": voice, "speed": speed, "lines": out}, f, indent=2)


if __name__ == "__main__":
    main()
