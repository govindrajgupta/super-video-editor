import type React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PAPER, tileShadow } from "../looks/PaperStudio";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Orbit rings: a disc holds the hero object; two rings draw on around it and dots orbit.
 * Centre it with `style` (left/top are the disc's centre).
 */
export const OrbitRings: React.FC<{
  readonly at: number;
  readonly size?: number;
  readonly disc?: string;
  readonly ink?: string;
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ at, size = 330, disc = PAPER.green, ink = PAPER.ink, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 140 } });
  const t = frame - at;
  const rings = [
    { r: size * 1.0, speed: 0.022, dots: 2, delay: 3 },
    { r: size * 1.45, speed: -0.014, dots: 2, delay: 7 },
  ];
  return (
    <div style={{ position: "absolute", width: 0, height: 0, ...style }}>
      {rings.map((ring, i) => {
        const draw = interpolate(t, [ring.delay, ring.delay + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const c = 2 * Math.PI * ring.r;
        return (
          <svg
            key={i}
            width={ring.r * 2 + 40}
            height={ring.r * 2 + 40}
            style={{ position: "absolute", left: -ring.r - 20, top: -ring.r - 20, overflow: "visible" }}
          >
            <circle
              cx={ring.r + 20}
              cy={ring.r + 20}
              r={ring.r}
              fill="none"
              stroke={ink}
              strokeWidth={2}
              strokeOpacity={0.55}
              strokeDasharray={c}
              strokeDashoffset={c * (1 - draw)}
            />
            {Array.from({ length: ring.dots }, (_, d) => {
              const a = (t * ring.speed + d * Math.PI + i * 0.8) * 1;
              return (
                <circle
                  key={d}
                  cx={ring.r + 20 + Math.cos(a) * ring.r}
                  cy={ring.r + 20 + Math.sin(a) * ring.r}
                  r={11}
                  fill={ink}
                  opacity={draw}
                />
              );
            })}
          </svg>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: disc,
          scale: String(pop),
          boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -size * 0.6,
          top: -size * 0.6,
          width: size * 1.2,
          height: size * 1.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: String(interpolate(pop, [0, 1], [0.4, 1])),
          opacity: Math.min(1, pop * 2),
          rotate: `${interpolate(t, [0, 90], [-6, 4], clamp)}deg`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export type Tile = { readonly src: string; readonly label?: React.ReactNode };

/** Rounded 3D tiles pop in one after another, each holding a product cut-out and a label. */
export const TileGrid: React.FC<{
  readonly at: number;
  readonly items: readonly Tile[];
  readonly cols?: number;
  readonly tile?: number;
  readonly gap?: number;
  readonly stagger?: number;
  readonly color?: string;
  readonly labelStyle?: React.CSSProperties;
  readonly style?: React.CSSProperties;
}> = ({ at, items, cols = 2, tile = 330, gap = 44, stagger = 3, color = PAPER.green, labelStyle, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${tile}px)`,
        gap,
        ...style,
      }}
    >
      {items.map((item, i) => {
        const s = spring({ frame: frame - at - i * stagger, fps, config: { damping: 11, stiffness: 150 } });
        return (
          <div
            key={i}
            style={{
              width: tile,
              height: tile,
              borderRadius: tile * 0.1,
              backgroundColor: color,
              boxShadow: tileShadow(14),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              scale: String(s),
              rotate: `${(1 - s) * (i % 2 ? 12 : -12)}deg`,
              opacity: frame >= at + i * stagger ? 1 : 0,
            }}
          >
            <Img
              src={staticFile(item.src)}
              style={{ width: tile * 0.72, height: tile * 0.56, objectFit: "contain", filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.35))" }}
            />
            {item.label ? <div style={{ ...labelStyle }}>{item.label}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Pop-out card: a 3D tile slides in, then an object breaks out past its edge with an overshoot.
 * `object` is positioned relative to the card's top-left corner.
 */
export const PopOutCard: React.FC<{
  readonly at: number;
  readonly width?: number;
  readonly height?: number;
  readonly color?: string;
  readonly object: { readonly src: string; readonly left: number; readonly top: number; readonly width: number };
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ at, width = 520, height = 520, color = PAPER.green, object, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 110 } });
  const pop = spring({ frame: frame - at - 8, fps, config: { damping: 9, stiffness: 160 } });
  const drift = interpolate(frame, [at, at + 90], [0, -24], clamp);
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        translate: `${(1 - slide) * -500 + drift}px ${(1 - slide) * 700}px`,
        rotate: `${(1 - slide) * -14}deg`,
        opacity: frame >= at ? 1 : 0,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          backgroundColor: color,
          boxShadow: tileShadow(16),
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "0 34px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
      <Img
        src={staticFile(object.src)}
        style={{
          position: "absolute",
          left: object.left,
          top: object.top,
          width: object.width,
          scale: String(pop),
          rotate: `${(1 - pop) * -30}deg`,
          filter: "drop-shadow(18px 26px 22px rgba(0,0,0,0.35))",
        }}
      />
    </div>
  );
};

/**
 * Portal window: a dark box cut into the wall, with perspective walls, showing a scene inside.
 * The opening scales up from the wall; the inner content gets a slow push.
 */
export const PortalWindow: React.FC<{
  readonly at: number;
  readonly width?: number;
  readonly height?: number;
  readonly depth?: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ at, width = 560, height = 820, depth = 70, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 120 } });
  const push = interpolate(frame, [at, at + 150], [1.08, 1.0], clamp);
  const d = depth;
  return (
    <div style={{ position: "absolute", width, height, scale: String(0.6 + 0.4 * open), opacity: open, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#050505",
          boxShadow: "-40px 50px 70px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: d, overflow: "hidden", scale: String(push) }}>{children}</div>
        {/* inner walls: left lit, top shaded, bottom darker, right darkest */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #2b2b2b, #0b0b0b)", clipPath: `polygon(0 0, ${d}px ${d}px, ${d}px calc(100% - ${d}px), 0 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #1a1a1a, #070707)", clipPath: `polygon(0 0, 100% 0, calc(100% - ${d}px) ${d}px, ${d}px ${d}px)` }} />
        <div style={{ position: "absolute", inset: 0, background: "#020202", clipPath: `polygon(100% 0, 100% 100%, calc(100% - ${d}px) calc(100% - ${d}px), calc(100% - ${d}px) ${d}px)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, #161616, #050505)", clipPath: `polygon(0 100%, ${d}px calc(100% - ${d}px), calc(100% - ${d}px) calc(100% - ${d}px), 100% 100%)` }} />
      </div>
    </div>
  );
};

/**
 * Drop-in: an object falls onto the floor, lands with a small bounce, and its contact shadow
 * tightens and darkens as it gets close. `floorY` is where its base rests.
 */
export const DropIn: React.FC<{
  readonly at: number;
  readonly src: string;
  readonly width: number;
  readonly left: number;
  readonly floorY: number;
  readonly from?: number;
  readonly style?: React.CSSProperties;
}> = ({ at, src, width, left, floorY, from = 1100, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fall = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 170, mass: 0.9 } });
  const lift = (1 - fall) * from;
  const near = Math.max(0, 1 - lift / 600);
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left, top: 0, bottom: 0, width, ...style }}>
      <div
        style={{
          position: "absolute",
          left: width * 0.1,
          top: floorY - 30,
          width: width * 0.8,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
          opacity: 0.25 + 0.75 * near,
          scale: String(1.6 - 0.6 * near),
        }}
      />
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: 0,
          width,
          bottom: `calc(100% - ${floorY}px)`,
          top: "auto",
          translate: `0px ${-lift}px`,
          filter: "drop-shadow(0 20px 18px rgba(0,0,0,0.25))",
        }}
      />
    </div>
  );
};
