import {
  Suspense,
  type FormEvent,
  lazy,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type CSSProperties,
  type LazyExoticComponent
} from "react";
import contentData from "./content/content.json";
import StepActions from "./components/StepActions";
import type { AppContent, StepComponentProps } from "./types/content";

function FallbackStep(label: string): ComponentType<StepComponentProps> {
  return ({ onBack, onNext, onRestart }) => (
    <section className="panel">
      <p className="eyebrow">Fallback Mode</p>
      <h2>{label}</h2>
      <p className="subtitle">
        This step chunk failed to load. You can continue with the next step or restart.
      </p>
      <div className="step-actions">
        <button className="btn btn-secondary" type="button" onClick={onRestart}>
          Restart
        </button>
      </div>
      <StepActions onBack={onBack} onNext={onNext} />
    </section>
  );
}

function StepLoading() {
  return (
    <section className="panel panel-loading" aria-live="polite">
      <div className="soft-loader" aria-hidden>
        <span />
      </div>
      <p className="eyebrow">Loading</p>
      <h2>Opening the next chapter...</h2>
      <p className="subtitle">One moment while we prepare your next memory.</p>
    </section>
  );
}

type StepLoader = () => Promise<{ default: ComponentType<StepComponentProps> }>;

function safeLazyStep(
  loader: StepLoader,
  fallbackLabel: string
): LazyExoticComponent<ComponentType<StepComponentProps>> {
  return lazy(async () => {
    try {
      return await loader();
    } catch {
      return { default: FallbackStep(fallbackLabel) };
    }
  });
}

const coverLoader: StepLoader = () => import("./steps/StepCover");
const letterLoader: StepLoader = () => import("./steps/StepLetter");
const memoryLoader: StepLoader = () => import("./steps/StepMemory");
const quizLoader: StepLoader = () => import("./steps/StepQuiz");
const finaleLoader: StepLoader = () => import("./steps/StepFinale");

type StepDefinition = {
  id: string;
  label: string;
  Component: LazyExoticComponent<ComponentType<StepComponentProps>>;
  loader: StepLoader;
};

const stepDefinitions: StepDefinition[] = [
  { id: "cover", label: "Open", Component: safeLazyStep(coverLoader, "Step 1: Cover"), loader: coverLoader },
  { id: "letter", label: "Relive", Component: safeLazyStep(letterLoader, "Step 2: Letter"), loader: letterLoader },
  { id: "memory", label: "Memory", Component: safeLazyStep(memoryLoader, "Step 3: Memory"), loader: memoryLoader },
  { id: "quiz", label: "Play", Component: safeLazyStep(quizLoader, "Step 4: Quiz"), loader: quizLoader },
  { id: "finale", label: "Promise", Component: safeLazyStep(finaleLoader, "Step 5: Finale"), loader: finaleLoader }
];

const STEP_STORAGE_KEY = "valentine:active-step";
const REST_MODE_STORAGE_KEY = "valentine:rest-mode";
const ACCESS_UNLOCK_UNTIL_KEY = "valentine:access-unlocked-until";

function clampStep(index: number, max: number): number {
  return Math.min(Math.max(index, 0), max);
}

function readStoredStep(max: number) {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem(STEP_STORAGE_KEY);
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return clampStep(parsed, max);
}

function readRestMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(REST_MODE_STORAGE_KEY) === "true";
}

function readAccessUnlockState() {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = window.localStorage.getItem(ACCESS_UNLOCK_UNTIL_KEY);
  const unlockUntil = Number(raw);
  return Number.isFinite(unlockUntil) && unlockUntil > Date.now();
}

function resolveAccessPin(content: AppContent) {
  const envPin = import.meta.env.VITE_APP_PRIVATE_PIN?.trim();
  const fallbackPin = content.meta.lock?.fallbackPin?.trim();
  return envPin || fallbackPin || "";
}

