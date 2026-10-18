import { random } from "remotion";

/** Frames per second of the stop-motion step. Everything visible moves in 12fps jumps. */
export const STEP_FPS = 12;

/** Index of the current 12fps step. */
export const stepIndex = (frame: number, fps: number) =>
  Math.floor((frame * STEP_FPS) / fps + 1e-6);

/** Snap a frame back to the start of its 12fps step (posterize time). */
export const posterizeFrame = (frame: number, fps: number) =>
  (stepIndex(frame, fps) * fps) / STEP_FPS;

/** Slow sine oscillator, -1..1. */
export const pingpong = (frame: number, period: number, phase = 0) =>
  Math.sin((frame / period) * Math.PI * 2 + phase);

/**
 * Character boil: a cut-out "breathes" and sways a touch so a still photo feels alive.
 * Returns a scale multiplier and a rotation in degrees.
 */
export const boil = (
  frame: number,
  { period = 140, breathe = 0.005, sway = 0.5, phase = 0 } = {},
) => ({
  scale: 1 + pingpong(frame, period, phase) * breathe,
  rotate: pingpong(frame, period * 1.13, phase + 1.3) * sway,
});

/** Hand-held wobble: a random offset that changes once per 12fps step. */
export const wobble = (frame: number, fps: number, seed: string, travel: number) => {
  const i = stepIndex(frame, fps);
  return {
    x: (random(`${seed}-x-${i}`) - 0.5) * travel,
    y: (random(`${seed}-y-${i}`) - 0.5) * travel,
  };
};

/** A wag that decays, e.g. a finger saying "no": angle(t) = amp * cos(t * speed) * e^(-damping * t). */
export const decayingWag = (
  t: number,
  { amplitude = 28, speed = 0.52, damping = 0.042 } = {},
) => (t < 0 ? 0 : amplitude * Math.cos(t * speed) * Math.exp(-damping * t));

/** Hold-keyframe flicker: true while frame is inside any [start, end] range. */
export const isOn = (frame: number, ranges: readonly (readonly [number, number])[]) =>
  ranges.some(([start, end]) => frame >= start && frame <= end);
