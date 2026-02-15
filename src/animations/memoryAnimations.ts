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
      scale: [1, 0.992, 1],
      duration: 260,
      easing: "easeOutCubic"
    });
  } catch {
    card.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.992)" },
        { transform: "scale(1)" }
      ],
      { duration: 260, easing: MOTION_EASING.out }
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
      duration: 380,
      offset: -72,
      easing: "easeInOutQuad"
    });
  } catch {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
