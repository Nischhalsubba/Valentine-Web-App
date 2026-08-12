export const MOTION_DURATION = {
  micro: 0.14,
  fast: 0.16,
  standard: 0.3,
  ui: 0.3,
  emotional: 0.72,
  hero: 0.72,
  hold: 1.5
} as const;

export const MOTION_MS = {
  micro: 140,
  fast: 160,
  standard: 300,
  ui: 300,
  emotional: 720,
  hero: 720,
  hold: 1500
} as const;

export const MOTION_EASING = {
  out: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  decelerate: "cubic-bezier(0.05, 0.7, 0.1, 1)"
} as const;
