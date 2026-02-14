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
        motion.animate(ctaButton, { scale: [1, 1.03] }, { duration: 0.2 });
      };
      const hoverOut = () => {
        motion.animate(ctaButton, { scale: [1.03, 1] }, { duration: 0.2 });
      };
      const pressIn = () => {
        motion.animate(ctaButton, { scale: [1, 0.97] }, { duration: 0.12 });
      };
      const pressOut = () => {
        motion.animate(ctaButton, { scale: [0.97, 1.01] }, { duration: 0.15 });
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
      const pulseTimer = window.setInterval(() => {
        const rect = envelope.getBoundingClientRect();
        const x = rect.left + rect.width * (0.35 + Math.random() * 0.3);
        const y = rect.top + rect.height * (0.3 + Math.random() * 0.4);

        new mojs.Shape({
          left: x,
          top: y,
          parent: document.body,
          shape: "heart",
          fill: "none",
          stroke: "#cc7e5b",
          strokeWidth: { 12: 0 },
          radius: { 10: 26 },
          duration: 1200,
          easing: "quad.out"
        }).play();
      }, 1800);

      cleanups.push(() => window.clearInterval(pulseTimer));
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

  if (reducedMotion) {
    return;
  }

  flap?.animate(
    [
      { transform: "rotateX(0deg)" },
      { transform: "rotateX(-130deg)" }
    ],
    {
      duration: 540,
      easing: "cubic-bezier(0.2, 0.84, 0.3, 1)",
      fill: "forwards"
    }
  );

  letter.animate(
    [
      { transform: "translateY(0)", opacity: 0.7 },
      { transform: "translateY(-56px)", opacity: 1 }
    ],
    {
      duration: 700,
      easing: "cubic-bezier(0.19, 1, 0.22, 1)",
      fill: "forwards"
    }
  );
}
