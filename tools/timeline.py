"""Build a voice-led project's timeline.json from its voiceover.json: one scene per line.

Run:  .venv/Scripts/python tools/timeline.py <project-slug> <mood,mood,...> [--lead 6] [--tail 14] [--end 60]
Each scene starts `lead` frames before its line, lasts the line plus `tail` frames (the last
scene holds `end` frames instead). The scenes and tools/sound.py music both read this file.
"""
import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30


def opt(name, default):
    if name in sys.argv:
        return int(sys.argv[sys.argv.index(name) + 1])
    return default


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    slug, moods = sys.argv[1], sys.argv[2].split(",")
    lead, tail, end = opt("--lead", 6), opt("--tail", 14), opt("--end", 60)
    data = os.path.join(ROOT, "src", "projects", slug, "data")
    with open(os.path.join(data, "voiceover.json"), encoding="utf-8") as f:
        lines = json.load(f)["lines"]
    if len(moods) != len(lines):
        raise SystemExit(f"{len(lines)} voiceover lines but {len(moods)} moods")
    scenes, start = [], 0
    for i, (line, mood) in enumerate(zip(lines, moods)):
        frames = math.ceil(line["seconds"] * FPS) + lead + (end if i == len(lines) - 1 else tail)
        scenes.append({"id": f"scene-{i + 1}", "from": start, "durationInFrames": frames, "voAt": start + lead,
                       "voFrames": math.ceil(line["seconds"] * FPS), "mood": mood, "vo": line["file"]})
        start += frames
    out = {"fps": FPS, "durationInFrames": start, "scenes": scenes}
    with open(os.path.join(data, "timeline.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
        f.write("\n")
    print(f"{len(scenes)} scenes, {start} frames ({start / FPS:.1f}s)")


if __name__ == "__main__":
    main()
