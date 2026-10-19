import type React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { grotesk } from "../engine/fonts";
import { stepIndex } from "../engine/motion";

/** Palette of the editorial-poster look (lesson 03). */
export const EDITORIAL = {
  cream: "#f6e8d4",
  ink: "#141414",
  orange: "#ff5a1f",
  muted: "#8d8275",
  line: "rgba(20,20,20,0.12)",
} as const;

/** A barcode drawn from seeded random bar widths. */
export const Barcode: React.FC<{
  readonly seed?: string;
  readonly width?: number;
  readonly height?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({ seed = "bc", width = 170, height = 46, color = EDITORIAL.ink, style }) => {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; x < width; i++) {
    const w = 1 + Math.floor(random(`${seed}-w-${i}`) * 4);
    if (random(`${seed}-on-${i}`) > 0.35) bars.push({ x, w });
    x += w + 1;
  }
  return (
    <svg width={width} height={height} style={{ position: "absolute", ...style }}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill={color} />
      ))}
    </svg>
  );
};

/** Crosshair-in-circle registration mark, as on printers' proofs. */
export const RegistrationMark: React.FC<{ readonly size?: number; readonly style?: React.CSSProperties }> = ({
  size = 34,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 34 34" style={{ position: "absolute", ...style }}>
    <circle cx={17} cy={17} r={9} fill="none" stroke={EDITORIAL.ink} strokeWidth={1.2} opacity={0.55} />
    <path d="M17 1 V33 M1 17 H33" stroke={EDITORIAL.ink} strokeWidth={1.2} opacity={0.55} />
  </svg>
);

/** Four-point sparkle star. */
export const Sparkle: React.FC<{ readonly size?: number; readonly color?: string; readonly style?: React.CSSProperties }> = ({
  size = 30,
  color = EDITORIAL.ink,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 30 30" style={{ position: "absolute", ...style }}>
    <path d="M15 0 C16 11 19 14 30 15 C19 16 16 19 15 30 C14 19 11 16 0 15 C11 14 14 11 15 0 Z" fill={color} />
  </svg>
);

/** A few lines of tiny body copy, the kind found in a poster's corner. */
export const SmallPrint: React.FC<{
  readonly children: React.ReactNode;
  readonly width?: number;
  readonly align?: "left" | "center" | "right";
  readonly style?: React.CSSProperties;
}> = ({ children, width = 420, align = "left", style }) => (
  <div
    style={{
      position: "absolute",
      width,
      fontFamily: grotesk,
      fontWeight: 500,
      fontSize: 19,
      lineHeight: 1.35,
      color: EDITORIAL.ink,
      opacity: 0.78,
      textAlign: align,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * The quiet layout furniture that makes a frame read as a printed poster: grid lines, registration
 * marks, measurement ticks, sparkles, a barcode and a folio line in the corners.
 */
export const EditorialFurniture: React.FC<{
  readonly folio?: readonly [string, string];
  readonly dark?: boolean;
  readonly seed?: string;
}> = ({ folio = ["SUPER VIDEO EDITOR", "VOL. 01"], dark = false, seed = "furniture" }) => {
  const line = dark ? "rgba(255,255,255,0.10)" : EDITORIAL.line;
  const text = dark ? "rgba(255,255,255,0.55)" : "rgba(20,20,20,0.6)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[120, 960].map((x) => (
        <div key={`v${x}`} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: 1, backgroundColor: line }} />
      ))}
      {[150, 1770].map((y) => (
        <div key={`h${y}`} style={{ position: "absolute", top: y, left: 0, right: 0, height: 1, backgroundColor: line }} />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <div
          key={`t${i}`}
          style={{ position: "absolute", left: 40, top: 360 + i * 90, width: i % 4 === 0 ? 22 : 12, height: 1, backgroundColor: text }}
        />
      ))}
      <RegistrationMark style={{ left: 103, top: 133 }} />
      <RegistrationMark style={{ left: 943, top: 1753 }} />
      {dark ? null : <Sparkle size={34} style={{ left: 900, top: 230 }} />}
      {dark ? null : <Sparkle size={18} style={{ left: 170, top: 1640 }} />}
      {dark ? null : <Barcode seed={seed} style={{ left: 60, top: 1800 }} />}
      <div
        style={{
          position: "absolute",
          top: 104,
          left: 150,
          right: 150,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: grotesk,
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: 2,
          color: text,
        }}
      >
        <span>{folio[0]}</span>
        <span>{folio[1]}</span>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Warm cream poster paper with a faint paper grain and soft vignette; furniture on top.
 * `dark` gives the black-and-white chapter: black paper, grid and a white back glow.
 */
export const EditorialPosterLook: React.FC<{
  readonly children: React.ReactNode;
  readonly dark?: boolean;
  readonly furniture?: boolean;
  readonly folio?: readonly [string, string];
  readonly seed?: string;
}> = ({ children, dark = false, furniture = true, folio, seed }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const step = stepIndex(frame, fps);
  return (
    <AbsoluteFill style={{ backgroundColor: dark ? "#050505" : EDITORIAL.cream, overflow: "hidden" }}>
      {dark ? (
        <>
          <AbsoluteFill
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "120px 120px",
            }}
          />
          <AbsoluteFill
            style={{
              background: "radial-gradient(ellipse 45% 30% at 50% 40%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
        </>
      ) : (
        <>
          <Img
            src={staticFile("library/surfaces/paper-wall.jpg")}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.12 }}
          />
          <AbsoluteFill
            style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.35) 0%, rgba(0,0,0,0) 55%, rgba(80,50,20,0.12) 100%)" }}
          />
        </>
      )}
      {furniture ? <EditorialFurniture folio={folio} dark={dark} seed={seed} /> : null}
      <AbsoluteFill>{children}</AbsoluteFill>
      <Img
        src={staticFile("library/textures/grain.jpg")}
        style={{
          position: "absolute",
          left: -Math.floor(random(`eg-x-${step}`) * 200),
          top: -Math.floor(random(`eg-y-${step}`) * 200),
          width: width + 200,
          height: height + 200,
          mixBlendMode: "overlay",
          opacity: dark ? 0.35 : 0.18,
        }}
      />
    </AbsoluteFill>
  );
};
