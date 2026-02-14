import { useEffect, useRef, useState } from "react";
import { initFinaleAnimations } from "../animations/finaleAnimations";
import StepShell from "../components/StepShell";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { StepComponentProps } from "../types/content";

export default function StepFinale({
  content,
  onBack,
  onRestart
}: StepComponentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const riveCanvasRef = useRef<HTMLCanvasElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const holdTimerRef = useRef<number | null>(null);
  const revealFxRef = useRef<() => void>(() => {});
  const [revealed, setRevealed] = useState(false);
  const [holdText, setHoldText] = useState("");

  useEffect(() => {
    let disposed = false;
    let cleanup: () => void = () => {};

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
    };
  }, [reducedMotion]);

  const startHold = () => {
    if (revealed || holdTimerRef.current) {
      return;
    }
    setHoldText("Holding...");
    holdTimerRef.current = window.setTimeout(() => {
      setRevealed(true);
      setHoldText(content.finale.revealedLine);
      revealFxRef.current();
      holdTimerRef.current = null;
    }, 1500);
  };

  const cancelHold = () => {
    if (!holdTimerRef.current) {
      return;
    }
    window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
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
          <button
            className="btn btn-primary"
            type="button"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            disabled={revealed}
          >
            {revealed ? "Revealed" : content.finale.holdButton}
          </button>
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
