export const MOTION_DURATION = {
  fast: 0.16,
  standard: 0.28,
  emotional: 0.72
} as const;

export const MOTION_MS = {
  fast: 160,
  standard: 280,
  emotional: 720
} as const;

export const MOTION_EASING = {
  out: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  decelerate: "cubic-bezier(0.05, 0.7, 0.1, 1)"
} as const;
