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

function isLowPowerDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  return cores <= 2 || memory <= 2;
}

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
        motion.animate(ctaButton, { scale: [1, 1.01] }, { duration: MOTION_DURATION.micro });
      };
      const hoverOut = () => {
        motion.animate(ctaButton, { scale: [1.01, 1] }, { duration: MOTION_DURATION.fast });
      };
      const pressIn = () => {
        motion.animate(ctaButton, { scale: [1, 0.985] }, { duration: MOTION_DURATION.micro });
      };
      const pressOut = () => {
        motion.animate(ctaButton, { scale: [0.985, 1] }, { duration: MOTION_DURATION.fast });
      };

      ctaButton.addEventListener("mouseenter", hoverIn);
      ctaButton.addEventListener("mouseleave", hoverOut);
      ctaButton.addEventListener("pointerdown", pressIn);
      ctaButton.addEventListener("pointerup", pressOut);
      ctaButton.addEventListener("pointercancel", pressOut);
      ctaButton.addEventListener("pointerleave", pressOut);

      cleanups.push(() => ctaButton.removeEventListener("mouseenter", hoverIn));
      cleanups.push(() => ctaButton.removeEventListener("mouseleave", hoverOut));
      cleanups.push(() => ctaButton.removeEventListener("pointerdown", pressIn));
      cleanups.push(() => ctaButton.removeEventListener("pointerup", pressOut));
      cleanups.push(() => ctaButton.removeEventListener("pointercancel", pressOut));
      cleanups.push(() => ctaButton.removeEventListener("pointerleave", pressOut));
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
          count: 6,
          radius: { 0: 52 },
          degree: 110,
          angle: -18,
          children: {
            shape: "heart",
            radius: { 7: 0 },
            fill: ["#E85D75", "#FFD3DA", "#F8A7B7"],
            duration: 640,
            easing: "quad.out",
            opacity: { 0.7: 0 }
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

export function playEnvelopeOpen({ envelope, letter, reducedMotion }: OpenAnimationOptions): number {
  if (!envelope || !letter) {
    return 0;
  }

  const flap = envelope.querySelector<HTMLElement>(".envelope-flap");
  envelope.classList.add("is-open");
  letter.classList.add("is-open");

  if (reducedMotion) {
    envelope.classList.remove("is-opening", "is-glowing");
    letter.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: MOTION_MS.ui,
      easing: MOTION_EASING.inOut,
      fill: "forwards"
    });
    return MOTION_MS.ui;
  }

  const shouldUseSimpleOpen = isLowPowerDevice() || !flap || typeof flap.animate !== "function";
  const addGlow = () => {
    envelope.classList.add("is-glowing");
    window.setTimeout(() => envelope.classList.remove("is-glowing"), 220);
  };

  envelope.classList.add("is-opening");

  if (shouldUseSimpleOpen) {
    envelope.animate(
      [
        { opacity: 1, transform: "translateY(0px)" },
        { opacity: 0.45, transform: "translateY(-8px)" }
      ],
      {
        duration: MOTION_MS.ui,
        easing: MOTION_EASING.decelerate,
        fill: "forwards"
      }
    );

    letter.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(-42px)" }
      ],
      {
        duration: 360,
        easing: MOTION_EASING.decelerate,
        fill: "forwards"
      }
    );

    window.setTimeout(() => {
      runCoverBurst?.(envelope);
      addGlow();
      envelope.classList.remove("is-opening");
    }, 380);

    return 620;
  }

  envelope.animate(
    [{ transform: "translateY(0px)" }, { transform: "translateY(-8px)" }],
    {
      duration: 320,
      easing: MOTION_EASING.decelerate,
      fill: "forwards"
    }
  );

  flap?.animate(
    [
      { transform: "rotateX(0deg)" },
      { transform: "rotateX(-130deg)" }
    ],
    {
      duration: 340,
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
      duration: 380,
      delay: 100,
      easing: MOTION_EASING.decelerate,
      fill: "forwards"
    }
  );

  window.setTimeout(() => {
    runCoverBurst?.(envelope);
    addGlow();
  }, 540);
  window.setTimeout(() => envelope.classList.remove("is-opening"), 760);

  return 820;
}
