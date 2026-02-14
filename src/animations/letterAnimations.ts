type Cleanup = () => void;

export async function initLetterAnimations(
  container: HTMLElement | null,
  reducedMotion: boolean
): Promise<Cleanup> {
  if (!container || reducedMotion) {
    return () => {};
  }

  try {
    const module = await import("@formkit/auto-animate");
    const autoAnimate = module.default;
    const controller: any = autoAnimate(container, {
      duration: 320,
      easing: "cubic-bezier(0.19, 1, 0.22, 1)"
    });

    return () => {
      if (typeof controller?.destroy === "function") {
        controller.destroy();
      } else if (typeof controller?.disable === "function") {
        controller.disable();
      }
    };
  } catch {
    return () => {};
  }
}
