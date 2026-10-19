import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HandDiamond } from "../../../library/elements/HandDrawn";
import { CaptionBox, SlotCounter, Smoke } from "../../../library/elements/Props";
import { FilmLook } from "../../../library/looks/FilmLook";
import { boil, isOn } from "../../../library/engine/motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Beats (30fps), lined up with the voiceover.
const LOGO_IN = 4;
const CASH_IN = 16;
const SLOT_FROM = 24;
const SLOT_TO = 52;
const BOSS_UP = 54;
const LAUGHED = 70;
const THEM_OUT = 92;
const NEGATIVE: readonly (readonly [number, number])[] = [
  [112, 114],
  [117, 118],
  [121, 123],
];
const DARK = 124;

// Boss cut-out is 1326x2225, shown 1300px tall. His photo is cropped on the right,
// so that edge is pushed off-frame.
const BOSS_HEIGHT = 1300;
const BOSS_SCALE = BOSS_HEIGHT / 2225;
const LENSES = [
  { x: 486 * BOSS_SCALE, y: 437 * BOSS_SCALE },
  { x: 648 * BOSS_SCALE, y: 442 * BOSS_SCALE },
];
const CIGAR = { x: 342 * BOSS_SCALE, y: 837 * BOSS_SCALE };

const Scene2Content: React.FC<{
  readonly word1: string;
  readonly word2: string;
  readonly sunburst: string;
}> = ({ word1, word2, sunburst }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - BOSS_UP, fps, config: { damping: 11, stiffness: 110, mass: 0.9 } });
  const punch = interpolate(frame, [BOSS_UP + 8, BOSS_UP + 28], [1, 1.09], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const sway = boil(frame, { period: 70, breathe: 0.006, sway: 1.2 });
  const swingLogo = spring({ frame: frame - LOGO_IN, fps, config: { damping: 13, stiffness: 90 } });
  const swingCash = spring({ frame: frame - CASH_IN, fps, config: { damping: 13, stiffness: 90 } });
  const negative = isOn(frame, NEGATIVE);
  const dark = frame >= DARK;
  const eyeGlow = interpolate(frame, [DARK, DARK + 8], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        filter: negative ? "invert(1) hue-rotate(180deg)" : undefined,
        backgroundColor: "#58080c",
      }}
    >
      {/* Red sunburst with faint rays, slowly turning. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${sunburst} 0%, #7c0d12 45%, #58080c 80%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 45%, rgba(255,210,180,0.07) 0deg 6deg, rgba(0,0,0,0) 6deg 15deg)",
          rotate: `${interpolate(frame, [0, 150], [0, 14])}deg`,
          scale: "1.6",
          filter: dark ? "grayscale(1) brightness(0.5)" : undefined,
        }}
      />

      {/* Two props swing in from opposite edges, each inside a hand-drawn diamond. */}
      <div style={{ position: "absolute", left: 20, top: 480, width: 440, height: 440 }}>
        <HandDiamond at={LOGO_IN} size={440} seed="logo" />
        <Img
          src={staticFile("library/logos/netflix-wordmark.png")}
          style={{
            position: "absolute",
            left: 70,
            top: 170,
            width: 300,
            translate: `${interpolate(swingLogo, [0, 1], [-640, 0])}px 0px`,
            rotate: `${interpolate(swingLogo, [0, 1], [-35, -8])}deg`,
            filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.5))",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 620, top: 480, width: 440, height: 440 }}>
        <HandDiamond at={CASH_IN} size={440} seed="cash" />
        <Img
          src={staticFile("library/objects/cash-hand.png")}
          style={{
            position: "absolute",
            left: 40,
            top: 110,
            width: 400,
            translate: `${interpolate(swingCash, [0, 1], [700, 0])}px 0px`,
            rotate: `${interpolate(swingCash, [0, 1], [30, 6])}deg`,
            scale: "-1 1",
            filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.5))",
          }}
        />
      </div>

      <SlotCounter from={SLOT_FROM} to={SLOT_TO} style={{ left: 90, top: 250 }} />

      {/* The boss rises, punches in, and sways with his cigar smoking. */}
      <div
        style={{
          position: "absolute",
          left: 1110 - 1326 * BOSS_SCALE,
          top: 680,
          width: 1326 * BOSS_SCALE,
          height: BOSS_HEIGHT,
          opacity: frame >= BOSS_UP ? 1 : 0,
          transformOrigin: "50% 100%",
          translate: `0px ${interpolate(rise, [0, 1], [1300, 0])}px`,
          scale: String(punch * sway.scale),
          rotate: `${sway.rotate}deg`,
        }}
      >
        <Smoke x={CIGAR.x} y={CIGAR.y} start={BOSS_UP + 4} />
        <Img
          src={staticFile("library/people/boss.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            filter: dark
              ? "grayscale(1) contrast(1.25) brightness(0.9)"
              : "drop-shadow(0 0 40px rgba(0,0,0,0.6))",
          }}
        />
        {LENSES.map((lens, i) => (
          <div key={i} style={{ position: "absolute", left: lens.x, top: lens.y, opacity: eyeGlow }}>
            <div
              style={{
                position: "absolute",
                left: -170,
                top: -170,
                width: 340,
                height: 340,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,240,230,1) 0%, rgba(255,40,20,0.95) 14%, rgba(255,0,0,0.35) 38%, rgba(255,0,0,0) 70%)",
                mixBlendMode: "screen",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: -420,
                top: -6,
                width: 840,
                height: 12,
                background: "linear-gradient(90deg, rgba(255,0,0,0) 0%, rgba(255,60,40,0.9) 50%, rgba(255,0,0,0) 100%)",
                filter: "blur(3px)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        ))}
      </div>

      <CaptionBox at={LAUGHED} style={{ left: 120, top: 1300 }}>
        {word1}
      </CaptionBox>
      <CaptionBox at={THEM_OUT} style={{ left: 520, top: 1410 }}>
        {word2}
      </CaptionBox>
    </AbsoluteFill>
  );
};

const Scene2Inner: React.FC<{
  readonly word1: string;
  readonly word2: string;
  readonly sunburst: string;
}> = (props) => (
  <FilmLook>
    <Scene2Content {...props} />
  </FilmLook>
);

export const Scene2Rejection = Interactive.create({
  Component: Scene2Inner,
  layout: "absolute-fill",
  schema: {
    word1: { type: "string", default: "laughed", description: "Caption box 1" },
    word2: { type: "string", default: "them out", description: "Caption box 2" },
    sunburst: { type: "color", default: "#a01218", description: "Sunburst centre" },
  },
});
