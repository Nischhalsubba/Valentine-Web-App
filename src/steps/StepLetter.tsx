import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { initLetterAnimations } from "../animations/letterAnimations";
import { MOTION_EASING, MOTION_MS } from "../animations/motionTokens";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { StepComponentProps } from "../types/content";

const SpringReasonList = lazy(() => import("../components/SpringReasonList"));

export default function StepLetter({
  content,
  onBack,
  onNext
}: StepComponentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [revealedCount, setRevealedCount] = useState(0);
  const [latestReasonId, setLatestReasonId] = useState<string | null>(null);
  const [letterRead, setLetterRead] = useState(false);
  const reasons = content.reasons.slice(0, revealedCount).map((text, index) => ({
    id: `reason-${index}`,
    text,
    order: index + 1
  }));
  const letterRef = useRef<HTMLElement>(null);
  const reasonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: () => void = () => {};

    void initLetterAnimations(reasonContainerRef.current, reducedMotion).then((dispose) => {
      if (disposed) {
        dispose();
        return;
      }
      cleanup = dispose;
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const letter = letterRef.current;
    if (!letter) {
      return;
    }

    if (typeof letter.animate === "function") {
      letter.animate(
        reducedMotion
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: "translateY(10px)" },
              { opacity: 1, transform: "translateY(0px)" }
            ],
        {
          duration: reducedMotion ? 240 : MOTION_MS.ui,
          easing: MOTION_EASING.inOut,
          fill: "both"
        }
      );
    }

    const checkRead = () => {
      const hasReachedEnd = letter.scrollTop + letter.clientHeight >= letter.scrollHeight - 6;
      if (hasReachedEnd) {
        setLetterRead(true);
      }
    };

    checkRead();
    letter.addEventListener("scroll", checkRead, { passive: true });
    return () => {
      letter.removeEventListener("scroll", checkRead);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!latestReasonId) {
      return;
    }
    const timer = window.setTimeout(() => setLatestReasonId(null), 320);
    return () => window.clearTimeout(timer);
  }, [latestReasonId]);

  const revealNext = () => {
    setRevealedCount((prev) => {
      const next = Math.min(prev + 1, content.reasons.length);
      if (next > prev) {
        setLatestReasonId(`reason-${next - 1}`);
      }
      return next;
    });
  };

  const allRevealed = revealedCount >= content.reasons.length;

  return (
    <StepShell eyebrow="Step 2/5 - Relive" title={content.letter.heading} subtitle={content.letter.eyebrow}>
      <article ref={letterRef} className="letter-sheet">
        <p className="letter-copy">{content.letter.body}</p>
      </article>
      {!letterRead ? <p className="letter-progress-note">Scroll to the end of the letter to continue.</p> : null}

      <section className="reason-section">
        <div className="reason-head">
          <h3>{content.letter.revealPrompt}</h3>
          <p>{revealedCount} of {content.reasons.length} revealed</p>
        </div>
        <div className="reason-control">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={revealNext}
            disabled={allRevealed}
          >
            {allRevealed ? "All reasons revealed" : "Reveal next reason"}
          </button>
          <p className="reason-microcopy">
            {allRevealed ? "All revealed." : "Tap to reveal the next one."}
          </p>
          {allRevealed ? (
            <p className="reveal-complete" role="status">
              All revealed <span aria-hidden>done</span>
            </p>
          ) : null}
        </div>

        <div ref={reasonContainerRef} className="reason-container">
          <Suspense
            fallback={
              <ul className="reason-list">
                {reasons.map((reason) => (
                  <li key={reason.id}>
                    <span>Reason {reason.order}</span>
                    {reason.text}
                  </li>
                ))}
              </ul>
            }
          >
            <SpringReasonList reasons={reasons} latestId={latestReasonId} reducedMotion={reducedMotion} />
          </Suspense>
        </div>
      </section>

      <StepActions
        canNext={letterRead}
        onBack={onBack}
        onNext={onNext}
        nextLabel={letterRead ? (allRevealed ? "Continue" : "Skip to memory lane") : "Scroll to continue"}
      />
    </StepShell>
  );
}

