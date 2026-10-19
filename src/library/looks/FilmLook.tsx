import type React from "react";
import {
  AbsoluteFill,
  Freeze,
  Img,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { posterizeFrame, stepIndex, wobble } from "../engine/motion";

export type Grade = {
  readonly saturate: number;
  readonly contrast: number;
  readonly sepia: number;
  readonly brightness: number;
};

export const DEFAULT_GRADE: Grade = {
  saturate: 0.86,
  contrast: 1.08,
  sepia: 0.16,
  brightness: 0.95,
};

/** The sombre grade used by the fall (scene 4) and the button (scene 6). */
export const SOMBRE_GRADE: Grade = {
  saturate: 0.62,
  contrast: 1.12,
  sepia: 0.06,
  brightness: 0.94,
};

export type FilmLayers = {
  readonly scanLines?: boolean;
  readonly blinds?: boolean;
  readonly grain?: boolean;
  readonly grunge?: boolean;
  readonly vignette?: boolean;
  readonly cornerBlur?: boolean;
  readonly gateWeave?: boolean;
  readonly stopMotion?: boolean;
};

const GRAIN_PAD = 240;
const CORNER_MASK = "radial-gradient(ellipse 80% 70% at 50% 48%, transparent 64%, black 100%)";

/**
 * Wrap any scene so it reads like aged film (lesson 01 spec): colour grade, gate weave, 12fps
 * stop-motion time, a corner blur, then scan lines, venetian blinds, the grain/grunge texture
 * sandwich and a vignette on top. Every layer has a toggle so it can be switched off per scene.
 */
export const FilmLook: React.FC<
  FilmLayers & {
    readonly grade?: Grade;
    readonly children: React.ReactNode;
  }
> = ({
  children,
  grade = DEFAULT_GRADE,
  scanLines = true,
  blinds = true,
  grain = true,
  grunge = true,
  vignette = true,
  cornerBlur = true,
  gateWeave = true,
  stopMotion = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const step = stepIndex(frame, fps);
  const weave = gateWeave ? wobble(frame, fps, "gate", 5) : { x: 0, y: 0 };
  const grainX = Math.floor(random(`grain-x-${step}`) * GRAIN_PAD);
  const grainY = Math.floor(random(`grain-y-${step}`) * GRAIN_PAD);
  const grungeFlip = random(`grunge-${Math.floor(step / 3)}`) > 0.5 ? -1 : 1;

  const content = stopMotion ? <Freeze frame={posterizeFrame(frame, fps)}>{children}</Freeze> : children;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          translate: `${weave.x}px ${weave.y}px`,
          scale: gateWeave ? 1.012 : 1,
          filter: `saturate(${grade.saturate}) contrast(${grade.contrast}) sepia(${grade.sepia}) brightness(${grade.brightness})`,
        }}
      >
        {content}
        {cornerBlur ? (
          // A blurred copy of the frame, masked to the corners (backdrop-filter mirrors edge pixels
          // in Chrome renders, so the frame is drawn twice instead).
          <AbsoluteFill
            style={{
              filter: "blur(7px)",
              scale: "1.02",
              WebkitMaskImage: CORNER_MASK,
              maskImage: CORNER_MASK,
            }}
          >
            {content}
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      {scanLines ? (
        <AbsoluteFill
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1.6px, transparent 1.6px, transparent 8px)",
            filter: "blur(0.7px)",
          }}
        />
      ) : null}
      {blinds ? (
        <AbsoluteFill
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(0,0,0,0.045) 0px, rgba(0,0,0,0.045) 8px, transparent 8px, transparent 30px)",
            filter: "blur(3px)",
          }}
        />
      ) : null}
      {grain ? (
        // Texture sandwich, part 1: the dark grain plate inverted (brightness 1.35, contrast
        // 1.02) on multiply at 55%, shifted every 12fps step so the grain dances.
        <Img
          src={staticFile("library/textures/film-grain.jpg")}
          style={{
            position: "absolute",
            left: -grainX,
            top: -grainY,
            width: width + GRAIN_PAD,
            height: height + GRAIN_PAD,
            filter: "invert(1) brightness(1.35) contrast(1.02)",
            mixBlendMode: "multiply",
            opacity: 0.55,
          }}
        />
      ) : null}
      {grunge ? (
        // Texture sandwich, part 2: grunge on colour-burn at 16%.
        <Img
          src={staticFile("library/textures/grunge.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width,
            height,
            scale: `${grungeFlip} 1`,
            mixBlendMode: "color-burn",
            opacity: 0.16,
          }}
        />
      ) : null}
      {vignette ? (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 92% 82% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
