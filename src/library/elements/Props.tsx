import type React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { display, heavy } from "../engine/fonts";

/** Marigold caption box that pops in at `at`. */
export const CaptionBox: React.FC<{
  readonly children: React.ReactNode;
  readonly at: number;
  readonly style?: React.CSSProperties;
}> = ({ children, at, style }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [at, at + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  return (
    <div
      style={{
        position: "absolute",
        padding: "10px 26px 14px",
        backgroundColor: "#f2b705",
        color: "#14100a",
        fontFamily: heavy,
        fontSize: 78,
        textTransform: "lowercase",
        lineHeight: 1,
        boxShadow: "6px 8px 0 rgba(0,0,0,0.45)",
        opacity: pop > 0 ? 1 : 0,
        scale: String(pop),
        rotate: "-3deg",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const REEL = ["$1 BILLION", "TRILLION", "5 MILLION", "$500K", "DOLLARS", "100 MILLION", "1 BILLION", "50 MILLION"];

/** Slot-machine counter that spins through values and slams onto the last one. */
export const SlotCounter: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly style?: React.CSSProperties;
}> = ({ from, to, style }) => {
  const frame = useCurrentFrame();
  const rowH = 190;
  const loops = 2;
  const items = [...Array.from({ length: loops }, () => REEL).flat()];
  const target = items.length - 1;
  const pos = interpolate(frame, [from, to], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.7, 0.25, 1.06),
  });
  const landed = frame >= to;
  const slam = interpolate(frame, [to, to + 4], [1.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        width: 900,
        height: rowH,
        overflow: "hidden",
        opacity: frame >= from ? 1 : 0,
        scale: String(landed ? slam : 1),
        ...style,
      }}
    >
      <div style={{ translate: `0px ${-pos * rowH}px` }}>
        {items.map((v, i) => (
          <div
            key={i}
            style={{
              height: rowH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: display,
              fontSize: 176,
              color: "#fff6e6",
              textShadow: "0 6px 0 rgba(90,0,0,0.6), 0 0 40px rgba(0,0,0,0.5)",
              filter: landed ? undefined : `blur(${Math.min(6, Math.abs(pos - Math.round(pos)) * 10 + 2)}px)`,
            }}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Procedural cigar smoke: soft puffs that rise, swell and thin out (screen blend). */
export const Smoke: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly start: number;
  readonly style?: React.CSSProperties;
}> = ({ x, y, start, style }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0) {
    return null;
  }
  const puffs = Array.from({ length: 14 }, (_, i) => {
    const life = 54;
    const born = i * 5;
    const age = ((t - born) % (life * 2) + life * 2) % (life * 2);
    if (t < born || age > life) {
      return null;
    }
    const p = age / life;
    const drift = (random(`smoke-${i}`) - 0.5) * 160;
    const size = 70 + p * 260;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x + drift * p - size / 2 + Math.sin(p * 5 + i) * 24,
          top: y - p * 520 - size / 2,
          width: size,
          height: size * 1.25,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(240,240,240,0.8) 0%, rgba(240,240,240,0) 70%)",
          opacity: Math.sin(Math.PI * p) * 0.95,
          filter: "blur(10px)",
        }}
      />
    );
  });
  return (
    <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", ...style }}>
      {puffs}
    </div>
  );
};

/** Hanging pendant lamp drawn in SVG, with a glow. Swings around its ceiling mount. */
export const PendantLamp: React.FC<{
  readonly angle: number;
  readonly glow: number;
  readonly cord: number;
  readonly style?: React.CSSProperties;
}> = ({ angle, glow, cord, style }) => (
  <div
    style={{
      position: "absolute",
      width: 360,
      height: cord + 260,
      transformOrigin: "180px 0px",
      rotate: `${angle}deg`,
      ...style,
    }}
  >
    <div style={{ position: "absolute", left: 178, top: 0, width: 4, height: cord, backgroundColor: "#111" }} />
    {/* light: white-hot core, warm bloom, mouth glow, big ambient spill */}
    <div
      style={{
        position: "absolute",
        left: 180 - 700,
        top: cord + 120 - 700,
        width: 1400,
        height: 1400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,214,140,0.6) 0%, rgba(255,190,110,0.25) 35%, rgba(255,180,90,0) 70%)",
        opacity: glow,
      }}
    />
    {/* soft funnel of light falling from the shade */}
    <div
      style={{
        position: "absolute",
        left: 180 - 520,
        top: cord + 120,
        width: 1040,
        height: 1300,
        background: "linear-gradient(180deg, rgba(255,220,160,0.45) 0%, rgba(255,210,150,0.12) 55%, rgba(255,210,150,0) 100%)",
        clipPath: "polygon(41% 0%, 59% 0%, 100% 100%, 0% 100%)",
        filter: "blur(24px)",
        opacity: glow,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 180 - 260,
        top: cord + 120 - 260,
        width: 520,
        height: 520,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,252,240,1) 0%, rgba(255,226,160,0.95) 16%, rgba(255,196,110,0.4) 42%, rgba(255,170,80,0) 70%)",
        opacity: glow,
      }}
    />
    <svg width={360} height={200} style={{ position: "absolute", left: 0, top: cord - 20 }}>
      <defs>
        <linearGradient id="shade" x1="0" x2="1">
          <stop offset="0" stopColor="#0d1310" />
          <stop offset="0.45" stopColor="#2f4a3a" />
          <stop offset="1" stopColor="#0a0f0c" />
        </linearGradient>
      </defs>
      <rect x={168} y={0} width={24} height={34} rx={4} fill="#1a1a1a" />
      <path d="M 150 32 L 210 32 L 330 140 Q 180 162 30 140 Z" fill="url(#shade)" />
      <ellipse cx={180} cy={141} rx={150} ry={14} fill="#f7e2b0" opacity={0.35 + glow * 0.6} />
    </svg>
  </div>
);

/** Red foam "no" finger. Pivot is the wrist (bottom centre). */
export const FoamFinger: React.FC<{ readonly style?: React.CSSProperties }> = ({ style }) => (
  <svg width={300} height={460} viewBox="0 0 300 460" style={{ position: "absolute", overflow: "visible", ...style }}>
    <defs>
      <linearGradient id="foam" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#ff4a3d" />
        <stop offset="0.6" stopColor="#d9141c" />
        <stop offset="1" stopColor="#9e0d12" />
      </linearGradient>
    </defs>
    <g stroke="#5c0508" strokeWidth={6} strokeLinejoin="round">
      {/* raised index finger */}
      <path d="M 112 40 Q 112 10 140 10 Q 168 10 168 40 L 168 210 L 112 210 Z" fill="url(#foam)" />
      {/* fist */}
      <path d="M 60 190 Q 60 168 84 168 L 236 168 Q 262 168 262 196 L 262 330 Q 262 372 222 380 L 96 380 Q 56 372 56 330 Z" fill="url(#foam)" />
      <path d="M 168 206 L 168 258 M 208 192 L 208 252 M 112 210 L 112 258" fill="none" />
      {/* thumb across the fist */}
      <path d="M 50 236 Q 40 214 70 206 L 170 232 Q 192 240 182 262 Q 174 280 150 274 L 70 262 Q 52 256 50 236 Z" fill="#e5242a" />
      {/* foam cuff */}
      <path d="M 92 380 L 226 380 L 236 452 L 82 452 Z" fill="#b8121a" />
    </g>
    <text x={159} y={330} textAnchor="middle" fontFamily={heavy} fontSize={46} fill="#fff3e6" stroke="#5c0508" strokeWidth={2}>
      NO.
    </text>
  </svg>
);
