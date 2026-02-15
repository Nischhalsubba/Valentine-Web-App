import { MOTION_DURATION, MOTION_EASING, MOTION_MS } from "./motionTokens";

type Cleanup = () => void;

interface CoverAnimationOptions {
  envelope: HTMLElement | null;
  ctaButton: HTMLButtonElement | null;
  reducedMotion: boolean;
}

interface OpenAnimationOptions {
  envelope: HTMLElement | null;
  letter: HTMLElement | null;
  reducedMotion: boolean;
}

let runCoverBurst: ((envelope: HTMLElement) => void) | null = null;

export async function initCoverAnimations({
  envelope,
  ctaButton,
  reducedMotion
}: CoverAnimationOptions): Promise<Cleanup> {
  const cleanups: Cleanup[] = [];

  if (ctaButton) {
    try {
      const motion = await import("motion");
      const hoverIn = () => {
        motion.animate(ctaButton, { scale: [1, 1.02] }, { duration: MOTION_DURATION.fast });
      };
      const hoverOut = () => {
        motion.animate(ctaButton, { scale: [1.02, 1] }, { duration: MOTION_DURATION.fast });
      };
      const pressIn = () => {
        motion.animate(ctaButton, { scale: [1, 0.98] }, { duration: 0.12 });
      };
      const pressOut = () => {
        motion.animate(ctaButton, { scale: [0.98, 1] }, { duration: MOTION_DURATION.fast });
      };

      ctaButton.addEventListener("mouseenter", hoverIn);
      ctaButton.addEventListener("mouseleave", hoverOut);
      ctaButton.addEventListener("pointerdown", pressIn);
      ctaButton.addEventListener("pointerup", pressOut);

      cleanups.push(() => ctaButton.removeEventListener("mouseenter", hoverIn));
      cleanups.push(() => ctaButton.removeEventListener("mouseleave", hoverOut));
      cleanups.push(() => ctaButton.removeEventListener("pointerdown", pressIn));
      cleanups.push(() => ctaButton.removeEventListener("pointerup", pressOut));
    } catch {
      ctaButton.classList.add("cta-fallback");
    }
  }

  if (!reducedMotion && envelope) {
    try {
      const mojsModule: any = await import("@mojs/core");
      const mojs = mojsModule.default ?? mojsModule;

      runCoverBurst = (targetEnvelope: HTMLElement) => {
        const rect = targetEnvelope.getBoundingClientRect();
        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.45;

        const burst = new mojs.Burst({
          left: centerX,
          top: centerY,
          count: 8,
          radius: { 0: 56 },
          degree: 130,
          angle: -25,
          children: {
            shape: "heart",
            radius: { 8: 0 },
            fill: ["#E85D75", "#FFD3DA", "#F8A7B7"],
            duration: 760,
            easing: "quad.out",
            opacity: { 0.8: 0 }
          }
        });

        burst.play();
      };

      cleanups.push(() => {
        runCoverBurst = null;
      });
    } catch {
      // Fallback remains static.
    }
  }

  return () => {
    cleanups.forEach((dispose) => dispose());
  };
}

export function playEnvelopeOpen({ envelope, letter, reducedMotion }: OpenAnimationOptions) {
  if (!envelope || !letter) {
    return;
  }

  const flap = envelope.querySelector<HTMLElement>(".envelope-flap");
  envelope.classList.add("is-open");
  letter.classList.add("is-open");

  if (!reducedMotion) {
    envelope.classList.add("is-opening");
    runCoverBurst?.(envelope);
    window.setTimeout(() => envelope.classList.remove("is-opening"), 420);
  }

  if (reducedMotion) {
    return;
  }

  flap?.animate(
    [
      { transform: "rotateX(0deg)" },
      { transform: "rotateX(-130deg)" }
    ],
    {
      duration: 620,
      easing: MOTION_EASING.decelerate,
      fill: "forwards"
    }
  );

  letter.animate(
    [
      { transform: "translateY(0)", opacity: 0.7 },
      { transform: "translateY(-56px)", opacity: 1 }
    ],
    {
      duration: MOTION_MS.emotional,
      easing: MOTION_EASING.decelerate,
      fill: "forwards"
    }
  );
}
