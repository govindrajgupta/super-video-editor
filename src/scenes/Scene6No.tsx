import type React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../elements/Caption";
import { GroundedPunch } from "../elements/GroundedPunch";
import { FoamFinger } from "../elements/Props";
import { FilmLook, SOMBRE_GRADE } from "../engine/FilmLook";
import { decayingWag } from "../engine/motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FINGER = 40; // the foam finger slides in just before "no"

/** Scene 4's rig, re-skinned: new character, new words, and a foam finger that wags "no". */
const Scene6Content: React.FC<{
  readonly punchScale: number;
  readonly line1: string;
  readonly line2: string;
  readonly line3: string;
}> = ({ punchScale, line1, line2, line3 }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [FINGER, FINGER + 12], [0, 1], clamp);
  const wag = decayingWag(frame - (FINGER + 12));

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <GroundedPunch
        rig={{
          // Same emptied-out Blockbuster street as scene 4: only the character changes.
          background: "assets/blockbuster-bg.jpg",
          backgroundFilter: "brightness(0.62) contrast(1.08)",
          character: "assets/founder-full.png",
          characterSize: { width: 621, height: 2070 },
          height: 900,
          feet: { x: 600, y: 1720 },
          bgZoom: 1.12,
          punchScale,
          punchEnd: 58,
          shadowSkew: -53,
          shadowOpacity: 0.55,
        }}
      />
      <Caption at={8} size={120} style={{ left: 60, top: 360 }}>
        {line1}
      </Caption>
      <Caption at={16} size={150} style={{ left: 40, top: 480 }}>
        {line2}
      </Caption>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 700,
          width: 300,
          height: 460,
          transformOrigin: "50% 100%",
          translate: `${interpolate(enter, [0, 1], [700, 0])}px ${interpolate(enter, [0, 1], [900, 0])}px`,
          scale: String(interpolate(enter, [0, 1], [0.72, 0.9])),
          rotate: `${wag}deg`,
          opacity: frame >= FINGER ? 1 : 0,
          filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.55))",
        }}
      >
        <FoamFinger style={{ left: 0, top: 0 }} />
      </div>
      <Caption at={66} size={110} style={{ left: 60, top: 1210 }}>
        {line3}
      </Caption>
    </AbsoluteFill>
  );
};

const Scene6Inner: React.FC<{
  readonly punchScale: number;
  readonly line1: string;
  readonly line2: string;
  readonly line3: string;
}> = (props) => (
  <FilmLook grade={SOMBRE_GRADE}>
    <Scene6Content {...props} />
  </FilmLook>
);

export const Scene6No = Interactive.create({
  Component: Scene6Inner,
  layout: "absolute-fill",
  schema: {
    punchScale: { type: "number", hiddenFromList: false, default: 1.7, min: 1, max: 2.5, step: 0.05, description: "Punch scale" },
    line1: { type: "string", default: "The most", description: "Caption 1" },
    line2: { type: "string", default: "expensive", description: "Caption 2" },
    line3: { type: "string", default: "in history.", description: "Caption 3" },
  },
});
