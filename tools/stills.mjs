// Render chosen frames of one or more compositions to JPEGs for a quick visual check.
// Usage: node tools/stills.mjs <compositionId>=<frame,frame,...> [more ...] [--scale=0.35]
// Writes out/stills/<compositionId>-<frame>.jpg
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

// Keep Remotion's temp bundles on the project's drive, not C:.
const tmp = path.resolve(".tmp");
fs.mkdirSync(tmp, { recursive: true });
process.env.TEMP = tmp;
process.env.TMP = tmp;
process.env.TMPDIR = tmp;

const args = process.argv.slice(2);
const scaleArg = args.find((a) => a.startsWith("--scale="));
const scale = scaleArg ? Number(scaleArg.split("=")[1]) : 0.35;
const jobs = args
  .filter((a) => !a.startsWith("--"))
  .map((a) => {
    const [id, frames] = a.split("=");
    return { id, frames: frames.split(",").map(Number) };
  });
if (jobs.length === 0) {
  console.error("Usage: node tools/stills.mjs <compositionId>=<frame,frame,...> [--scale=0.35]");
  process.exit(1);
}

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const { id, frames } of jobs) {
  const composition = await selectComposition({ serveUrl, id });
  for (const frame of frames) {
    const output = path.resolve("out/stills", `${id}-${frame}.jpg`);
    await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 85, scale });
  }
  console.log(`${id}: ${frames.length} stills`);
}
