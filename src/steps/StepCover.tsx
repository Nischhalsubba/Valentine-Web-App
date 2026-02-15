import { useMemo, useState } from "react";
import MilestoneWidget from "../components/MilestoneWidget";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import type { StepComponentProps } from "../types/app";
import { localize } from "../utils/i18n";

export default function StepCover({
  content,
  stepIndex,
  languageMode,
  onBack,
  onNext
}: StepComponentProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [peek, setPeek] = useState(false);

  const copy = useMemo(
    () => ({
      title: localize(content.cover.title, languageMode),
      subtitle: localize(content.cover.subtitle, languageMode),
      helper: localize(content.cover.helper, languageMode),
      ctaPrimary: localize(content.cover.ctaPrimary, languageMode),
      ctaSecondary: localize(content.cover.ctaSecondary, languageMode),
      footer: localize(content.cover.footer, languageMode)
    }),
    [content.cover, languageMode]
  );

  const openEnvelope = () => {
    if (isOpening) {
      return;
    }
    setIsOpening(true);
    window.setTimeout(() => {
      onNext();
    }, 560);
  };

  return (
    <StepShell eyebrow="Step 1" title={copy.title.primary} subtitle={copy.subtitle.primary}>
      {copy.title.secondary ? <p className="bilingual-secondary">{copy.title.secondary}</p> : null}
      {copy.subtitle.secondary ? <p className="bilingual-secondary">{copy.subtitle.secondary}</p> : null}

      <div className="cover-stage">
        <div className={`envelope ${isOpening ? "is-open is-opening is-glowing" : ""}`} aria-hidden>
          <div className="envelope-wax" />
          <div className="envelope-flap" />
          <div className="envelope-pocket" />
          <div className="envelope-letter">
            <p>{copy.title.primary}</p>
          </div>
        </div>
      </div>

      <div className="centered-block">
        <button className={`btn btn-primary cover-cta ${isOpening ? "is-loading" : ""}`} type="button" onClick={openEnvelope}>
          <span className="cover-cta-label">{isOpening ? "Opening..." : copy.ctaPrimary.primary}</span>
          <span className="btn-spinner" aria-hidden />
        </button>
        <button className="btn btn-secondary cover-preview-btn" type="button" onClick={() => setPeek((prev) => !prev)}>
          {peek ? "Hide preview" : copy.ctaSecondary.primary}
        </button>
        {peek ? (
          <p className="cover-preview-copy">
            {copy.helper.primary}
            {copy.helper.secondary ? <span className="bilingual-secondary">{copy.helper.secondary}</span> : null}
          </p>
        ) : null}
        <p className="cover-hint">{copy.footer.primary}</p>
      </div>

      <MilestoneWidget milestones={content.milestones} timezone={content.meta.timezone} languageMode={languageMode} compact />

      <StepActions
        canBack={stepIndex > 0}
        canNext
        backLabel="Back"
        nextLabel="Skip Intro"
        onBack={onBack}
        onNext={onNext}
      />
    </StepShell>
  );
}
