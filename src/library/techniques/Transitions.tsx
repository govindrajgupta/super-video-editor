import type React from "react";
import { useId } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Direction = "up" | "down" | "left" | "right";

const axis = (d: Direction) => (d === "up" || d === "down" ? "y" : "x");
const sign = (d: Direction) => (d === "up" || d === "left" ? -1 : 1);

/** A blur along one axis only (SVG filter), so a whip smears in its direction of travel. */
export const DirectionalBlur: React.FC<{
  readonly amount: number;
  readonly direction: Direction;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ amount, direction, children, style }) => {
  const id = `dblur-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const dev = axis(direction) === "y" ? `0 ${amount}` : `${amount} 0`;
  return (
    <div style={{ position: "absolute", inset: 0, filter: amount > 0.2 ? `url(#${id})` : undefined, ...style }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={dev} />
        </filter>
      </svg>
      {children}
    </div>
  );
};

/**
 * Whip: content arrives with a fast directional smear at `inAt`, and/or leaves the same way at
 * `outAt`. Use the same direction on the outgoing and incoming scene for a continuous whip pan.
 */
export const Whip: React.FC<{
  readonly children: React.ReactNode;
  readonly direction?: Direction;
  readonly inAt?: number;
  readonly outAt?: number;
  readonly frames?: number;
  readonly distance?: number;
  readonly blur?: number;
}> = ({ children, direction = "up", inAt, outAt, frames = 8, distance = 1400, blur = 60 }) => {
  const frame = useCurrentFrame();
  const s = sign(direction);
  let offset = 0;
  let amount = 0;
  let visible = true;
  if (inAt !== undefined) {
    if (frame < inAt) visible = false;
    const p = interpolate(frame, [inAt, inAt + frames], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
    offset += -s * distance * (1 - p);
    amount = Math.max(amount, blur * (1 - p));
  }
  if (outAt !== undefined) {
    if (frame > outAt + frames) visible = false;
    const p = interpolate(frame, [outAt, outAt + frames], [0, 1], { ...clamp, easing: Easing.in(Easing.exp) });
    offset += s * distance * p;
    amount = Math.max(amount, blur * p);
  }
  if (!visible) return null;
  const translate = axis(direction) === "y" ? `0px ${offset}px` : `${offset}px 0px`;
  return (
    <DirectionalBlur amount={amount} direction={direction} style={{ translate }}>
      {children}
    </DirectionalBlur>
  );
};

/**
 * Colour-block wipe: two flat blocks sweep across the frame and leave (red, then green by default).
 * Put it above both scenes and cut underneath at `at + frames / 2`.
 */
export const BlockWipe: React.FC<{
  readonly at: number;
  readonly frames?: number;
  readonly colors?: readonly [string, string];
}> = ({ at, frames = 16, colors = ["#c8102e", "#1f6b52"] }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + frames + 4) return null;
  const sweep = (delay: number) =>
    interpolate(frame, [at + delay, at + delay + frames], [115, -75], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${sweep(0)}%`,
          width: "42%",
          height: "64%",
          backgroundColor: colors[0],
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: `${sweep(3)}%`,
          width: "58%",
          height: "52%",
          backgroundColor: colors[1],
        }}
      />
    </>
  );
};

/** Zoom-out reveal: start deep inside a detail of the shot and pull back to the whole. */
export const ZoomReveal: React.FC<{
  readonly children: React.ReactNode;
  readonly at: number;
  readonly frames?: number;
  readonly from?: number;
  readonly focus?: string;
}> = ({ children, at, frames = 14, from = 4.5, focus = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + frames], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: focus,
        scale: String(from + (1 - from) * p),
        filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};
