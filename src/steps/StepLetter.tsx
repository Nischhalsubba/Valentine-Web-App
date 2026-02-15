import { useMemo, useState } from "react";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import type { StepComponentProps } from "../types/app";
import { localize } from "../utils/i18n";

function splitLines(value: string) {
  return value.split("\n").map((line) => line.trimEnd());
}

export default function StepLetter({
  content,
  mood,
  languageMode,
  onBack,
  onNext
}: StepComponentProps) {
  const variant = content.letter.variants[mood];
  const body = localize(variant.body, languageMode);
  const [revealedCount, setRevealedCount] = useState(0);

  const revealReasons = useMemo(
    () =>
      content.timeline.items.slice(0, 7).map((item) => ({
        id: item.id,
        text: localize(item.short, languageMode).primary
      })),
    [content.timeline.items, languageMode]
  );

  const revealedItems = revealReasons.slice(0, revealedCount);
  const revealAll = revealedCount >= revealReasons.length;
  const cta = localize(variant.cta, languageMode);

  const revealNext = () => {
    setRevealedCount((prev) => Math.min(prev + 1, revealReasons.length));
  };

  return (
    <StepShell
      eyebrow="Step 2"
      title={localize(content.letter.title, languageMode).primary}
      subtitle={localize(content.timeline.subtitle, languageMode).primary}
    >
      <article className="letter-sheet">
        <p className="letter-copy">
          {splitLines(body.primary).map((line, index) => (
            <span key={`en-${index}`}>
              {line || <>&nbsp;</>}
              <br />
            </span>
          ))}
        </p>
        {body.secondary ? (
          <p className="letter-copy letter-copy-secondary">
            {splitLines(body.secondary).map((line, index) => (
              <span key={`np-${index}`}>
                {line || <>&nbsp;</>}
                <br />
              </span>
            ))}
          </p>
        ) : null}
      </article>

      <section className="reason-section" aria-live="polite">
        <div className="reason-head">
          <h3>Tap to reveal the next one</h3>
          <p>
            {revealedCount}/{revealReasons.length}
          </p>
        </div>
        <div className="reason-control">
          <button className="btn btn-secondary" type="button" onClick={revealNext} disabled={revealAll}>
            {revealAll ? "All revealed" : "Reveal next reason"}
          </button>
          {revealAll ? <p className="reveal-complete">All revealed, mutu ❤️</p> : null}
        </div>
        <ul className="reason-list">
          {revealedItems.map((item, index) => (
            <li key={item.id} className="reason-row is-fresh">
              <span>Reason {index + 1}</span>
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      <StepActions onBack={onBack} onNext={onNext} nextLabel={cta.primary || "Continue"} />
    </StepShell>
  );
}
