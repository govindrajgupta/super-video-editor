import type React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { stepIndex } from "../engine/motion";

/** Palette of the paper-studio look (lesson 02). */
export const PAPER = {
  paper: "#e6e6e4",
  green: "#1f6b52",
  greenDark: "#164d3b",
  greenNight: "#0d3328",
  red: "#c8102e",
  ink: "#161616",
  lime: "#b9f227",
} as const;

/** A green 3D tile: thick extrusion edge plus a long soft shadow to the bottom right. */
export const tileShadow = (depth = 14) =>
  `0 ${depth}px 0 ${PAPER.greenDark}, ${depth * 2}px ${depth * 4}px ${depth * 4}px rgba(0,0,0,0.32)`;

/**
 * Clean, tactile studio surface: light grey paper, a fine halftone dot grid, a soft centre light
 * and a breath of grain. `dark` switches to the deep-green chapter (glow in the middle).
 * Motion stays smooth (no stop-motion step).
 */
export const PaperStudioLook: React.FC<{
  readonly children: React.ReactNode;
  readonly dark?: boolean;
  readonly halftone?: boolean;
  readonly grain?: boolean;
}> = ({ children, dark = false, halftone = true, grain = true }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const step = stepIndex(frame, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: dark ? PAPER.greenNight : PAPER.paper, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: dark
            ? "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(60,160,120,0.45) 0%, rgba(13,51,40,0) 70%)"
            : "radial-gradient(ellipse 75% 60% at 50% 42%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%)",
        }}
      />
      {halftone ? (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(circle, ${dark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.09)"} 1.1px, transparent 1.6px)`,
            backgroundSize: "7px 7px",
          }}
        />
      ) : null}
      <AbsoluteFill>{children}</AbsoluteFill>
      {grain ? (
        <Img
          src={staticFile("library/textures/grain.jpg")}
          style={{
            position: "absolute",
            left: -Math.floor(random(`pg-x-${step}`) * 200),
            top: -Math.floor(random(`pg-y-${step}`) * 200),
            width: width + 200,
            height: height + 200,
            mixBlendMode: "overlay",
            opacity: 0.22,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
