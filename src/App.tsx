import {
  Suspense,
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

export default function App() {
  const content = contentData as AppContent;
  const totalSteps = stepDefinitions.length;
  const [stepIndex, setStepIndex] = useState(() => readStoredStep(totalSteps - 1));
  const [restMode, setRestMode] = useState(readRestMode);
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
