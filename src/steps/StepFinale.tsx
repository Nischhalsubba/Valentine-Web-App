import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { initFinaleAnimations } from "../animations/finaleAnimations";
import StepShell from "../components/StepShell";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { StepComponentProps } from "../types/content";

const HOLD_DURATION_MS = 1500;
const HOLD_RING_RADIUS = 54;
const HOLD_RING_CIRCUMFERENCE = 2 * Math.PI * HOLD_RING_RADIUS;
const COUPON_STORAGE_KEY = "valentine:coupons";
const EASTER_EGG_STORAGE_KEY = "valentine:easter-egg";

export default function StepFinale({
  content,
  onBack,
  onRestart
}: StepComponentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const holdFillRef = useRef<SVGCircleElement>(null);
  const holdRafRef = useRef<number | null>(null);
  const drainRafRef = useRef<number | null>(null);
  const holdStartAtRef = useRef(0);
  const holdStartProgressRef = useRef(0);
  const holdProgressRef = useRef(0);
  const revealFxRef = useRef<() => void>(() => {});
  const pulseHeartRef = useRef<() => void>(() => {});
  const heartButtonRef = useRef<HTMLButtonElement>(null);
  const sparkleLayerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [holdText, setHoldText] = useState("");
  const [heartTapCount, setHeartTapCount] = useState(0);
  const [eggUnlocked, setEggUnlocked] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(EASTER_EGG_STORAGE_KEY) === "true";
  });
  const [collectedCoupons, setCollectedCoupons] = useState<boolean[]>(() => {
    if (typeof window === "undefined") {
      return content.coupons.map(() => false);
    }

    try {
      const raw = window.localStorage.getItem(COUPON_STORAGE_KEY);
      const parsed = JSON.parse(raw ?? "[]");
      if (!Array.isArray(parsed)) {
        return content.coupons.map(() => false);
      }
      return content.coupons.map((_, index) => Boolean(parsed[index]));
    } catch {
      return content.coupons.map(() => false);
    }
  });

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

  const stopHoldLoop = () => {
    if (holdRafRef.current !== null) {
      window.cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
  };

  const stopDrainLoop = () => {
    if (drainRafRef.current !== null) {
      window.cancelAnimationFrame(drainRafRef.current);
      drainRafRef.current = null;
    }
  };

  const completeReveal = () => {
    setRevealed(true);
    setHoldText(content.finale.revealedLine);
    applyProgress(1);
    revealFxRef.current();
  };

  const drainProgress = (fromProgress: number) => {
    stopDrainLoop();

    const start = performance.now();
    const duration = Math.max(220, Math.round(260 + fromProgress * 340));

    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = clampProgress(elapsed / duration);
      const eased = 1 - Math.pow(1 - raw, 3);
      const next = fromProgress * (1 - eased);
      applyProgress(next);

      if (raw < 1) {
        drainRafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      applyProgress(0);
      drainRafRef.current = null;
    };

    drainRafRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => {
    let disposed = false;
    let cleanup: () => void = () => {};
    applyProgress(0);

    void initFinaleAnimations({
      heartButton: heartButtonRef.current,
      sparkleLayer: sparkleLayerRef.current,
      reducedMotion
    }).then((controller) => {
      if (disposed) {
        controller.cleanup();
        return;
      }

      revealFxRef.current = controller.playReveal;
      pulseHeartRef.current = controller.pulseHeart;
      cleanup = controller.cleanup;
    });

    return () => {
      disposed = true;
      cleanup();
      stopHoldLoop();
      stopDrainLoop();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(collectedCoupons));
  }, [collectedCoupons]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(EASTER_EGG_STORAGE_KEY, String(eggUnlocked));
  }, [eggUnlocked]);

  const startHold = () => {
    if (revealed) {
      return;
    }

    stopDrainLoop();
    stopHoldLoop();
    setHoldText("Holding...");

    holdStartProgressRef.current = holdProgressRef.current;
    holdStartAtRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - holdStartAtRef.current;
      const next = clampProgress(holdStartProgressRef.current + elapsed / HOLD_DURATION_MS);
      applyProgress(next);

      if (next >= 1) {
        stopHoldLoop();
        completeReveal();
        return;
      }

      holdRafRef.current = window.requestAnimationFrame(tick);
    };

    holdRafRef.current = window.requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    if (revealed) {
      return;
    }

    stopHoldLoop();
    const current = holdProgressRef.current;
    setHoldText("Press and hold a little longer.");

    if (current <= 0) {
      return;
    }

    drainProgress(current);
  };

  const handleHoldKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.repeat) {
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      startHold();
    }
  };

  const handleHoldKeyUp = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      cancelHold();
    }
  };

  const toggleCoupon = (index: number) => {
    setCollectedCoupons((prev) => prev.map((value, idx) => (idx === index ? !value : value)));
  };

  const handleHeartTap = () => {
    pulseHeartRef.current();
    setHeartTapCount((prev) => {
      const next = Math.min(prev + 1, 7);
      if (next >= 7) {
        setEggUnlocked(true);
      }
      return next;
    });
  };

  return (
    <StepShell
      eyebrow="Step 5/5 - Promise"
      title={content.finale.heading}
      subtitle={content.finale.eyebrow}
    >
      <div className="coupon-grid">
        {content.coupons.map((coupon, index) => {
          const collected = collectedCoupons[index];
          return (
            <button
              className={`coupon-card ${collected ? "is-collected" : ""}`}
              key={coupon}
              type="button"
              aria-pressed={collected}
              aria-label={`Coupon ${index + 1}: ${coupon}. ${collected ? "Redeemed" : "Not redeemed"}`}
              onClick={() => toggleCoupon(index)}
            >
              <p className="coupon-kicker">Coupon {index + 1}</p>
              <p>{coupon}</p>
              <span className="coupon-state">{collected ? "Redeemed" : "Tap to redeem"}</span>
            </button>
          );
        })}
      </div>

      <section className="finale-stage">
        <div className="finale-visual">
          <div className="heart-stage">
            <div ref={sparkleLayerRef} className="sparkle-layer" aria-hidden />
            <button
              ref={heartButtonRef}
              className="heart-button"
              type="button"
              onClick={handleHeartTap}
              aria-label="Interactive heart"
            >
              {"<3"}
            </button>
          </div>
          <p className="easter-progress">
            {eggUnlocked ? "Secret unlocked" : `${heartTapCount}/7 taps to unlock the secret`}
          </p>
          <p className={`finale-reveal ${revealed ? "is-visible" : ""}`}>
            {revealed ? content.finale.revealedLine : "Hold to reveal your final line."}
          </p>
          {eggUnlocked ? (
            <div className="easter-egg-card" role="status" aria-live="polite">
              <h4>{content.easterEgg.title}</h4>
              <p>{content.easterEgg.message}</p>
            </div>
          ) : (
            <p className="easter-egg-hint">{content.easterEgg.hint}</p>
          )}
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
              onKeyDown={handleHoldKeyDown}
              onKeyUp={handleHoldKeyUp}
              onBlur={cancelHold}
              disabled={revealed}
            >
              {revealed ? "Revealed" : content.finale.holdButton}
            </button>
          </div>
          <p className="hold-text">{holdText}</p>
          <p className="finale-note">Hold for 1.5s to reveal, and release to rewind smoothly.</p>
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
