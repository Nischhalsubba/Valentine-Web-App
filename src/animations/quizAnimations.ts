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
        opacity: [0.2, 1],
        x: [16, 0]
      },
      {
        duration: 0.3
      }
    );
  } catch {
    node.animate(
      [
        { opacity: 0.2, transform: "translateX(16px)" },
        { opacity: 1, transform: "translateX(0px)" }
      ],
      { duration: 260, easing: "ease-out" }
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
        to: 1.08,
        duration: 160,
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
      from: -9,
      to: 9,
      duration: 70,
      repeat: 4,
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
            { transform: "scale(1.08)" },
            { transform: "scale(1)" }
          ]
        : [
            { transform: "translateX(-8px)" },
            { transform: "translateX(8px)" },
            { transform: "translateX(0px)" }
          ],
      { duration: 260, easing: "ease-out" }
    );
  }
}
