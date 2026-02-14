export async function animateMemoryCard(card: HTMLElement, reducedMotion: boolean) {
  if (reducedMotion) {
    return;
  }

  try {
    const animeModule: any = await import("animejs");
    const anime = animeModule.default ?? animeModule;
    anime({
      targets: card,
      scale: [1, 1.03, 1],
      duration: 320,
      easing: "easeOutQuad"
    });
  } catch {
    card.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.02)" },
        { transform: "scale(1)" }
      ],
      { duration: 260, easing: "ease-out" }
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
      duration: 520,
      offset: -72,
      easing: "easeInOutQuad"
    });
  } catch {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
