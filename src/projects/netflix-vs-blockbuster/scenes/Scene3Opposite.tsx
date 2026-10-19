import type React from "react";
import {
  AbsoluteFill,
  Img,
  Interactive,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption } from "../../../library/elements/Caption";
import { Newspaper } from "../../../library/elements/Newspaper";
import { FilmLook } from "../../../library/looks/FilmLook";
import { stepIndex } from "../../../library/engine/motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A soft spring: low stiffness with a touch of mass, so a paper glides in and settles.
const PAPER_SPRING = { stiffness: 42, mass: 1.1, damping: 9 };

type Landing = {
  readonly at: number;
  readonly from: { x: number; y: number; rotate: number };
  readonly to: { x: number; y: number; rotate: number };
};

const usePaperMotion = ({ at, from, to }: Landing, seed: string) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: PAPER_SPRING });
  const step = stepIndex(frame, fps);
  const settled = frame > at + 30;
  const jitter = settled ? (random(`${seed}-${step}`) - 0.5) * 0.6 : 0;
  return {
    opacity: frame >= at ? 1 : 0,
    translate: `${interpolate(p, [0, 1], [from.x, to.x]) - 320}px ${interpolate(p, [0, 1], [from.y, to.y]) - 430}px`,
    rotate: `${interpolate(p, [0, 1], [from.rotate, to.rotate]) + jitter}deg`,
    scale: String(interpolate(p, [0, 1], [1.1, 1], clamp)),
  };
};

const LATE_FEES: Landing = {
  at: 60,
  from: { x: -620, y: 1500, rotate: -26 },
  to: { x: 470, y: 980, rotate: -7 },
};
const STORES: Landing = {
  at: 88,
  from: { x: 1700, y: 760, rotate: 24 },
  to: { x: 620, y: 940, rotate: 6 },
};
const CUSTOMERS: Landing = {
  at: 122,
  from: { x: 560, y: 2600, rotate: -14 },
  to: { x: 540, y: 1010, rotate: -3 },
};

const Scene3Content: React.FC<{ readonly caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const late = usePaperMotion(LATE_FEES, "late");
  const stores = usePaperMotion(STORES, "stores");
  const customers = usePaperMotion(CUSTOMERS, "customers");
  // Focus hunt: the lens opens blurry, finds the desk, and breathes a little as each paper lands.
  const focus =
    interpolate(frame, [0, 14], [10, 0], clamp) +
    interpolate(frame, [66, 70, 76], [0, 1.6, 0], clamp) +
    interpolate(frame, [94, 98, 104], [0, 1.6, 0], clamp) +
    interpolate(frame, [128, 132, 138], [0, 1.6, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1b120b", filter: `blur(${focus}px)` }}>
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, 171], [1.04, 1.13])),
        }}
      >
        <Img
          src={staticFile("library/surfaces/wood-desk.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.75) saturate(1.1)",
          }}
        />
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse 70% 55% at 50% 52%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        <Newspaper
          name="The Daily Report"
          date="Tuesday, April 6, 1999"
          headline={
            <>
              NO LATE
              <br />
              FEES
            </>
          }
          seed={1}
          style={{ left: 0, top: 0, ...late }}
        />
        <Newspaper
          name="The Morning Ledger"
          date="Friday, July 14, 2000"
          headline={
            <>
              NO
              <br />
              STORES
            </>
          }
          headlineColor="#8f1414"
          seed={2}
          style={{ left: 0, top: 0, ...stores }}
        />
        <Newspaper
          name="Financial Herald"
          date="Monday, January 8, 2001"
          headline={
            <>
              CUSTOMERS
              <br />
              FIRST
            </>
          }
          headlineSize={128}
          seed={3}
          style={{ left: 0, top: 0, ...customers }}
        />
      </AbsoluteFill>
      <Caption at={4} fadeAt={48} size={110} style={{ left: 0, right: 0, top: 210, textAlign: "center" }}>
        {caption}
      </Caption>
    </AbsoluteFill>
  );
};

const Scene3Inner: React.FC<{ readonly caption: string }> = (props) => (
  <FilmLook>
    <Scene3Content {...props} />
  </FilmLook>
);

export const Scene3Opposite = Interactive.create({
  Component: Scene3Inner,
  layout: "absolute-fill",
  schema: {
    caption: { type: "string", default: "built the opposite.", description: "Caption" },
  },
});
