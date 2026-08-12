interface FinaleAnimationOptions {
  heartButton: HTMLButtonElement | null;
  sparkleLayer: HTMLDivElement | null;
  reducedMotion: boolean;
}

interface FinaleAnimationController {
  playReveal: () => void;
  pulseHeart: () => void;
  cleanup: () => void;
}

function createSparkleNode(index: number) {
  const sparkle = document.createElement("span");
  const angle = Math.round((360 / 10) * index + (Math.random() * 18 - 9));
  const distance = 42 + Math.round(Math.random() * 28);
  const delay = Math.round(Math.random() * 160);
  const size = 4 + Math.round(Math.random() * 4);

  sparkle.className = "sparkle-dot";
  sparkle.style.setProperty("--sparkle-angle", `${angle}deg`);
  sparkle.style.setProperty("--sparkle-distance", `${distance}px`);
  sparkle.style.setProperty("--sparkle-delay", `${delay}ms`);
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;

  return sparkle;
}

export async function initFinaleAnimations({
  heartButton,
  sparkleLayer,
  reducedMotion
}: FinaleAnimationOptions): Promise<FinaleAnimationController> {
  let pulseTimer = 0;
  let sparkleTimer = 0;

  const pulseHeart = () => {
    if (!heartButton) {
      return;
    }

    heartButton.classList.remove("is-pulsing");
    void heartButton.offsetWidth;
    heartButton.classList.add("is-pulsing");

    if (pulseTimer) {
      window.clearTimeout(pulseTimer);
    }
    pulseTimer = window.setTimeout(() => {
      heartButton.classList.remove("is-pulsing");
    }, 460);
  };

  const playReveal = () => {
    pulseHeart();

    if (reducedMotion || !sparkleLayer) {
      return;
    }

    sparkleLayer.classList.remove("is-active");
    sparkleLayer.replaceChildren();

    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 10; index += 1) {
      fragment.appendChild(createSparkleNode(index));
    }
    sparkleLayer.appendChild(fragment);
    sparkleLayer.classList.add("is-active");

    if (sparkleTimer) {
      window.clearTimeout(sparkleTimer);
    }
    sparkleTimer = window.setTimeout(() => {
      sparkleLayer.classList.remove("is-active");
      sparkleLayer.replaceChildren();
    }, 1500);
  };

  return {
    playReveal,
    pulseHeart,
    cleanup: () => {
      if (pulseTimer) {
        window.clearTimeout(pulseTimer);
      }
      if (sparkleTimer) {
        window.clearTimeout(sparkleTimer);
      }
      if (heartButton) {
        heartButton.classList.remove("is-pulsing");
      }
      if (sparkleLayer) {
        sparkleLayer.classList.remove("is-active");
        sparkleLayer.replaceChildren();
      }
    }
  };
}
