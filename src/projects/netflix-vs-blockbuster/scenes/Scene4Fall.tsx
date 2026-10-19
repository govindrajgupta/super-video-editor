import type React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../../library/elements/Caption";
import { GroundedPunch } from "../../../library/techniques/GroundedPunch";
import { Underline } from "../../../library/elements/HandDrawn";
import { FilmLook, SOMBRE_GRADE } from "../../../library/looks/FilmLook";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const SHIFT = 128; // the man steps aside to make room for the verdict
const VERDICT = 137;

const Scene4Content: React.FC<{
  readonly punchScale: number;
  readonly shadowSkew: number;
  readonly shadowOpacity: number;
  readonly bgZoom: number;
  readonly lead: string;
  readonly verdict: string;
}> = ({ punchScale, shadowSkew, shadowOpacity, bgZoom, lead, verdict }) => {
  const frame = useCurrentFrame();
  const stackFade = interpolate(frame, [SHIFT, SHIFT + 10], [1, 0.3], clamp);
  const focus = interpolate(frame, [VERDICT, VERDICT + 20], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <GroundedPunch
        rig={{
          background: "library/places/blockbuster-bg.jpg",
          backgroundFilter: "brightness(0.78) contrast(1.05)",
          character: "library/people/exec-full.png",
          characterSize: { width: 874, height: 2096 },
          height: 900,
          feet: { x: 690, y: 1690 },
          bgZoom,
          punchScale,
          punchEnd: 70,
          shadowSkew,
          shadowOpacity,
          shift: { at: SHIFT, by: -300 },
        }}
      />
      {/* Focus vignette tightens around the verdict. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 35% at 78% 46%, rgba(0,0,0,0) 30%, rgba(0,0,0,${0.6 * focus}) 100%)`,
        }}
      />
      <Caption at={4} fadeAt={40} size={84} style={{ left: 70, top: 240 }}>
        {lead}
      </Caption>
      <div style={{ position: "absolute", left: 60, top: 470, opacity: stackFade }}>
        <Caption at={56} size={130} style={{ left: 0, top: 0 }}>
          closing
        </Caption>
        <Caption at={70} size={170} style={{ left: 30, top: 120 }}>
          stores
        </Caption>
        <Caption at={90} size={96} style={{ left: 10, top: 290 }}>
          by the thousand
        </Caption>
      </div>
      <Caption at={VERDICT - 3} size={64} style={{ left: 640, top: 770 }}>
        filed for
      </Caption>
      <Caption at={VERDICT} size={100} style={{ left: 610, top: 835 }}>
        {verdict}
      </Caption>
      <Underline at={VERDICT + 4} width={420} seed="bankrupt" style={{ left: 612, top: 945 }} />
    </AbsoluteFill>
  );
};

const Scene4Inner: React.FC<{
  readonly punchScale: number;
  readonly shadowSkew: number;
  readonly shadowOpacity: number;
  readonly bgZoom: number;
  readonly lead: string;
  readonly verdict: string;
}> = (props) => (
  <FilmLook grade={SOMBRE_GRADE}>
    <Scene4Content {...props} />
  </FilmLook>
);

export const Scene4Fall = Interactive.create({
  Component: Scene4Inner,
  layout: "absolute-fill",
  schema: {
    punchScale: { type: "number", hiddenFromList: false, default: 1.7, min: 1, max: 2.5, step: 0.05, description: "Punch scale" },
    shadowSkew: { type: "number", hiddenFromList: false, default: -53, min: -80, max: 80, step: 1, description: "Shadow skew" },
    shadowOpacity: { type: "number", hiddenFromList: false, default: 0.55, min: 0, max: 1, step: 0.05, description: "Shadow opacity" },
    bgZoom: { type: "number", hiddenFromList: false, default: 1.12, min: 1, max: 1.5, step: 0.01, description: "Background zoom" },
    lead: { type: "string", default: "Ten years later,", description: "Lead-in caption" },
    verdict: { type: "string", default: "bankruptcy.", description: "Verdict" },
  },
});
