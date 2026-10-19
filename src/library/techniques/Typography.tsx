import type React from "react";
import { useId } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { calligraphy } from "../engine/fonts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Words appear one at a time: a fade, a small rise and a blur that clears.
 * `at` is the first word's frame; `gap` the frames between words (or pass `times`).
 */
export const WordBuild: React.FC<{
  readonly text: string;
  readonly at: number;
  readonly gap?: number;
  readonly times?: readonly number[];
  readonly style?: React.CSSProperties;
  readonly wordStyle?: (index: number) => React.CSSProperties | undefined;
}> = ({ text, at, gap = 4, times, style, wordStyle }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", whiteSpace: "nowrap", ...style }}>
      {words.map((w, i) => {
        const t = times?.[i] ?? at + i * gap;
        const p = interpolate(frame, [t, t + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.25em",
              opacity: p,
              translate: `0px ${(1 - p) * 18}px`,
              filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
              ...wordStyle?.(i),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Kinetic slam: the block crashes in from 2.2x with motion blur, then a marker bar strikes across
 * the first line. Put the impact word in `top` and the soft word in `bottom`.
 */
export const KineticSlam: React.FC<{
  readonly at: number;
  readonly top: React.ReactNode;
  readonly bottom?: React.ReactNode;
  readonly barColor?: string;
  readonly style?: React.CSSProperties;
}> = ({ at, top, bottom, barColor = "#c8102e", style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
  const bar = interpolate(frame, [at + 7, at + 13], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        textAlign: "center",
        scale: String(2.2 - 1.2 * p),
        opacity: Math.min(1, p * 3),
        filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
        ...style,
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            position: "absolute",
            left: "-6%",
            top: "52%",
            height: "26%",
            width: "112%",
            backgroundColor: barColor,
            transformOrigin: "0% 50%",
            scale: `${bar} 1`,
          }}
        />
        <div style={{ position: "relative" }}>{top}</div>
      </div>
      {bottom ? <div>{bottom}</div> : null}
    </div>
  );
};

/** One glowing calligraphy word (use once per video, for the "magic" moment). */
export const GlowWord: React.FC<{
  readonly at: number;
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ at, children, color = "#b9f227", size = 210, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 120 } });
  const flicker = frame - at < 10 ? 0.75 + 0.25 * Math.sin(frame * 2.3) : 1;
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: calligraphy,
        fontSize: size,
        lineHeight: 1,
        color,
        opacity: frame >= at ? s * flicker : 0,
        scale: String(0.85 + 0.15 * s),
        textShadow: `0 0 18px ${color}, 0 0 46px ${color}99, 0 0 90px ${color}55`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Neon handwriting: the outline draws on stroke by stroke, then glows and fills softly. */
export const NeonWrite: React.FC<{
  readonly at: number;
  readonly text: string;
  readonly frames?: number;
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly width: number;
  readonly height: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({ at, text, frames = 24, fontFamily, fontSize, width, height, color = "#ffffff", style }) => {
  const frame = useCurrentFrame();
  const id = `neon-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const draw = interpolate(frame, [at, at + frames], [1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const fill = interpolate(frame, [at + frames - 4, at + frames + 8], [0, 0.18], clamp);
  if (frame < at) return null;
  return (
    <svg width={width} height={height} style={{ position: "absolute", overflow: "visible", ...style }}>
      <defs>
        <filter id={id} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fill={color}
        fillOpacity={fill}
        stroke={color}
        strokeWidth={2.4}
        strokeDasharray={1400}
        strokeDashoffset={draw * 1400}
        filter={`url(#${id})`}
      >
        {text}
      </text>
    </svg>
  );
};

/** A giant word standing on a glossy floor: a mirrored copy fades and blurs below it. */
export const ReflectedWord: React.FC<{
  readonly at: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 140 } });
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", textAlign: "center", ...style }}>
      <div style={{ translate: `0px ${(1 - s) * 120}px`, opacity: s }}>{children}</div>
      <div
        style={{
          scale: "1 -1",
          opacity: 0.32 * s,
          filter: "blur(2.5px)",
          marginTop: -8,
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)",
          translate: `0px ${-(1 - s) * 120}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Tilt the children in 3D perspective between two poses over `frames`.
 * Rotations are degrees: [rotateX, rotateY].
 */
export const Tilt3D: React.FC<{
  readonly at: number;
  readonly frames?: number;
  readonly from?: readonly [number, number];
  readonly to?: readonly [number, number];
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ at, frames = 20, from = [0, 0], to = [18, -28], children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + frames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1400, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${from[0] + (to[0] - from[0]) * p}deg) rotateY(${from[1] + (to[1] - from[1]) * p}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
