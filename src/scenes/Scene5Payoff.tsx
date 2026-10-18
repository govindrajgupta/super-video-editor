import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Caption } from "../elements/Caption";
import { PencilOval } from "../elements/HandDrawn";
import { NetflixIdent } from "../elements/NetflixIdent";
import { PendantLamp } from "../elements/Props";
import { FilmLook } from "../engine/FilmLook";
import { boil, isOn, pingpong } from "../engine/motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const HEADLINE = 66;
const IDENT = 146;
// Hold keyframes for the cash highlight: instant on/off, no fades.
const CASH_FLICKER: readonly (readonly [number, number])[] = [
  [66, 71],
  [75, 104],
  [107, 114],
];
const LAMP_ON: readonly (readonly [number, number])[] = [
  [6, 7],
  [10, 999],
];

const Scene5Content: React.FC<{
  readonly line1: string;
  readonly line2: string;
  readonly line3: string;
  readonly identLine1: string;
  readonly identLine2: string;
}> = ({ line1, line2, line3, identLine1, identLine2 }) => {
  const frame = useCurrentFrame();
  const lampOn = isOn(frame, LAMP_ON) ? 1 : 0;
  const founder = boil(frame, { period: 90, breathe: 0.007, sway: 0.6 });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0e0a07" }}>
      {/* Vintage focus hunt: opens wide and soft, whooshes in, then creeps toward the money. */}
      <AbsoluteFill
        style={{
          scale: String(
            interpolate(frame, [0, 21, IDENT], [0.88, 1, 1.08], {
              ...clamp,
              easing: [Easing.out(Easing.cubic), Easing.linear],
            }),
          ),
          filter: `blur(${interpolate(frame, [0, 21], [12, 0], clamp)}px)`,
        }}
      >
        <Img
          src={staticFile("assets/library-bg.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `brightness(${0.55 + lampOn * 0.2})`,
          }}
        />
        <Img
          src={staticFile("assets/founder.png")}
          style={{
            position: "absolute",
            left: 540 - 330,
            top: 640,
            height: 1360,
            transformOrigin: "50% 100%",
            scale: String(founder.scale),
            rotate: `${founder.rotate}deg`,
            filter: `brightness(${0.7 + lampOn * 0.3}) drop-shadow(0 0 40px rgba(0,0,0,0.6))`,
          }}
        />
        {/* Desk top in front of him. */}
        <div
          style={{
            position: "absolute",
            left: -60,
            right: -60,
            top: 1440,
            bottom: -40,
            overflow: "hidden",
            boxShadow: "0 -6px 0 rgba(255,210,150,0.25), 0 -30px 60px rgba(0,0,0,0.6)",
          }}
        >
          <Img
            src={staticFile("assets/wood-desk.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) saturate(1.2)" }}
          />
        </div>
        <Img
          src={staticFile("assets/cash-stacks.png")}
          style={{ position: "absolute", left: 540 - 410, top: 1260, width: 820 }}
        />
        <Img
          src={staticFile("assets/cash-stacks.png")}
          style={{
            position: "absolute",
            left: 540 - 410,
            top: 1260,
            width: 820,
            opacity: isOn(frame, CASH_FLICKER) ? 1 : 0,
            filter: "sepia(1) saturate(5) hue-rotate(18deg) brightness(1.15)",
          }}
        />
        <PendantLamp
          angle={pingpong(frame, 60) * 3}
          glow={lampOn}
          cord={360}
          style={{ left: 60, top: -20 }}
        />
      </AbsoluteFill>

      <Caption at={HEADLINE} size={110} style={{ left: 380, top: 300 }}>
        {line1}
      </Caption>
      <Caption at={HEADLINE + 14} size={230} style={{ left: 330, top: 400 }}>
        {line2}
      </Caption>
      <PencilOval at={HEADLINE + 18} width={700} height={250} seed="billion" style={{ left: 300, top: 410 }} />
      <Caption at={HEADLINE + 34} size={96} style={{ left: 420, top: 660 }}>
        {line3}
      </Caption>

      <NetflixIdent at={IDENT} />
      <Caption at={IDENT + 30} size={100} style={{ left: 0, right: 0, top: 1360, textAlign: "center" }}>
        {identLine1}
      </Caption>
      <Caption at={IDENT + 46} size={100} style={{ left: 0, right: 0, top: 1470, textAlign: "center" }}>
        {identLine2}
      </Caption>
    </AbsoluteFill>
  );
};

const Scene5Inner: React.FC<{
  readonly line1: string;
  readonly line2: string;
  readonly line3: string;
  readonly identLine1: string;
  readonly identLine2: string;
}> = (props) => (
  <FilmLook grade={{ saturate: 0.82, contrast: 1.06, sepia: 0.14, brightness: 0.93 }}>
    <Scene5Content {...props} />
  </FilmLook>
);

export const Scene5Payoff = Interactive.create({
  Component: Scene5Inner,
  layout: "absolute-fill",
  schema: {
    line1: { type: "string", default: "Forty five", description: "Headline 1" },
    line2: { type: "string", default: "billion", description: "Headline 2" },
    line3: { type: "string", default: "dollars a year", description: "Headline 3" },
    identLine1: { type: "string", default: "the biggest paid streaming", description: "Ident caption 1" },
    identLine2: { type: "string", default: "service on Earth.", description: "Ident caption 2" },
  },
});
