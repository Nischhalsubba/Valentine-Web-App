import { Suspense, lazy, useMemo, useState, type ComponentType, type LazyExoticComponent } from "react";
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

function safeLazyStep(
  loader: () => Promise<{ default: ComponentType<StepComponentProps> }>,
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

const StepCover = safeLazyStep(() => import("./steps/StepCover"), "Step 1: Cover");
const StepLetter = safeLazyStep(() => import("./steps/StepLetter"), "Step 2: Letter");
const StepMemory = safeLazyStep(() => import("./steps/StepMemory"), "Step 3: Memory");
const StepQuiz = safeLazyStep(() => import("./steps/StepQuiz"), "Step 4: Quiz");
const StepFinale = safeLazyStep(() => import("./steps/StepFinale"), "Step 5: Finale");

type StepDefinition = {
  id: string;
  label: string;
  Component: LazyExoticComponent<ComponentType<StepComponentProps>>;
};

const stepDefinitions: StepDefinition[] = [
  { id: "cover", label: "Open", Component: StepCover },
  { id: "letter", label: "Relive", Component: StepLetter },
  { id: "memory", label: "Memory", Component: StepMemory },
  { id: "quiz", label: "Play", Component: StepQuiz },
  { id: "finale", label: "Promise", Component: StepFinale }
];

function clampStep(index: number, max: number): number {
  return Math.min(Math.max(index, 0), max);
}

export default function App() {
  const content = contentData as AppContent;
  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = stepDefinitions.length;

  const currentStep = useMemo(() => stepDefinitions[stepIndex], [stepIndex]);
  const CurrentComponent = currentStep.Component;

  const goNext = () => setStepIndex((prev) => clampStep(prev + 1, totalSteps - 1));
  const goBack = () => setStepIndex((prev) => clampStep(prev - 1, totalSteps - 1));
  const goTo = (index: number) => setStepIndex(clampStep(index, totalSteps - 1));

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />

      <header className="app-header">
        <p className="eyebrow">{content.meta.title}</p>
        <h1>{content.meta.coverLine}</h1>

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
      </header>

      <main className="step-host">
        <Suspense fallback={<section className="panel">Loading this chapter...</section>}>
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
