import { MOTION_EASING, MOTION_MS } from "./motionTokens";

export async function animateMemoryCard(card: HTMLElement, reducedMotion: boolean) {
  if (reducedMotion) {
    return;
  }

  try {
    const animeModule: any = await import("animejs");
    const anime = animeModule.default ?? animeModule;
    anime({
      targets: card,
      scale: [1, 0.99, 1],
      translateY: [0, -4, 0],
      duration: MOTION_MS.standard,
      easing: "easeOutCubic"
    });
  } catch {
    card.animate(
      [
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-4px) scale(0.99)" },
        { transform: "translateY(0) scale(1)" }
      ],
      { duration: MOTION_MS.standard, easing: MOTION_EASING.out }
    );
  }
}

export async function smoothScrollToChapter(target: HTMLElement, reducedMotion: boolean) {
  if (reducedMotion) {
    target.scrollIntoView({ block: "start" });
    return;
  }

  try {
    const velocityModule: any = await import("velocity-animate");
    const velocity = velocityModule.default ?? velocityModule;
    velocity(target, "scroll", {
      duration: 420,
      offset: -72,
      easing: "easeInOutQuad"
    });
  } catch {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
