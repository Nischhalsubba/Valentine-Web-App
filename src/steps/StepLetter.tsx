import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { initLetterAnimations } from "../animations/letterAnimations";
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
  const reasons = content.reasons.slice(0, revealedCount);
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

  const revealNext = () => {
    setRevealedCount((prev) => Math.min(prev + 1, content.reasons.length));
  };

  const allRevealed = revealedCount >= content.reasons.length;

  return (
    <StepShell eyebrow="Step 2/5 - Relive" title={content.letter.heading} subtitle={content.letter.eyebrow}>
      <article className="letter-sheet">
        <p className="letter-copy">{content.letter.body}</p>
      </article>

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
        </div>

        <div ref={reasonContainerRef} className="reason-container">
          <Suspense
            fallback={
              <ul className="reason-list">
                {reasons.map((reason, index) => (
                  <li key={`${reason}-${index}`}>
                    <span>Reason {index + 1}</span>
                    {reason}
                  </li>
                ))}
              </ul>
            }
          >
            <SpringReasonList reasons={reasons} />
          </Suspense>
        </div>
      </section>

      <StepActions onBack={onBack} onNext={onNext} />
    </StepShell>
  );
}
