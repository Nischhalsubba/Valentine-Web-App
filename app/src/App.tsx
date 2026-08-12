import {
  Suspense,
  lazy,
  type ComponentType,
  type FormEvent,
  type LazyExoticComponent,
  useEffect,
  useMemo,
  useState
} from "react";
import contentData from "./content/content.json";
import type { AppUnlocks, StepComponentProps } from "./types/app";
import type { LanguageMode, MoodMode, MutuContent } from "./types/mutu";
import { localize } from "./utils/i18n";
import { getJSON, setJSON } from "./utils/storage";
import { useReducedMotion, type MotionPreference } from "./hooks/useReducedMotion";

type StepLoader = () => Promise<{ default: ComponentType<StepComponentProps> }>;

const STEP_COMPONENTS: Record<string, StepLoader> = {
  step_cover: () => import("./steps/StepCover"),
  step_letter: () => import("./steps/StepLetter"),
  step_timeline: () => import("./steps/StepMemory"),
  step_gallery: () => import("./steps/StepGallery"),
  step_nurse: () => import("./steps/StepNurse"),
  step_play: () => import("./steps/StepQuiz"),
  step_promises: () => import("./steps/StepPromises"),
  step_finale: () => import("./steps/StepFinale")
};

const STORAGE_STEP = "mutu.progress.step";
const STORAGE_UNLOCKS = "mutu.unlocks";
const STORAGE_LANGUAGE = "mutu.settings.languageMode";
const STORAGE_MOOD = "mutu.settings.mood";
const STORAGE_MOTION = "mutu.settings.reducedMotion";

function clampStep(index: number, max: number): number {
  return Math.max(0, Math.min(index, max));
}

function fallbackStep(label: string): ComponentType<StepComponentProps> {
  return ({ onBack, onNext, onRestart }) => (
    <section className="panel">
      <p className="eyebrow">Fallback Step</p>
      <h2>{label}</h2>
      <p className="subtitle">This chapter failed to load. You can continue without losing progress.</p>
      <div className="step-actions">
        <button className="btn btn-secondary" type="button" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" type="button" onClick={onNext}>
          Continue
        </button>
        <button className="btn btn-secondary" type="button" onClick={onRestart}>
          Restart
        </button>
      </div>
    </section>
  );
}

function safeLazyStep(
  loader: StepLoader,
  fallbackLabel: string
): LazyExoticComponent<ComponentType<StepComponentProps>> {
  return lazy(async () => {
    try {
      return await loader();
    } catch {
      return { default: fallbackStep(fallbackLabel) };
    }
  });
}

function stepLoaderById(stepId: string): StepLoader {
  return STEP_COMPONENTS[stepId] ?? (() => Promise.resolve({ default: fallbackStep(stepId) }));
}

function readStoredMode<T extends string>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  const value = window.localStorage.getItem(key);
  return (value as T) || fallback;
}

