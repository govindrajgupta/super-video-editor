import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { serif } from "../engine/fonts";

/** Serif-italic documentary caption that pops in at `at` and optionally fades from `fadeAt`. */
export const Caption: React.FC<{
  readonly children: React.ReactNode;
  readonly at: number;
  readonly fadeAt?: number;
  readonly fadeTo?: number;
  readonly size?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({ children, at, fadeAt, fadeTo = 0, size = 120, color = "#f4efe4", style }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [at, at + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const fade =
    fadeAt === undefined
      ? 1
      : interpolate(frame, [fadeAt, fadeAt + 6], [1, fadeTo], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <div
      style={{
        position: "absolute",
        fontFamily: serif,
        fontStyle: "italic",
        fontSize: size,
        lineHeight: 0.95,
        color,
        textShadow: "0 4px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.6)",
        whiteSpace: "pre",
        opacity: appear * fade,
        scale: String(interpolate(appear, [0, 1], [1.12, 1])),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
