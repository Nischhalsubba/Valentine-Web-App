interface FinaleAnimationOptions {
  riveCanvas: HTMLCanvasElement | null;
  lottieContainer: HTMLDivElement | null;
  threeCanvas: HTMLCanvasElement | null;
  reducedMotion: boolean;
}

interface FinaleAnimationController {
  playReveal: () => void;
  cleanup: () => void;
}

export async function initFinaleAnimations({
  riveCanvas,
  lottieContainer,
  threeCanvas,
  reducedMotion
}: FinaleAnimationOptions): Promise<FinaleAnimationController> {
  const cleanups: Array<() => void> = [];
  let lottieInstance: any = null;

  if (!reducedMotion && riveCanvas) {
    try {
      const riveModule: any = await import("@rive-app/canvas");
      const RiveCtor =
        riveModule.Rive ?? riveModule.default?.Rive ?? riveModule.default;

      const rive = new RiveCtor({
        canvas: riveCanvas,
        autoplay: true,
        src: "https://cdn.rive.app/animations/vehicles.riv"
      });

      const onPress = () => rive.play?.();
      riveCanvas.addEventListener("pointerdown", onPress);
      cleanups.push(() => riveCanvas.removeEventListener("pointerdown", onPress));
      cleanups.push(() => rive.cleanup?.());
    } catch {
      // Fallback is the static canvas styling.
    }
  }

  if (!reducedMotion && lottieContainer) {
    try {
      const lottieModule: any = await import("lottie-web");
      const lottie = lottieModule.default ?? lottieModule;
      lottieInstance = lottie.loadAnimation({
        container: lottieContainer,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "https://assets8.lottiefiles.com/packages/lf20_jbrw3hcz.json"
      });

      cleanups.push(() => lottieInstance?.destroy?.());
    } catch {
      // Fallback remains static.
    }
  }

  if (!reducedMotion && threeCanvas) {
    try {
      const three: any = await import("three");
      const renderer = new three.WebGLRenderer({
        canvas: threeCanvas,
        alpha: true,
        antialias: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(240, 160, false);

      const scene = new three.Scene();
      const camera = new three.PerspectiveCamera(55, 240 / 160, 0.1, 100);
      camera.position.z = 2.5;

      const geometry = new three.TorusKnotGeometry(0.6, 0.2, 120, 12);
      const material = new three.MeshStandardMaterial({
        color: "#c26f4a",
        metalness: 0.18,
        roughness: 0.4
      });
      const knot = new three.Mesh(geometry, material);
      scene.add(knot);

      const keyLight = new three.DirectionalLight(0xffffff, 1.1);
      keyLight.position.set(1.8, 2, 2);
      scene.add(keyLight);
      scene.add(new three.AmbientLight(0xffffff, 0.55));

      let raf = 0;
      const tick = () => {
        knot.rotation.x += 0.008;
        knot.rotation.y += 0.01;
        renderer.render(scene, camera);
        raf = window.requestAnimationFrame(tick);
      };
      tick();

      cleanups.push(() => window.cancelAnimationFrame(raf));
      cleanups.push(() => geometry.dispose());
      cleanups.push(() => material.dispose());
      cleanups.push(() => renderer.dispose());
    } catch {
      // Fallback remains static.
    }
  }

  return {
    playReveal: () => {
      if (lottieInstance && typeof lottieInstance.goToAndPlay === "function") {
        lottieInstance.goToAndPlay(0, true);
      }
    },
    cleanup: () => {
      cleanups.forEach((dispose) => dispose());
    }
  };
}
