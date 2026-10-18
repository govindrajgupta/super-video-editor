import type React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";

const BAR = "#b1060f";
const DIAGONAL = "#e50914";

/**
 * A "ta-dum" style ident: the N's three ribbons grow, glow, then the camera dives into the
 * diagonal and it breaks into light streaks. Starts at `at`.
 */
export const NetflixIdent: React.FC<{ readonly at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const grow = (start: number) =>
    interpolate(t, [start, start + 7], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  const dive = interpolate(t, [26, 44], [1, 9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.9, 0.4),
  });
  const streaks = interpolate(t, [32, 40, 60], [0, 1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = interpolate(t, [12, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = 300;
  const h = 540;
  const bar = 92;

  if (t < 0) {
    return null;
  }

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 540 - w / 2,
          top: 960 - h / 2,
          width: w,
          height: h,
          scale: String(dive),
          transformOrigin: "52% 50%",
          filter: `drop-shadow(0 0 ${glow * 40}px rgba(229,9,20,0.75))`,
          opacity: interpolate(t, [36, 46], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ position: "absolute", left: 0, bottom: 0, width: bar, height: h * grow(0), backgroundColor: BAR }} />
        <div style={{ position: "absolute", right: 0, top: 0, width: bar, height: h * grow(6), backgroundColor: BAR }} />
        {/* The diagonal runs from the top of the left bar to the foot of the right bar. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: DIAGONAL,
            clipPath: `polygon(0px 0px, ${bar}px 0px, ${bar + (w - bar) * grow(3)}px ${h * grow(3)}px, ${(w - bar) * grow(3)}px ${h * grow(3)}px)`,
            filter: "drop-shadow(0 0 18px rgba(0,0,0,0.8))",
          }}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: streaks }}>
        {Array.from({ length: 70 }, (_, i) => {
          const hue = random(`hue-${i}`);
          const color =
            hue < 0.55 ? "#e50914" : hue < 0.75 ? "#ff5d8f" : hue < 0.88 ? "#5b7cff" : "#ffd36b";
          const x = random(`x-${i}`) * 1080;
          const spread = interpolate(t, [32, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 540 + (x - 540) * (0.2 + spread * 1.2),
                top: 0,
                width: 2 + random(`w-${i}`) * 14,
                height: 1920,
                backgroundColor: color,
                opacity: 0.35 + random(`o-${i}`) * 0.6,
                filter: "blur(1.5px)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
