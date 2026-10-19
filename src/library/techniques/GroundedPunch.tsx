import type React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { boil } from "../engine/motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type PunchRig = {
  /** Background plate in public/. */
  readonly background: string;
  readonly backgroundFilter?: string;
  /** Full-body cut-out in public/ and its pixel size. */
  readonly character: string;
  readonly characterSize: { readonly width: number; readonly height: number };
  /** Character height on screen before the punch. */
  readonly height: number;
  /** Ground point under the character's feet. Everything scales around it. */
  readonly feet: { readonly x: number; readonly y: number };
  /** Background push: 1 -> bgZoom over frames 8..80. */
  readonly bgZoom: number;
  /** Character punch: 1 -> punchScale by punchEnd. */
  readonly punchScale: number;
  readonly punchEnd: number;
  readonly shadowSkew: number;
  readonly shadowOpacity: number;
  /** Optional sideways move with a motion-blur streak. */
  readonly shift?: { readonly at: number; readonly by: number };
};

/**
 * Two flat plates sold as depth: the background pushes in gently while the character punches
 * in harder, both anchored to the same ground point. The cast shadow is the same cut-out,
 * painted black, squashed flat and skewed back along the ground behind them.
 */
export const GroundedPunch: React.FC<{ readonly rig: PunchRig; readonly children?: React.ReactNode }> = ({
  rig,
  children,
}) => {
  const frame = useCurrentFrame();
  const width = (rig.height * rig.characterSize.width) / rig.characterSize.height;
  const punch = interpolate(frame, [0, rig.punchEnd], [1, rig.punchScale], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const drift = interpolate(frame, [0, rig.punchEnd], [0, 40], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shiftAt = rig.shift?.at ?? 0;
  const shiftBy = rig.shift?.by ?? 0;
  const shift = rig.shift
    ? interpolate(frame, [shiftAt, shiftAt + 10], [0, shiftBy], { ...clamp, easing: Easing.inOut(Easing.cubic) })
    : 0;
  const streak = rig.shift ? interpolate(frame, [shiftAt, shiftAt + 5, shiftAt + 10], [0, 1, 0], clamp) : 0;
  const life = boil(frame, { period: 150, breathe: 0.004, sway: 0.4 });

  const figure = (filter: string) => (
    <Img
      src={staticFile(rig.character)}
      style={{ position: "absolute", left: 0, top: 0, width, height: rig.height, filter }}
    />
  );

  return (
    <>
      <Img
        src={staticFile(rig.background)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: `${rig.feet.x}px ${rig.feet.y}px`,
          scale: String(
            interpolate(frame, [8, 80], [1, rig.bgZoom], { ...clamp, easing: Easing.out(Easing.cubic) }),
          ),
          filter: rig.backgroundFilter,
        }}
      />
      {/* Character group: positioned with its feet on the ground point. */}
      <div
        style={{
          position: "absolute",
          left: rig.feet.x - width / 2,
          top: rig.feet.y - rig.height,
          width,
          height: rig.height,
          transformOrigin: "50% 100%",
          translate: `${shift}px ${drift}px`,
          scale: String(punch),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 100%",
            transform: `scaleY(0.36) skewX(${rig.shadowSkew}deg)`,
            opacity: rig.shadowOpacity,
          }}
        >
          {figure("brightness(0) blur(7px)")}
        </div>
        {streak > 0 ? (
          <div style={{ position: "absolute", inset: 0, translate: `${-shiftBy * 0.25}px 0px`, opacity: streak * 0.45 }}>
            {figure("blur(18px)")}
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 100%",
            scale: String(life.scale),
            rotate: `${life.rotate}deg`,
            filter: streak > 0 ? `blur(${streak * 6}px)` : undefined,
          }}
        >
          {figure("drop-shadow(0 0 30px rgba(0,0,0,0.35))")}
        </div>
      </div>
      {children}
    </>
  );
};
