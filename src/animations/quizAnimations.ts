import { MOTION_DURATION, MOTION_EASING, MOTION_MS } from "./motionTokens";

export async function animateQuestionSwap(node: HTMLElement | null, reducedMotion: boolean) {
  if (!node) {
    return;
  }

  if (reducedMotion) {
    return;
  }

  try {
    const motion = await import("motion");
    motion.animate(
      node,
      {
        opacity: [0.24, 1],
        x: [12, 0]
      },
      {
        duration: MOTION_DURATION.standard,
        ease: [0.4, 0, 0.2, 1] as const
      }
    );
  } catch {
    node.animate(
      [
        { opacity: 0.24, transform: "translateX(12px)" },
        { opacity: 1, transform: "translateX(0px)" }
      ],
      { duration: MOTION_MS.standard, easing: MOTION_EASING.inOut }
    );
  }
}

export async function animateAnswerFeedback(
  node: HTMLElement,
  isCorrect: boolean,
  reducedMotion: boolean
) {
  node.classList.remove("is-correct", "is-wrong");
  node.classList.add(isCorrect ? "is-correct" : "is-wrong");

  if (reducedMotion) {
    return;
  }

  try {
    const popmotion: any = await import("popmotion");
    if (isCorrect) {
      popmotion.animate({
        from: 1,
        to: 1.02,
        duration: MOTION_MS.fast,
        repeat: 1,
        repeatType: "mirror",
        onUpdate: (latest: number) => {
          node.style.transform = `scale(${latest})`;
        },
        onComplete: () => {
          node.style.transform = "";
        }
      });
      return;
    }

    popmotion.animate({
      from: -5,
      to: 5,
      duration: 54,
      repeat: 3,
      repeatType: "mirror",
      onUpdate: (latest: number) => {
        node.style.transform = `translateX(${latest}px)`;
      },
      onComplete: () => {
        node.style.transform = "";
      }
    });
  } catch {
    node.animate(
        isCorrect
          ? [
              { transform: "scale(1)" },
              { transform: "scale(1.02)" },
              { transform: "scale(1)" }
            ]
          : [
              { transform: "translateX(-5px)" },
              { transform: "translateX(5px)" },
              { transform: "translateX(0px)" }
            ],
      { duration: 220, easing: MOTION_EASING.out }
    );
  }
}
