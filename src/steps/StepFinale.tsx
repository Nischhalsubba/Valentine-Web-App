import { useEffect, useRef, useState } from "react";
import { initFinaleAnimations } from "../animations/finaleAnimations";
import { MOTION_EASING, MOTION_MS } from "../animations/motionTokens";
import StepShell from "../components/StepShell";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { StepComponentProps } from "../types/content";

const HOLD_DURATION_MS = 1500;
const HOLD_RING_RADIUS = 54;
const HOLD_RING_CIRCUMFERENCE = 2 * Math.PI * HOLD_RING_RADIUS;

export default function StepFinale({
  content,
  onBack,
  onRestart
}: StepComponentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const riveCanvasRef = useRef<HTMLCanvasElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const holdFillRef = useRef<SVGCircleElement>(null);
  const holdAnimationRef = useRef<Animation | null>(null);
  const holdStartAtRef = useRef(0);
  const holdStartProgressRef = useRef(0);
  const holdProgressRef = useRef(0);
  const holdTimerRef = useRef<number | null>(null);
  const revealFxRef = useRef<() => void>(() => {});
  const [revealed, setRevealed] = useState(false);
  const [holdText, setHoldText] = useState("");

  const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

  const progressToOffset = (progress: number) =>
    HOLD_RING_CIRCUMFERENCE * (1 - clampProgress(progress));

  const applyProgress = (progress: number) => {
    const clamped = clampProgress(progress);
    holdProgressRef.current = clamped;
    if (holdFillRef.current) {
      holdFillRef.current.style.strokeDashoffset = String(progressToOffset(clamped));
    }
  };

  const readCurrentProgress = () => {
    const circle = holdFillRef.current;
    if (!circle) {
      return holdProgressRef.current;
    }

    const computed = window.getComputedStyle(circle).strokeDashoffset;
    const parsed = Number.parseFloat(computed);
    if (Number.isNaN(parsed)) {
      return holdProgressRef.current;
    }

    return clampProgress(1 - parsed / HOLD_RING_CIRCUMFERENCE);
  };

  const completeReveal = () => {
    setRevealed(true);
    setHoldText(content.finale.revealedLine);
    applyProgress(1);
    revealFxRef.current();
  };

  useEffect(() => {
    let disposed = false;
    let cleanup: () => void = () => {};
    applyProgress(0);

    void initFinaleAnimations({
      riveCanvas: riveCanvasRef.current,
      lottieContainer: lottieRef.current,
      threeCanvas: threeCanvasRef.current,
      reducedMotion
    }).then((controller) => {
      if (disposed) {
        controller.cleanup();
        return;
      }
      revealFxRef.current = controller.playReveal;
      cleanup = controller.cleanup;
    });

    return () => {
      disposed = true;
      cleanup();
      if (holdTimerRef.current) {
        window.clearTimeout(holdTimerRef.current);
      }
      holdAnimationRef.current?.cancel();
      holdAnimationRef.current = null;
    };
  }, [reducedMotion]);

  const startHold = () => {
    if (revealed) {
      return;
    }

    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    setHoldText("Holding...");

    if (
      reducedMotion ||
      !holdFillRef.current ||
      typeof holdFillRef.current.animate !== "function"
    ) {
      holdTimerRef.current = window.setTimeout(() => {
        completeReveal();
        holdTimerRef.current = null;
      }, HOLD_DURATION_MS);
      return;
    }

    const currentProgress = readCurrentProgress();
    applyProgress(currentProgress);
    holdAnimationRef.current?.cancel();

    if (currentProgress >= 1) {
      completeReveal();
      return;
    }

    holdStartProgressRef.current = currentProgress;
    holdStartAtRef.current = performance.now();

    const holdAnimation = holdFillRef.current.animate(
      [
        { strokeDashoffset: progressToOffset(currentProgress) },
        { strokeDashoffset: 0 }
      ],
      {
        duration: HOLD_DURATION_MS * (1 - currentProgress),
        easing: "linear",
        fill: "forwards"
      }
    );

    holdAnimationRef.current = holdAnimation;
    holdAnimation.onfinish = () => {
      holdAnimationRef.current = null;
      completeReveal();
    };
  };

  const cancelHold = () => {
    if (revealed) {
      return;
    }

    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
      setHoldText("Press and hold a little longer.");
      return;
    }

    if (
      reducedMotion ||
      !holdFillRef.current ||
      typeof holdFillRef.current.animate !== "function" ||
      !holdAnimationRef.current
    ) {
      applyProgress(0);
      setHoldText("Press and hold a little longer.");
      return;
    }

    const elapsed = performance.now() - holdStartAtRef.current;
    const currentProgress = clampProgress(holdStartProgressRef.current + elapsed / HOLD_DURATION_MS);
    applyProgress(currentProgress);
    holdAnimationRef.current.cancel();
    holdAnimationRef.current = null;

    const drainAnimation = holdFillRef.current.animate(
      [
        { strokeDashoffset: progressToOffset(currentProgress) },
        { strokeDashoffset: progressToOffset(0) }
      ],
      {
        duration: MOTION_MS.fast + 80,
        easing: MOTION_EASING.out,
        fill: "forwards"
      }
    );

    holdAnimationRef.current = drainAnimation;
    drainAnimation.onfinish = () => {
      holdAnimationRef.current = null;
      applyProgress(0);
    };

    setHoldText("Press and hold a little longer.");
  };

  return (
    <StepShell
      eyebrow="Step 5/5 - Promise"
      title={content.finale.heading}
      subtitle={content.finale.eyebrow}
    >
      <div className="coupon-grid">
        {content.coupons.map((coupon, index) => (
          <article className="coupon-card" key={coupon}>
            <p className="coupon-kicker">Coupon {index + 1}</p>
            {coupon}
          </article>
        ))}
      </div>

      <section className="finale-stage">
        <div className="finale-visual">
          <canvas ref={riveCanvasRef} className="rive-canvas" aria-label="Interactive heart visual" />
          <div ref={lottieRef} className="lottie-slot" aria-hidden />
          <canvas ref={threeCanvasRef} className="three-canvas" aria-hidden />
        </div>

        <div className="hold-area">
          <p>{content.finale.holdPrompt}</p>
          <div className="hold-cta">
            <svg className="hold-ring" viewBox="0 0 120 120" aria-hidden>
              <circle className="hold-ring-track" cx="60" cy="60" r={HOLD_RING_RADIUS} />
              <circle
                ref={holdFillRef}
                className="hold-ring-fill"
                cx="60"
                cy="60"
                r={HOLD_RING_RADIUS}
                style={{
                  strokeDasharray: HOLD_RING_CIRCUMFERENCE,
                  strokeDashoffset: HOLD_RING_CIRCUMFERENCE
                }}
              />
            </svg>
            <button
              className="btn btn-primary hold-button"
              type="button"
              onPointerDown={startHold}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              disabled={revealed}
            >
              {revealed ? "Revealed" : content.finale.holdButton}
            </button>
          </div>
          <p className="hold-text">{holdText}</p>
          <p className="finale-note">When you are ready, hold and keep it there.</p>
        </div>
      </section>

      <div className="step-actions">
        <button className="btn btn-secondary" type="button" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" type="button" onClick={onRestart}>
          Replay from start
        </button>
      </div>
    </StepShell>
  );
}
