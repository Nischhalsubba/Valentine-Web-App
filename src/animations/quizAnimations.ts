import { MOTION_EASING, MOTION_MS } from "./motionTokens";

export async function animateQuestionSwap(node: HTMLElement | null, reducedMotion: boolean) {
  if (!node) {
    return;
  }

  if (typeof node.animate !== "function") {
    return;
  }

  if (reducedMotion) {
    node.animate(
      {
        opacity: [0.55, 1]
      },
      {
        duration: 260,
        easing: MOTION_EASING.inOut
      }
    );
    return;
  }

  node.animate(
    [
      { opacity: 0.24, transform: "translateX(10px)" },
      { opacity: 1, transform: "translateX(0px)" }
    ],
    { duration: MOTION_MS.ui, easing: MOTION_EASING.inOut }
  );
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

  if (typeof node.animate !== "function") {
    return;
  }

  if (isCorrect) {
    node.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.02)" },
        { transform: "scale(1)" }
      ],
      { duration: 220, easing: MOTION_EASING.out }
    );
    return;
  }

  node.animate(
    [
      { transform: "translateX(-3px)" },
      { transform: "translateX(3px)" },
      { transform: "translateX(-2px)" },
      { transform: "translateX(2px)" },
      { transform: "translateX(0px)" }
    ],
    { duration: 250, easing: MOTION_EASING.out }
  );
}
