import type React from "react";
import { Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

/** Wobble a point once per 8fps step so drawn lines "boil" like hand animation. */
const jitter = (seed: string, frame: number, fps: number, amount: number) => {
  const step = Math.floor((frame * 8) / fps);
  return (random(`${seed}-${step}`) - 0.5) * amount;
};

const drawOn = (frame: number, at: number, frames: number) =>
  interpolate(frame, [at, at + frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });

/** Dashed wireframe diamond that draws on at `at` and wobbles at 8fps. */
export const HandDiamond: React.FC<{
  readonly at: number;
  readonly size: number;
  readonly color?: string;
  readonly seed: string;
  readonly style?: React.CSSProperties;
}> = ({ at, size, color = "#f6e7c8", seed, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j = (k: string) => jitter(`${seed}-${k}`, frame, fps, 10);
  const s = size;
  const d = `M ${s / 2 + j("a")} ${6 + j("b")} L ${s - 6 + j("c")} ${s / 2 + j("d")} L ${s / 2 + j("e")} ${s - 6 + j("f")} L ${6 + j("g")} ${s / 2 + j("h")} Z`;
  const length = s * 2.9;

  return (
    <svg width={s} height={s} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinejoin="round"
        strokeDasharray={`${length}`}
        strokeDashoffset={drawOn(frame, at, 14) * length}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="14 12"
        opacity={interpolate(frame, [at + 10, at + 16], [0, 0.7], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        transform={`translate(${j("t")} ${j("u")}) scale(0.94) translate(${s * 0.03} ${s * 0.03})`}
      />
    </svg>
  );
};

/** Hand-drawn marker underline that draws on from left to right. */
export const Underline: React.FC<{
  readonly at: number;
  readonly width: number;
  readonly color?: string;
  readonly seed: string;
  readonly style?: React.CSSProperties;
}> = ({ at, width, color = "#f2c230", seed, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j = (k: string) => jitter(`${seed}-${k}`, frame, fps, 6);
  const d = `M 4 ${22 + j("a")} C ${width * 0.3} ${8 + j("b")}, ${width * 0.65} ${30 + j("c")}, ${width - 4} ${14 + j("d")}`;
  const length = width * 1.1;

  return (
    <svg width={width} height={40} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={`${length}`}
        strokeDashoffset={drawOn(frame, at, 8) * length}
      />
    </svg>
  );
};

/** A loose double pencil oval scribbled around a word. */
export const PencilOval: React.FC<{
  readonly at: number;
  readonly frames?: number;
  readonly width: number;
  readonly height: number;
  readonly color?: string;
  readonly seed: string;
  readonly style?: React.CSSProperties;
}> = ({ at, frames = 9, width, height, color = "#f2d34a", seed, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j = (k: string) => jitter(`${seed}-${k}`, frame, fps, 8);
  const rx = width / 2;
  const ry = height / 2;
  const loop = (k: string, grow: number) =>
    `M ${rx * 0.2} ${ry * 0.35 + j(`${k}a`)} ` +
    `C ${rx * 0.9 + j(`${k}b`)} ${-ry * 0.25 * grow}, ${rx * 2.1 * grow} ${ry * 0.1 + j(`${k}c`)}, ${rx * 1.95} ${ry * 1.1} ` +
    `S ${rx * 0.6 + j(`${k}d`)} ${ry * 2.15 * grow}, ${rx * 0.05} ${ry * 1.2 + j(`${k}e`)} ` +
    `S ${rx * 0.5} ${-ry * 0.1}, ${rx * 1.3} ${ry * 0.05 + j(`${k}f`)}`;
  const length = (width + height) * 2.4;

  return (
    <svg width={width} height={height} style={{ position: "absolute", overflow: "visible", ...style }}>
      {(["one", "two"] as const).map((k, i) => (
        <path
          key={k}
          d={loop(k, 1 + i * 0.05)}
          fill="none"
          stroke={color}
          strokeWidth={i === 0 ? 5 : 3}
          strokeLinecap="round"
          opacity={i === 0 ? 0.95 : 0.6}
          strokeDasharray={`${length}`}
          strokeDashoffset={drawOn(frame, at + i * 2, frames) * length}
        />
      ))}
    </svg>
  );
};
