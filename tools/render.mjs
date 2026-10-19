// Render a composition to MP4 and master its audio (loudness-normalised to -16 LUFS, true peak -1.5 dB).
// Usage: npm run render -- <CompositionId> [out.mp4]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [id, outArg] = process.argv.slice(2);
if (!id) {
  console.error("Usage: npm run render -- <CompositionId> [out.mp4]");
  process.exit(1);
}
// Keep Remotion's and Chrome's temp files (bundles, frames) on the project's drive, not C:.
const tmp = path.resolve(".tmp");
fs.mkdirSync(tmp, { recursive: true });
process.env.TEMP = tmp;
process.env.TMP = tmp;
process.env.TMPDIR = tmp;

const slug = id.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const out = path.resolve(outArg ?? `out/${slug}.mp4`);
const raw = out.replace(/\.mp4$/, "-raw.mp4");
fs.mkdirSync(path.dirname(out), { recursive: true });

// Windows needs a shell to run npx; quote every argument so paths with spaces survive it.
const quote = (a) => (/[\s"&|<>^]/.test(a) ? `"${a.replaceAll('"', '\\"')}"` : a);
const run = (cmd, args) =>
  process.platform === "win32"
    ? execFileSync([cmd, ...args].map(quote).join(" "), { stdio: "inherit", shell: true })
    : execFileSync(cmd, args, { stdio: "inherit" });

run("npx", ["remotion", "render", id, raw, "--crf=18"]);
run("ffmpeg", [
  "-y", "-v", "error", "-i", raw, "-c:v", "copy",
  // Normalise any mix (voice-led or music-only) to social-video loudness.
  "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
  "-ar", "48000",
  "-c:a", "aac", "-b:a", "256k", out,
]);
fs.rmSync(raw);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Rendered ${out}`);
