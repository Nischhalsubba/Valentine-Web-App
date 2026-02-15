import { useEffect, useRef, useState } from "react";
import { initCoverAnimations, playEnvelopeOpen } from "../animations/coverAnimations";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { StepComponentProps } from "../types/content";

export default function StepCover({
  content,
  stepIndex,
  onBack,
  onNext
}: StepComponentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const envelopeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const openTimerRef = useRef<number | null>(null);
  const [opened, setOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    let disposed = false;
    let cleanup: () => void = () => {};

    void initCoverAnimations({
      envelope: envelopeRef.current,
      ctaButton: ctaRef.current,
      reducedMotion
    }).then((dispose) => {
      if (disposed) {
        dispose();
        return;
      }
      cleanup = dispose;
    });

    return () => {
      disposed = true;
      cleanup();
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, [reducedMotion]);

  const handleOpen = () => {
    if (opened || isOpening) {
      return;
    }

    setOpened(true);
    setIsOpening(true);
    const openDuration = playEnvelopeOpen({
      envelope: envelopeRef.current,
      letter: letterRef.current,
      reducedMotion
    });

    if (reducedMotion) {
      onNext();
      return;
    }

    const transitionDelay = Math.min(Math.max(openDuration || 620, 560), 900);
    openTimerRef.current = window.setTimeout(onNext, transitionDelay);
  };

  return (
    <StepShell eyebrow="Step 1/5 - Open" title={content.meta.coverLine} subtitle={content.meta.tagline}>
      <div className="cover-stage">
        <div ref={envelopeRef} className={`envelope ${opened ? "is-open" : ""}`} aria-hidden>
          <div className="envelope-wax" />
          <div className="envelope-flap" />
          <div className="envelope-pocket" />
          <div ref={letterRef} className="envelope-letter">
            <p>{content.meta.title}</p>
          </div>
        </div>
      </div>

      <div className="centered-block">
        <button
          ref={ctaRef}
          className={`btn btn-primary cover-cta ${isOpening ? "is-loading" : ""}`}
          type="button"
          onClick={handleOpen}
          disabled={isOpening}
        >
          <span className="cover-cta-label">{isOpening ? "Opening..." : content.meta.openButton}</span>
          <span className="btn-spinner" aria-hidden />
        </button>
        <p className="cover-hint">Tap slowly, like opening a real letter.</p>
      </div>

      <StepActions
        canBack={stepIndex > 0}
        canNext
        backLabel="Back"
        nextLabel="Skip intro"
        onBack={onBack}
        onNext={onNext}
      />
    </StepShell>
  );
}
