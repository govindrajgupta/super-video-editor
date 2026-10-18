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
import { FilmLook } from "../engine/FilmLook";
import { serif } from "../engine/fonts";
import { boil } from "../engine/motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Portal zoom timings (30fps).
const PUSH_END = 30; // slow push ends, zoom-through starts
const ZOOM_END = 60; // camera is through the wall
const WELD = 46; // photo and gold frame move as one unit until here
const SETTLE = 56; // photo fills the screen
const WELD_RATIO = 0.369; // photo scale relative to the wall while welded
const FRAME_CENTER_Y = 900;

const wallScale = (frame: number) =>
  interpolate(frame, [0, PUSH_END, ZOOM_END], [1, 1.16, 6.8], {
    ...clamp,
    easing: [Easing.inOut(Easing.quad), Easing.in(Easing.cubic)],
  });

/** The picture inside the frame: sky, drifting clouds, the HQ, and the founder. */
const Photo: React.FC<{ readonly gray: number }> = ({ gray }) => {
  const frame = useCurrentFrame();
  const founder = boil(frame);
  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: `grayscale(${gray})` }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #5f9bd6 0%, #9cc4e8 45%, #d7e7f3 70%)" }} />
      <Img
        src={staticFile("assets/clouds.png")}
        style={{
          position: "absolute",
          left: -160,
          top: 60,
          width: 1800,
          translate: `${interpolate(frame, [0, 183], [0, -525])}px 0px`,
        }}
      />
      <Img
        src={staticFile("assets/clouds.png")}
        style={{
          position: "absolute",
          left: 380,
          top: 330,
          width: 1300,
          opacity: 0.8,
          scale: "-1 1",
          translate: `${interpolate(frame, [0, 183], [0, -315])}px 0px`,
        }}
      />
      <Img
        src={staticFile("assets/hq-building.png")}
        style={{
          position: "absolute",
          left: -300,
          top: 770,
          height: 1150,
          translate: `${interpolate(frame, [0, 183], [0, -14])}px 0px`,
        }}
      />
      <Img
        src={staticFile("assets/founder.png")}
        style={{
          position: "absolute",
          left: 440,
          top: 690,
          height: 1250,
          transformOrigin: "50% 100%",
          scale: String(founder.scale),
          rotate: `${founder.rotate}deg`,
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))",
        }}
      />
    </AbsoluteFill>
  );
};

const Scene1Content: React.FC<{
  readonly plaque: string;
  readonly line1: string;
  readonly line2: string;
  readonly line3: string;
  readonly line4: string;
}> = ({ plaque, line1, line2, line3, line4 }) => {
  const frame = useCurrentFrame();
  const wall = wallScale(frame);
  const weldedScale = WELD_RATIO * wallScale(WELD);
  const photoScale =
    frame <= WELD
      ? WELD_RATIO * wall
      : frame <= SETTLE
        ? interpolate(frame, [WELD, SETTLE], [weldedScale, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
        : interpolate(frame, [SETTLE, 183], [1, 1.05], clamp);
  const photoY = interpolate(frame, [WELD, SETTLE], [FRAME_CENTER_Y - 960, 0], clamp);
  const burst = interpolate(frame, [38, 45, SETTLE], [0, 9, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1510" }}>
      {/* The museum wall with its plaque. */}
      <AbsoluteFill
        style={{
          transformOrigin: `540px ${FRAME_CENTER_Y}px`,
          scale: String(wall),
          filter: `blur(${interpolate(frame, [36, SETTLE], [0, 8], clamp)}px)`,
          opacity: interpolate(frame, [44, 58], [1, 0], clamp),
        }}
      >
        <Img
          src={staticFile("assets/paper-wall.jpg")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.45) brightness(0.92)" }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% ${FRAME_CENTER_Y / 19.2}%, rgba(255,240,210,0.35) 0%, rgba(0,0,0,0) 60%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - 150,
            top: 1372,
            width: 300,
            height: 92,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, #e2c47a 0%, #b08b3f 55%, #8a6a2a 100%)",
            border: "3px solid #6e5320",
            boxShadow: "0 8px 18px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.4)",
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 54,
            color: "#2a1d08",
          }}
        >
          {plaque}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ filter: `blur(${burst}px)` }}>
        {/* The photo: welded inside the frame, then it detaches and fills the screen. */}
        <AbsoluteFill
          style={{
            translate: `0px ${photoY}px`,
            scale: String(photoScale),
          }}
        >
          <Photo gray={interpolate(frame, [WELD, SETTLE], [1, 0], clamp)} />
        </AbsoluteFill>
        {/* The gold frame keeps flying past the camera after the detach. */}
        <Img
          src={staticFile("assets/gold-frame.png")}
          style={{
            position: "absolute",
            left: 540 - 740,
            top: FRAME_CENTER_Y - 1160,
            width: 1480,
            height: 2320,
            scale: String(WELD_RATIO * wall),
            opacity: interpolate(frame, [56, 62], [1, 0], clamp),
            filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))",
          }}
        />
      </AbsoluteFill>

      <Caption at={52} fadeAt={84} style={{ left: 70, top: 250 }}>
        {line1}
      </Caption>
      <Caption at={66} fadeAt={84} style={{ left: 120, top: 380 }}>
        {line2}
      </Caption>
      <Caption at={90} size={104} style={{ left: 70, top: 250 }}>
        {line3}
      </Caption>
      <Caption at={132} size={104} style={{ left: 120, top: 370 }}>
        {line4}
      </Caption>
    </AbsoluteFill>
  );
};

const Scene1Inner: React.FC<{
  readonly plaque: string;
  readonly line1: string;
  readonly line2: string;
  readonly line3: string;
  readonly line4: string;
}> = (props) => (
  <FilmLook>
    <Scene1Content {...props} />
  </FilmLook>
);

export const Scene1Opener = Interactive.create({
  Component: Scene1Inner,
  layout: "absolute-fill",
  schema: {
    plaque: { type: "string", default: "In 2000", description: "Plaque" },
    line1: { type: "string", default: "a tiny startup", description: "Caption 1" },
    line2: { type: "string", default: "called Netflix", description: "Caption 2" },
    line3: { type: "string", default: "offered to sell itself", description: "Caption 3" },
    line4: { type: "string", default: "to Blockbuster.", description: "Caption 4" },
  },
});