export default function App() {
  const content = contentData as AppContent;
  const lockConfig = content.meta.lock;
  const isLockEnabled = lockConfig?.enabled ?? false;
  const accessPin = resolveAccessPin(content);
  const accessSessionHours = Math.max(1, lockConfig?.sessionHours ?? 12);
  const totalSteps = stepDefinitions.length;
  const [stepIndex, setStepIndex] = useState(() => readStoredStep(totalSteps - 1));
  const [restMode, setRestMode] = useState(readRestMode);
  const [isUnlocked, setIsUnlocked] = useState(() => !isLockEnabled || readAccessUnlockState());
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const stepProgress = (stepIndex / (totalSteps - 1)) * 100;

  const currentStep = useMemo(() => stepDefinitions[stepIndex], [stepIndex]);
  const CurrentComponent = currentStep.Component;

  useEffect(() => {
    const nextStep = stepDefinitions[stepIndex + 1];
    if (!nextStep) {
      return;
    }
    void nextStep.loader().catch(() => {
      // Allow lazy fallback to handle chunk errors.
    });
  }, [stepIndex]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STEP_STORAGE_KEY, String(stepIndex));
  }, [stepIndex]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(REST_MODE_STORAGE_KEY, String(restMode));
  }, [restMode]);

  const goNext = () => setStepIndex((prev) => clampStep(prev + 1, totalSteps - 1));
  const goBack = () => setStepIndex((prev) => clampStep(prev - 1, totalSteps - 1));
  const goTo = (index: number) => setStepIndex(clampStep(index, totalSteps - 1));

  const unlockApp = (event: FormEvent) => {
    event.preventDefault();

    if (!accessPin) {
      setPinError("PIN is not configured. Set VITE_APP_PRIVATE_PIN or meta.lock.fallbackPin.");
      return;
    }

    if (pinInput.trim() !== accessPin) {
      setPinError("Wrong PIN. Try our private code.");
      return;
    }

    if (typeof window !== "undefined") {
      const unlockUntil = Date.now() + accessSessionHours * 60 * 60 * 1000;
      window.localStorage.setItem(ACCESS_UNLOCK_UNTIL_KEY, String(unlockUntil));
    }

    setPinError("");
    setPinInput("");
    setIsUnlocked(true);
  };

  const relockApp = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_UNLOCK_UNTIL_KEY);
    }
    setIsUnlocked(false);
  };

  if (isLockEnabled && !isUnlocked) {
    return (
      <div className="app-shell access-shell">
        <div className="ambient ambient-a" aria-hidden />
        <div className="ambient ambient-b" aria-hidden />
        <section className="panel access-panel" aria-labelledby="private-title">
          <p className="eyebrow">Private Access</p>
          <h1 id="private-title">Mutu Memoir is locked</h1>
          <p className="subtitle">{lockConfig?.hint ?? "Enter your private PIN to open this memory space."}</p>
          <form className="access-form" onSubmit={unlockApp}>
            <label className="access-label" htmlFor="access-pin">
              Private PIN
            </label>
            <input
              id="access-pin"
              className="access-input"
              type="password"
              autoComplete="off"
              value={pinInput}
              onChange={(event) => {
                setPinInput(event.target.value);
                if (pinError) {
                  setPinError("");
                }
              }}
              placeholder="Enter PIN"
              aria-describedby="access-help"
              aria-invalid={Boolean(pinError)}
              data-testid="access-pin-input"
            />
            <p id="access-help" className="access-help">
              Session stays unlocked for {accessSessionHours} hours on this device.
            </p>
            {pinError ? (
              <p className="access-error" role="alert" data-testid="access-pin-error">
                {pinError}
              </p>
            ) : null}
            <button className="btn btn-primary" type="submit" data-testid="access-unlock-button">
              Unlock our story
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className={`app-shell ${restMode ? "is-rest-mode" : ""}`}>
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <div className="ambient ambient-c" aria-hidden />
      <div className="ambient ambient-d" aria-hidden />

      <header className="app-header">
        <div className="hero-copy">
          <p className="eyebrow">{content.meta.title}</p>
          <h1>{content.meta.coverLine}</h1>
          <p className="hero-note">Open, relive, play, and promise.</p>
          <button
            className={`rest-toggle ${restMode ? "is-on" : ""}`}
            type="button"
            onClick={() => setRestMode((prev) => !prev)}
            aria-pressed={restMode}
            aria-label={restMode ? "Rest mode on. Tap to turn off." : "Rest mode off. Tap to reduce motion."}
          >
            {restMode ? "Rest mode on" : "Rest mode"}
          </button>
          <p className="rest-note">Rest mode reduces visual motion for a calmer reading experience.</p>
          {isLockEnabled ? (
            <button className="lock-toggle" type="button" onClick={relockApp} aria-label="Lock this app">
              Lock app
            </button>
          ) : null}
        </div>

        <div className="stepper-frame">
          <div className="stepper-progress">
            <div
              className="stepper-progress-fill"
              style={{ width: `${stepProgress}%` } as CSSProperties}
              aria-hidden
            />
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
            Chapter {stepIndex + 1} of {totalSteps}
          </p>
        </div>
      </header>

      <main className="step-host">
        <Suspense fallback={<StepLoading />}>
          <CurrentComponent
            content={content}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            onNext={goNext}
            onBack={goBack}
            onRestart={() => goTo(0)}
          />
        </Suspense>
      </main>
    </div>
  );
}
