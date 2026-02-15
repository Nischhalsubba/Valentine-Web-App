import { useEffect, useMemo, useRef, useState } from "react";
import { animateAnswerFeedback, animateQuestionSwap } from "../animations/quizAnimations";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { StepComponentProps } from "../types/content";

export default function StepQuiz({
  content,
  onBack,
  onNext
}: StepComponentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

  const currentQuestion = content.quiz[questionIndex];
  const questionProgress = ((questionIndex + 1) / content.quiz.length) * 100;

  useEffect(() => {
    if (completed) {
      return;
    }
    void animateQuestionSwap(questionRef.current, reducedMotion);
  }, [questionIndex, reducedMotion, completed]);

  const message = useMemo(() => {
    if (score >= 8) {
      return content.quizMessages.high;
    }
    if (score >= 5) {
      return content.quizMessages.mid;
    }
    return content.quizMessages.low;
  }, [content.quizMessages.high, content.quizMessages.low, content.quizMessages.mid, score]);

  const handleOption = (option: string, target: HTMLButtonElement) => {
    setSelectedOption(option);
    target.parentElement
      ?.querySelectorAll<HTMLButtonElement>(".quiz-option")
      .forEach((node) => node.classList.remove("is-correct", "is-wrong"));
    void animateAnswerFeedback(target, option === currentQuestion.answer, reducedMotion);
  };

  const nextQuestion = () => {
    if (!selectedOption) {
      return;
    }

    if (selectedOption === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }

    if (questionIndex >= content.quiz.length - 1) {
      setCompleted(true);
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setSelectedOption("");
  };

  return (
    <StepShell
      eyebrow="Step 4/5 - Play"
      title="Relationship quiz"
      subtitle="One personal question at a time."
    >
      {!completed ? (
        <div className="quiz-card" ref={questionRef}>
          <p className="quiz-meta">
            <span key={questionIndex} className="quiz-counter">
              Question {questionIndex + 1} / {content.quiz.length}
            </span>
            <span>Score: {score}</span>
          </p>
          <div className="quiz-track" aria-hidden>
            <div className="quiz-track-fill" style={{ width: `${questionProgress}%` }} />
          </div>
          <h3>{currentQuestion.question}</h3>
          <p className="quiz-note">Choose one answer. You can trust your heart or your memory.</p>
          <div className="quiz-options">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`quiz-option ${selectedOption === option ? "is-selected" : ""}`}
                type="button"
                onClick={(event) => handleOption(option, event.currentTarget)}
              >
                {option}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" type="button" onClick={nextQuestion} disabled={!selectedOption}>
            {questionIndex >= content.quiz.length - 1 ? "Finish quiz" : "Next question"}
          </button>
        </div>
      ) : (
        <div className="quiz-result">
          <h3>Your score: {score} / {content.quiz.length}</h3>
          <p>{message}</p>
          <p>No matter the score, you are still my person.</p>
        </div>
      )}

      <StepActions
        onBack={onBack}
        onNext={onNext}
        nextLabel={completed ? "Continue to finale" : "Skip to finale"}
      />
    </StepShell>
  );
}
