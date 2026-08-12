interface StepActionsProps {
  canBack?: boolean;
  canNext?: boolean;
  backLabel?: string;
  nextLabel?: string;
  onBack: () => void;
  onNext: () => void;
}

export default function StepActions({
  canBack = true,
  canNext = true,
  backLabel = "Back",
  nextLabel = "Next",
  onBack,
  onNext
}: StepActionsProps) {
  return (
    <div className="step-actions">
      <button className="btn btn-secondary" type="button" onClick={onBack} disabled={!canBack}>
        {backLabel}
      </button>
      <button className="btn btn-primary" type="button" onClick={onNext} disabled={!canNext}>
        {nextLabel}
      </button>
    </div>
  );
}
