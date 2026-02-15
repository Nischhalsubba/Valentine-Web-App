import { useEffect, useMemo, useRef, useState } from "react";
import StepShell from "../components/StepShell";
import type { StepComponentProps } from "../types/app";
import type { MoodMode } from "../types/mutu";
import { localize } from "../utils/i18n";
import { getJSON, mergeJSON, setJSON } from "../utils/storage";

const HOLD_MS = 1500;
const NOTES_KEY = "mutu.user.notes";
const UNLOCKS_KEY = "mutu.unlocks";

export default function StepFinale({
  content,
  languageMode,
  mood,
  unlocks,
  onSetMood,
  onUnlockVault,
  onUpdateUnlocks,
  onBack,
  onRestart
}: StepComponentProps) {
  const [revealed, setRevealed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [heartTaps, setHeartTaps] = useState(unlocks.vault ? content.vault.unlock.count : 0);
  const [futureCode, setFutureCode] = useState("");
  const [futurePasscodes, setFuturePasscodes] = useState<Record<string, boolean>>(unlocks.futurePasscodes);
  const [notes, setNotes] = useState<string>(() => getJSON<string>(NOTES_KEY, ""));
  const [saved, setSaved] = useState(false);
  const holdStartRef = useRef<number | null>(null);
  const holdFrameRef = useRef<number | null>(null);
  const holdDrainRef = useRef<number | null>(null);

  const currentVariant = content.finale.variants[mood];
  const ringOffset = 1 - holdProgress;

  useEffect(() => {
    return () => {
      if (holdFrameRef.current) {
        window.cancelAnimationFrame(holdFrameRef.current);
      }
      if (holdDrainRef.current) {
        window.cancelAnimationFrame(holdDrainRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!saved) {
      return;
    }
    const timer = window.setTimeout(() => setSaved(false), 1200);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const startHold = () => {
    if (revealed) {
      return;
    }
    if (holdDrainRef.current) {
      window.cancelAnimationFrame(holdDrainRef.current);
      holdDrainRef.current = null;
    }
    holdStartRef.current = performance.now() - holdProgress * HOLD_MS;

    const tick = (now: number) => {
      if (holdStartRef.current === null) {
        return;
      }

      const elapsed = now - holdStartRef.current;
      const progress = Math.max(0, Math.min(1, elapsed / HOLD_MS));
      setHoldProgress(progress);

      if (progress >= 1) {
        setRevealed(true);
        holdFrameRef.current = null;
        return;
      }

      holdFrameRef.current = window.requestAnimationFrame(tick);
    };

    holdFrameRef.current = window.requestAnimationFrame(tick);
  };

  const stopHold = () => {
    if (revealed) {
      return;
    }
    if (holdFrameRef.current) {
      window.cancelAnimationFrame(holdFrameRef.current);
      holdFrameRef.current = null;
    }
    holdStartRef.current = null;

    const from = holdProgress;
    const start = performance.now();
    const duration = Math.max(220, 280 + from * 260);

    const drain = (now: number) => {
      const elapsed = now - start;
      const progress = Math.max(0, 1 - elapsed / duration);
      setHoldProgress(from * progress);
      if (progress <= 0) {
        holdDrainRef.current = null;
        return;
      }
      holdDrainRef.current = window.requestAnimationFrame(drain);
    };

    holdDrainRef.current = window.requestAnimationFrame(drain);
  };

  const tapHeart = () => {
    setHeartTaps((prev) => {
      const next = Math.min(prev + 1, content.vault.unlock.count);
      if (next >= content.vault.unlock.count && !unlocks.vault) {
        onUnlockVault();
      }
      return next;
    });
  };

  const unlockedFutureByDate = useMemo(() => {
    const now = Date.now();
    return content.futureTimeline.items.reduce<Record<string, boolean>>((acc, item) => {
      if (item.unlock.type === "date" && item.unlock.dateISO) {
        acc[item.id] = now >= new Date(item.unlock.dateISO).getTime();
      }
      return acc;
    }, {});
  }, [content.futureTimeline.items]);

  const unlockFutureByPasscode = () => {
    if (!futureCode.trim()) {
      return;
    }
    const normalized = futureCode.trim().toLowerCase();
    const accepted = content.gate.phraseOptions.map((value) => value.toLowerCase());
    if (!accepted.includes(normalized)) {
      return;
    }

    const unlockedByCode = content.futureTimeline.items
      .filter((item) => item.unlock.type === "passcode")
      .reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = true;
        return acc;
      }, {});
    const nextPasscodes = { ...futurePasscodes, ...unlockedByCode };
    setFuturePasscodes(nextPasscodes);
    mergeJSON(UNLOCKS_KEY, { futurePasscodes: nextPasscodes });
    onUpdateUnlocks({ futurePasscodes: nextPasscodes });
    setFutureCode("");
  };

  const saveNotes = () => {
    setJSON(NOTES_KEY, notes);
    setSaved(true);
  };

  return (
    <StepShell
      eyebrow="Step 8"
      title={localize(content.finale.title, languageMode).primary}
      subtitle="Final reveal + vault"
    >
      <section className="ending-choices">
        {content.finale.choices.map((choice) => (
          <button
            key={choice.id}
            className={`jump-pill ${mood === choice.id ? "is-active" : ""}`}
            type="button"
            onClick={() => onSetMood(choice.id as MoodMode)}
          >
            {localize(choice.label, languageMode).primary}
          </button>
        ))}
      </section>

      <section className="finale-stage">
        <div className="finale-visual">
          <h3>{localize(currentVariant.headline, languageMode).primary}</h3>
          <p>{localize(currentVariant.body, languageMode).primary}</p>
          {languageMode === "mixed" ? (
            <p className="bilingual-secondary">{localize(currentVariant.body, languageMode).secondary}</p>
          ) : null}
          <div className="hold-cta">
            <svg className="hold-ring" viewBox="0 0 120 120" aria-hidden>
              <circle className="hold-ring-track" cx="60" cy="60" r="54" />
              <circle
                className="hold-ring-fill"
                cx="60"
                cy="60"
                r="54"
                style={{
                  strokeDasharray: 339.292,
                  strokeDashoffset: 339.292 * ringOffset
                }}
              />
            </svg>
            <button
              className="btn btn-primary hold-button"
              type="button"
              onPointerDown={startHold}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              onPointerCancel={stopHold}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  startHold();
                }
              }}
              onKeyUp={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  stopHold();
                }
              }}
            >
              {revealed ? "Revealed" : "Hold to reveal"}
            </button>
          </div>
          <p className={`finale-reveal ${revealed ? "is-visible" : ""}`}>
            {revealed ? localize(currentVariant.body, languageMode).primary : "Hold 1.5s to reveal the final line."}
          </p>
        </div>

        <div className="hold-area">
          <p className="eyebrow">{localize(content.vault.title, languageMode).primary}</p>
          <button className={`heart-button ${unlocks.vault ? "is-pulsing" : ""}`} type="button" onClick={tapHeart}>
            ❤️
          </button>
          <p className="easter-progress">
            {unlocks.vault
              ? localize(content.vault.unlock.successMessage, languageMode).primary
              : `${heartTaps}/${content.vault.unlock.count} taps`}
          </p>
          {unlocks.vault ? (
            <div className="vault-grid">
              {content.vault.items.map((item) => (
                <article key={item.id} className="easter-egg-card">
                  <h4>{localize(item.title, languageMode).primary}</h4>
                  <p>{localize(item.body, languageMode).primary}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="easter-egg-hint">{localize(content.vault.subtitle, languageMode).primary}</p>
          )}
        </div>
      </section>

      <section className="future-grid">
        <header>
          <h3>{localize(content.futureTimeline.title, languageMode).primary}</h3>
          <p>{localize(content.futureTimeline.subtitle, languageMode).primary}</p>
        </header>
        <div className="future-unlock">
          <input
            className="memory-search"
            value={futureCode}
            onChange={(event) => setFutureCode(event.target.value)}
            placeholder="Enter future unlock code"
          />
          <button className="btn btn-secondary" type="button" onClick={unlockFutureByPasscode}>
            Unlock by code
          </button>
        </div>
        <div className="memory-grid">
          {content.futureTimeline.items.map((item) => {
            const unlocked =
              unlockedFutureByDate[item.id] ||
              Boolean(futurePasscodes[item.id]) ||
              !item.locked;
            return (
              <article key={item.id} className={`memory-face memory-front ${unlocked ? "" : "future-locked"}`}>
                <h4>{localize(item.title, languageMode).primary}</h4>
                <p>{localize(item.short, languageMode).primary}</p>
                {!unlocked ? (
                  <p className="memory-lock-note">
                    {item.unlock.type === "date"
                      ? `Unlocks on ${new Date(item.unlock.dateISO ?? "").toLocaleDateString("en-US", {
                          dateStyle: "medium"
                        })}`
                      : item.unlock.codeHint ?? "Unlock with passcode"}
                  </p>
                ) : (
                  <p className="memory-reaction-chip">Unlocked</p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="writeback-box">
        <h3>{localize(content.writeBack.title, languageMode).primary}</h3>
        <p>{localize(content.writeBack.subtitle, languageMode).primary}</p>
        <textarea
          className="writeback-textarea"
          value={notes}
          placeholder={localize(content.writeBack.placeholders, languageMode).primary}
          onChange={(event) => setNotes(event.target.value)}
        />
        <div className="step-actions">
          <button className="btn btn-secondary" type="button" onClick={() => {
            setNotes("");
            setJSON(NOTES_KEY, "");
          }}>
            {localize(content.writeBack.ctaClear, languageMode).primary}
          </button>
          <button className="btn btn-primary" type="button" onClick={saveNotes}>
            {localize(content.writeBack.ctaSave, languageMode).primary}
          </button>
        </div>
        {saved ? <p className="reveal-complete">{localize(content.writeBack.savedToast, languageMode).primary}</p> : null}
      </section>

      <div className="step-actions">
        <button className="btn btn-secondary" type="button" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" type="button" onClick={onRestart}>
          {localize(currentVariant.ctaPrimary, languageMode).primary}
        </button>
      </div>
    </StepShell>
  );
}
