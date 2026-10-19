import type React from "react";
import { Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { grotesk, hand, rounded } from "../engine/fonts";
import { EDITORIAL } from "../looks/EditorialPoster";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type CaptionStyle = "lead" | "key" | "script" | "small";

export type CaptionSegment = {
  readonly text: string;
  readonly style: CaptionStyle;
  /** Frame the first word appears (match it to when the word is spoken). */
  readonly at: number;
  /** Frames between words; default spreads ~2.6 words per second. */
  readonly gap?: number;
};

/**
 * Time a spoken line's caption parts without word timestamps: words are spread over the line's
 * duration in proportion to their length, which tracks natural speech closely enough to read as
 * in sync. Returns segments ready for `WordReveal`.
 */
export const timeSegments = (
  startFrame: number,
  durationFrames: number,
  parts: readonly { readonly text: string; readonly style: CaptionStyle }[],
): CaptionSegment[] => {
  const words = parts.flatMap((p) => p.text.split(" "));
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const times = weights.map((w) => {
    const t = startFrame + Math.round((acc / total) * durationFrames);
    acc += w;
    return t;
  });
  let k = 0;
  return parts.map((p) => {
    const n = p.text.split(" ").length;
    const first = times[k];
    const last = times[k + n - 1];
    k += n;
    return { text: p.text, style: p.style, at: first, gap: n > 1 ? Math.max(1, Math.round((last - first) / (n - 1))) : 4 };
  });
};

const SEGMENT_STYLE: Record<CaptionStyle, React.CSSProperties> = {
  lead: { fontFamily: rounded, fontWeight: 600, fontSize: 52, color: EDITORIAL.ink, letterSpacing: -0.5 },
  key: { fontFamily: rounded, fontWeight: 900, fontSize: 118, color: EDITORIAL.orange, lineHeight: 0.98, letterSpacing: -2 },
  script: { fontFamily: hand, fontWeight: 500, fontSize: 76, color: EDITORIAL.ink, lineHeight: 0.9 },
  small: { fontFamily: grotesk, fontWeight: 500, fontSize: 30, color: EDITORIAL.ink, opacity: 0.8 },
};

/**
 * Voice-synced captions: each line is a segment in one of four voices (lead, key, script, small),
 * and every word appears when it is spoken. Key words pop with a small overshoot.
 */
export const WordReveal: React.FC<{
  readonly segments: readonly CaptionSegment[];
  readonly align?: "left" | "center" | "right";
  readonly dark?: boolean;
  readonly style?: React.CSSProperties;
}> = ({ segments, align = "center", dark = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", textAlign: align, ...style }}>
      {segments.map((seg, s) => {
        const gap = seg.gap ?? Math.round(fps / 2.6);
        const base = { ...SEGMENT_STYLE[seg.style] };
        if (dark && seg.style !== "key") base.color = "#f2f2f2";
        return (
          <div key={s} style={{ ...base, whiteSpace: "nowrap" }}>
            {seg.text.split(" ").map((w, i) => {
              const t = seg.at + i * gap;
              const p =
                seg.style === "key"
                  ? spring({ frame: frame - t, fps, config: { damping: 11, stiffness: 180 } })
                  : interpolate(frame, [t, t + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    marginRight: "0.22em",
                    opacity: frame >= t ? Math.min(1, p * 1.5) : 0,
                    translate: `0px ${(1 - Math.min(1, p)) * 22}px`,
                    scale: seg.style === "key" ? String(0.8 + 0.2 * p) : undefined,
                    filter: p < 0.95 ? `blur(${(1 - Math.min(1, p)) * 5}px)` : undefined,
                    textShadow: seg.style === "key" && dark ? "0 0 30px rgba(255,90,31,0.6)" : undefined,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Design-tool selection: a dashed bounding box draws on, then its corner handles pop. */
export const SelectionBox: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly color?: string;
}> = ({ at, x, y, width, height, color = EDITORIAL.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const handles = spring({ frame: frame - at - 10, fps, config: { damping: 12, stiffness: 200 } });
  const perimeter = 2 * (width + height);
  if (frame < at) return null;
  const corners = [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
    [width / 2, 0],
    [width / 2, height],
  ];
  return (
    <svg width={width + 40} height={height + 40} style={{ position: "absolute", left: x - 20, top: y - 20, overflow: "visible" }}>
      <rect
        x={20}
        y={20}
        width={width}
        height={height}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={`10 8`}
        pathLength={perimeter}
        style={{ strokeDashoffset: (1 - draw) * perimeter }}
        opacity={0.75}
      />
      {corners.map(([cx, cy], i) => (
        <rect
          key={i}
          x={20 + cx - 9}
          y={20 + cy - 9}
          width={18}
          height={18}
          fill="#ffffff"
          stroke={color}
          strokeWidth={2}
          style={{ transformOrigin: `${20 + cx}px ${20 + cy}px`, scale: String(handles) }}
        />
      ))}
    </svg>
  );
};

/**
 * Hero cut-out: one big subject that never sits still (slow push, gentle drift), grounded by a
 * long soft shadow and, optionally, a mist of clouds around its base.
 */
export const HeroCutout: React.FC<{
  readonly src: string;
  readonly at?: number;
  readonly height: number;
  readonly left: number;
  readonly bottom: number;
  readonly cloud?: boolean;
  readonly gray?: boolean;
  readonly duration?: number;
  readonly style?: React.CSSProperties;
}> = ({ src, at = 0, height, left, bottom, cloud = true, gray = false, duration = 150, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 120 } });
  const push = interpolate(frame, [at, at + duration], [1, 1.06], clamp);
  const drift = interpolate(frame, [at, at + duration], [0, -18], clamp);
  return (
    <div style={{ position: "absolute", left, bottom, height, ...style }}>
      <Img
        src={staticFile(src)}
        style={{
          height,
          transformOrigin: "50% 100%",
          scale: String(push * (0.94 + 0.06 * enter)),
          translate: `0px ${drift + (1 - enter) * 60}px`,
          opacity: enter,
          filter: `${gray ? "grayscale(1) contrast(1.15) " : ""}drop-shadow(-30px 40px 40px rgba(60,35,10,0.28))`,
        }}
      />
      {cloud ? (
        <Img
          src={staticFile("library/objects/clouds.png")}
          style={{
            position: "absolute",
            left: "-30%",
            bottom: -height * 0.06,
            width: "160%",
            opacity: 0.95 * enter,
            translate: `${interpolate(frame, [at, at + duration], [0, -40], clamp)}px 0px`,
            // Feather every edge so the cloud photo's border never shows.
            WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 55%, black 55%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 50% 50% at 50% 55%, black 55%, transparent 100%)",
          }}
        />
      ) : null}
    </div>
  );
};

const LANE_COLORS = ["#4f7cff", "#ff5a8a", "#2ec4b6", "#ffbe0b", "#8a5cff"];

/**
 * Timeline stream: editing-layer clips (coloured bars) slide out of a point and keep flowing,
 * like an NLE timeline spilling out of the subject.
 */
export const TimelineStream: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly lanes?: number;
  readonly width?: number;
  readonly style?: React.CSSProperties;
}> = ({ at, x, y, lanes = 5, width = 760, style }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  return (
    <div style={{ position: "absolute", left: x - width, top: y, width, ...style }}>
      {Array.from({ length: lanes }, (_, lane) => {
        const reveal = interpolate(t, [lane * 2, lane * 2 + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const flow = (t * (3 + lane * 0.6)) % 220;
        return (
          <div
            key={lane}
            style={{
              position: "relative",
              height: 30,
              marginBottom: 8,
              overflow: "hidden",
              clipPath: `inset(0 0 0 ${(1 - reveal) * 100}%)`,
            }}
          >
            {Array.from({ length: 8 }, (_, k) => {
              const w = 70 + random(`clip-${lane}-${k}`) * 150;
              const left = width - (k * 200 + flow);
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left,
                    top: 0,
                    width: w,
                    height: 30,
                    borderRadius: 5,
                    backgroundColor: LANE_COLORS[(lane + k) % LANE_COLORS.length],
                    opacity: 0.88,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Phone mock-up holding an image (or any node), tilted on a sheet of grid paper. */
export const PhoneMockup: React.FC<{
  readonly at: number;
  readonly src?: string;
  readonly children?: React.ReactNode;
  readonly width?: number;
  readonly tilt?: number;
  readonly style?: React.CSSProperties;
}> = ({ at, src, children, width = 400, tilt = -4, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 120 } });
  const push = interpolate(frame, [at, at + 150], [1, 1.07], clamp);
  const h = width * 2.05;
  return (
    <div style={{ position: "absolute", width: width + 260, height: h + 220, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.55)",
          backgroundImage:
            "linear-gradient(rgba(20,20,20,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,20,0.13) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          rotate: `${tilt * 1.6}deg`,
          scale: String(0.9 + 0.1 * enter),
          opacity: enter,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 110,
          width,
          height: h,
          borderRadius: width * 0.13,
          backgroundColor: "#0c0c0c",
          padding: width * 0.035,
          boxSizing: "border-box",
          boxShadow: "-30px 40px 50px rgba(0,0,0,0.3)",
          rotate: `${tilt}deg`,
          scale: String(push * (0.85 + 0.15 * enter)),
          opacity: enter,
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: width * 0.1, overflow: "hidden", position: "relative", backgroundColor: "#222" }}>
          {src ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : children}
          <div
            style={{
              position: "absolute",
              top: width * 0.03,
              left: "50%",
              translate: "-50% 0",
              width: width * 0.28,
              height: width * 0.07,
              borderRadius: 99,
              backgroundColor: "#000",
            }}
          />
        </div>
      </div>
    </div>
  );
};

/** Call-to-action end card: a glowing gradient keyword on black with a purple floor glow. */
export const CtaCard: React.FC<{
  readonly at: number;
  readonly lead: string;
  readonly keyword: string;
}> = ({ at, lead, keyword }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = interpolate(frame, [at, at + 20], [0, 1], clamp);
  const pop = spring({ frame: frame - at - 6, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#000" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 30% at 50% 100%, rgba(120,60,255,0.7) 0%, rgba(60,20,160,0.25) 45%, rgba(0,0,0,0) 75%)",
          opacity: glow,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: rounded,
          fontWeight: 800,
          fontSize: 120,
          letterSpacing: -2,
          opacity: frame >= at ? 1 : 0,
          scale: String(0.85 + 0.15 * pop),
        }}
      >
        <span style={{ color: "#c9b8ff", opacity: Math.min(1, pop * 2) }}>{lead} </span>
        <span
          style={{
            opacity: Math.min(1, Math.max(0, pop * 2 - 0.4)),
            background: "linear-gradient(90deg, #8a5cff, #d36bff 50%, #ff7ad9)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: `drop-shadow(0 0 24px rgba(160,90,255,${0.8 * glow}))`,
          }}
        >
          “{keyword}”
        </span>
      </div>
    </div>
  );
};