export default function App() {
  const content = contentData as MutuContent;
  const steps = content.steps.filter((step) => Boolean(STEP_COMPONENTS[step.id]));
  const maxStepIndex = Math.max(0, steps.length - 1);

  const [languageMode, setLanguageMode] = useState<LanguageMode>(() =>
    readStoredMode(STORAGE_LANGUAGE, content.settings.languageModeDefault)
  );
  const [mood, setMood] = useState<MoodMode>(() => readStoredMode(STORAGE_MOOD, content.settings.moodDefault));
  const [motionPreference, setMotionPreference] = useState<MotionPreference>(() =>
    readStoredMode(STORAGE_MOTION, content.settings.reducedMotionDefault)
  );
  const reducedMotion = useReducedMotion(motionPreference);

  const [stepIndex, setStepIndex] = useState(() =>
    clampStep(getJSON<number>(STORAGE_STEP, 0), maxStepIndex)
  );
  const [unlocks, setUnlocks] = useState<AppUnlocks>(() => {
    const base = getJSON<AppUnlocks>(STORAGE_UNLOCKS, {
      gate: !content.gate.enabled,
      vault: false,
      futurePasscodes: {}
    });
    if (!content.gate.enabled) {
      return { ...base, gate: true };
    }
    return base;
  });
  const [gateInput, setGateInput] = useState("");
  const [gateHintVisible, setGateHintVisible] = useState(true);
  const [gateError, setGateError] = useState("");

  const stepDefinitions = useMemo(
    () =>
      steps.map((step, index) => {
        const copy = localize(step.label, languageMode);
        return {
          id: step.id,
          label: copy.primary,
          subtitle: copy.secondary,
          Component: safeLazyStep(stepLoaderById(step.id), `Step ${index + 1}`)
        };
      }),
    [languageMode, steps]
  );

  const currentStep = stepDefinitions[stepIndex] ?? stepDefinitions[0];
  const CurrentComponent = currentStep.Component;

  useEffect(() => {
    setJSON(STORAGE_STEP, stepIndex);
  }, [stepIndex]);

  useEffect(() => {
    setJSON(STORAGE_UNLOCKS, unlocks);
  }, [unlocks]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_LANGUAGE, languageMode);
  }, [languageMode]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_MOOD, mood);
  }, [mood]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_MOTION, motionPreference);
  }, [motionPreference]);

  useEffect(() => {
    const nextStep = stepDefinitions[stepIndex + 1];
    if (!nextStep) {
      return;
    }
    void stepLoaderById(nextStep.id)().catch(() => undefined);
  }, [stepDefinitions, stepIndex]);

  const goTo = (index: number) => setStepIndex(clampStep(index, maxStepIndex));
  const goNext = () => goTo(stepIndex + 1);
  const goBack = () => goTo(stepIndex - 1);
  const goStart = () => goTo(0);

  const handleUnlockVault = () => {
    setUnlocks((prev) => ({ ...prev, vault: true }));
  };

  const handleUpdateUnlocks = (partial: Partial<AppUnlocks>) => {
    setUnlocks((prev) => ({
      ...prev,
      ...partial,
      futurePasscodes: partial.futurePasscodes ?? prev.futurePasscodes
    }));
  };

  const handleGateSubmit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = gateInput.trim().toLowerCase();
    const accepted = content.gate.phraseOptions.map((value) => value.toLowerCase());
    if (!accepted.includes(normalized)) {
      setGateError(localize(content.gate.errorMessage, languageMode).primary);
      return;
    }

    setGateError("");
    setGateInput("");
    setUnlocks((prev) => ({ ...prev, gate: true }));
  };

  const stepProgress = steps.length > 1 ? (stepIndex / (steps.length - 1)) * 100 : 100;

  if (content.gate.enabled && !unlocks.gate) {
    const title = localize(content.gate.title, languageMode);
    const subtitle = localize(content.gate.subtitle, languageMode);
    const hint = localize(content.gate.hint, languageMode);
    return (
      <div className="app-shell access-shell">
        <div className="ambient ambient-a" aria-hidden />
        <div className="ambient ambient-b" aria-hidden />
        <section className="panel access-panel">
          <p className="eyebrow">Private Gate</p>
          <h1>{title.primary}</h1>
          {title.secondary ? <p className="bilingual-secondary">{title.secondary}</p> : null}
          <p className="subtitle">{subtitle.primary}</p>
          {subtitle.secondary ? <p className="bilingual-secondary">{subtitle.secondary}</p> : null}
          <form className="access-form" onSubmit={handleGateSubmit}>
            <label className="access-label" htmlFor="mutu-gate-input">
              {content.gate.pinMode === "phrase" ? "Phrase" : "PIN"}
            </label>
            <input
              id="mutu-gate-input"
              className="access-input"
              type="password"
              autoComplete="off"
              value={gateInput}
              onChange={(event) => {
                setGateInput(event.target.value);
                if (gateError) {
                  setGateError("");
                }
              }}
              placeholder={content.gate.pinMode === "phrase" ? "wana / mutu / 919" : "0000"}
              data-testid="access-pin-input"
            />
            <button className="btn btn-secondary" type="button" onClick={() => setGateHintVisible((prev) => !prev)}>
              {gateHintVisible ? "Hide hint" : "Show hint"}
            </button>
            {gateHintVisible ? (
              <p className="access-help">
                {hint.primary}
                {hint.secondary ? <span className="bilingual-secondary">{hint.secondary}</span> : null}
                <span className="bilingual-secondary">
                  Try: {content.gate.phraseOptions.join(" / ")}
                </span>
              </p>
            ) : null}
            {gateError ? (
              <p className="access-error" role="alert" data-testid="access-pin-error">
                {gateError}
              </p>
            ) : null}
            <button className="btn btn-primary" type="submit" data-testid="access-unlock-button">
              {localize(content.gate.successMessage, languageMode).primary}
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className={`app-shell mood-${mood} ${reducedMotion ? "is-rest-mode" : ""}`}>
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <div className="ambient ambient-c" aria-hidden />
      <div className="ambient ambient-d" aria-hidden />

      <header className="app-header">
        <div className="hero-copy">
          <p className="eyebrow">{localize(content.meta.appName, languageMode).primary}</p>
          <h1>{localize(content.cover.title, languageMode).primary}</h1>
          {languageMode === "mixed" ? (
            <p className="bilingual-secondary">{localize(content.cover.title, languageMode).secondary}</p>
          ) : null}
          <p className="hero-note">{localize(content.cover.subtitle, languageMode).primary}</p>
        </div>

        <div className="control-row">
          <label>
            Language
            <select
              className="select-control"
              value={languageMode}
              onChange={(event) => setLanguageMode(event.target.value as LanguageMode)}
            >
              <option value="mixed">Mixed</option>
              <option value="en">English</option>
              <option value="np">Nepali</option>
            </select>
          </label>

          <label>
            Mood
            <select
              className="select-control"
              value={mood}
              onChange={(event) => setMood(event.target.value as MoodMode)}
            >
              <option value="soft">Soft</option>
              <option value="funny">Funny</option>
              <option value="romantic">Romantic</option>
            </select>
          </label>

          <label>
            Motion
            <select
              className="select-control"
              value={motionPreference}
              onChange={(event) => setMotionPreference(event.target.value as MotionPreference)}
            >
              <option value="system">System</option>
              <option value="on">Reduced</option>
              <option value="off">Full</option>
            </select>
          </label>
        </div>

        <div className="stepper-frame">
          <div className="stepper-progress">
            <div className="stepper-progress-fill" style={{ width: `${stepProgress}%` }} />
          </div>
          <div className="stepper">
            {stepDefinitions.map((step, index) => (
              <button
                key={step.id}
                className={`step-pill ${index === stepIndex ? "is-active" : ""}`}
                type="button"
                onClick={() => goTo(index)}
                aria-current={index === stepIndex ? "step" : undefined}
              >
                <span>{index + 1}</span>
                {step.label}
              </button>
            ))}
          </div>
          <p className="step-meta">
            {stepIndex + 1} / {steps.length} steps
          </p>
        </div>
      </header>

      <main className="step-host">
        <Suspense fallback={<section className="panel">Loading chapter...</section>}>
          <CurrentComponent
            content={content}
            stepIndex={stepIndex}
            totalSteps={steps.length}
            languageMode={languageMode}
            mood={mood}
            reducedMotion={reducedMotion}
            unlocks={unlocks}
            onSetLanguageMode={setLanguageMode}
            onSetMood={setMood}
            onUnlockVault={handleUnlockVault}
            onUpdateUnlocks={handleUpdateUnlocks}
            onNext={goNext}
            onBack={goBack}
            onRestart={goStart}
          />
        </Suspense>
      </main>
    </div>
  );
}
