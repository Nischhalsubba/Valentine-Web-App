import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import type { StepComponentProps } from "../types/app";
import { localize } from "../utils/i18n";

export default function StepNurse({ content, languageMode, onBack, onNext }: StepComponentProps) {
  const title = localize(content.nurseAppreciation.title, languageMode);

  return (
    <StepShell eyebrow="Step 5" title={title.primary} subtitle="Nurse appreciation chapter">
      {title.secondary ? <p className="bilingual-secondary">{title.secondary}</p> : null}
      <div className="nurse-grid">
        {content.nurseAppreciation.sections.map((section) => {
          const heading = localize(section.heading, languageMode);
          const body = localize(section.body, languageMode);
          return (
            <article className="nurse-card" key={section.id}>
              <h3>{heading.primary}</h3>
              {heading.secondary ? <p className="bilingual-secondary">{heading.secondary}</p> : null}
              <p>{body.primary}</p>
              {body.secondary ? <p className="bilingual-secondary">{body.secondary}</p> : null}
            </article>
          );
        })}
      </div>
      <div className="audio-box">
        <p className="eyebrow">Audio Note</p>
        <audio controls preload="metadata" src={content.nurseAppreciation.audio} />
      </div>

      <StepActions onBack={onBack} onNext={onNext} nextLabel="Continue to play" />
    </StepShell>
  );
}
