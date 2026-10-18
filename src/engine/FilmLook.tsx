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
import { posterizeFrame, stepIndex, wobble } from "./motion";

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

/**
 * Wrap any scene so it reads like aged film: colour grade, gate weave, 12fps stop-motion
 * time, then scan lines, venetian blinds, grain, grunge, corner blur and a vignette on top.
 * Every layer has a toggle so it can be switched off per scene.
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
  // Off by default: Chrome's backdrop-filter mirrors edge pixels into the blurred corners.
  cornerBlur = false,
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

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          translate: `${weave.x}px ${weave.y}px`,
          scale: gateWeave ? 1.012 : 1,
          filter: `saturate(${grade.saturate}) contrast(${grade.contrast}) sepia(${grade.sepia}) brightness(${grade.brightness})`,
        }}
      >
        {stopMotion ? (
          <Freeze frame={posterizeFrame(frame, fps)}>{children}</Freeze>
        ) : (
          children
        )}
      </AbsoluteFill>
      {cornerBlur ? (
        <AbsoluteFill
          style={{
            backdropFilter: "blur(6px)",
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 68% at 50% 48%, transparent 62%, black 100%)",
            maskImage:
              "radial-gradient(ellipse 78% 68% at 50% 48%, transparent 62%, black 100%)",
          }}
        />
      ) : null}
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
        <Img
          src={staticFile("assets/grain.jpg")}
          style={{
            position: "absolute",
            left: -grainX,
            top: -grainY,
            width: width + GRAIN_PAD,
            height: height + GRAIN_PAD,
            mixBlendMode: "overlay",
            opacity: 0.55,
          }}
        />
      ) : null}
      {grunge ? (
        <Img
          src={staticFile("assets/grunge.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width,
            height,
            scale: `${grungeFlip} 1`,
            mixBlendMode: "multiply",
            opacity: 0.5,
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
