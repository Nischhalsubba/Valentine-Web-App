import { useEffect, useMemo, useRef, useState } from "react";
import { animateAnswerFeedback, animateQuestionSwap } from "../animations/quizAnimations";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { StepComponentProps } from "../types/content";

const QUIZ_STORAGE_KEY = "valentine:quiz-state";
const QUIZ_BONUS_MAX = 5;

interface StoredQuizState {
  questionIndex: number;
  score: number;
  completed: boolean;
  bonusTaps: number;
}

function readStoredQuizState(totalQuestions: number): StoredQuizState {
  const fallback: StoredQuizState = {
    questionIndex: 0,
    score: 0,
    completed: false,
    bonusTaps: 0
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<StoredQuizState>;
    const maxQuestionIndex = Math.max(0, totalQuestions - 1);
    const questionIndex = Math.min(
      maxQuestionIndex,
      Math.max(0, Number(parsed.questionIndex ?? fallback.questionIndex))
    );
    const score = Math.min(totalQuestions, Math.max(0, Number(parsed.score ?? fallback.score)));
    const completed = Boolean(parsed.completed);
    const bonusTaps = Math.min(QUIZ_BONUS_MAX, Math.max(0, Number(parsed.bonusTaps ?? fallback.bonusTaps)));

    return {
      questionIndex: completed ? maxQuestionIndex : questionIndex,
      score,
      completed,
      bonusTaps
    };
  } catch {
    return fallback;
  }
}

export default function StepQuiz({
  content,
  onBack,
  onNext
}: StepComponentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const initialState = useMemo(() => readStoredQuizState(content.quiz.length), [content.quiz.length]);
  const [questionIndex, setQuestionIndex] = useState(initialState.questionIndex);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [score, setScore] = useState(initialState.score);
  const [completed, setCompleted] = useState(initialState.completed);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [bonusTaps, setBonusTaps] = useState(initialState.bonusTaps);
  const questionRef = useRef<HTMLDivElement>(null);

  const currentQuestion = content.quiz[questionIndex];
  const questionProgress = ((questionIndex + 1) / content.quiz.length) * 100;

  useEffect(() => {
    if (completed) {
      return;
    }
    void animateQuestionSwap(questionRef.current, reducedMotion);
  }, [questionIndex, reducedMotion, completed]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(
      QUIZ_STORAGE_KEY,
      JSON.stringify({
        questionIndex,
        score,
        completed,
        bonusTaps
      })
    );
  }, [bonusTaps, completed, questionIndex, score]);

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
    const isCorrect = option === currentQuestion.answer;
    setSelectedOption(option);
    setFeedbackNote(isCorrect ? "Yes. Sacred memory." : "Nice try, mutu.");
    target.parentElement
      ?.querySelectorAll<HTMLButtonElement>(".quiz-option")
      .forEach((node) => node.classList.remove("is-correct", "is-wrong"));
    void animateAnswerFeedback(target, isCorrect, reducedMotion);
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
    setFeedbackNote("");
  };

  const bonusUnlocked = bonusTaps >= QUIZ_BONUS_MAX;

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
                aria-pressed={selectedOption === option}
                aria-label={`Answer option: ${option}`}
                onClick={(event) => handleOption(option, event.currentTarget)}
              >
                {option}
              </button>
            ))}
          </div>
          <p
            className={`quiz-feedback ${
              selectedOption === currentQuestion.answer ? "is-correct" : "is-wrong"
            } ${feedbackNote ? "is-visible" : ""}`}
            role="status"
            aria-live="polite"
          >
            {feedbackNote}
          </p>

          <button className="btn btn-primary" type="button" onClick={nextQuestion} disabled={!selectedOption}>
            {questionIndex >= content.quiz.length - 1 ? "Finish quiz" : "Next question"}
          </button>
        </div>
      ) : (
        <div className="quiz-result">
          <h3>Your score: {score} / {content.quiz.length}</h3>
          <p>{message}</p>
          <p>No matter the score, you are still my person.</p>
          <div className="quiz-bonus">
            <p className="quiz-bonus-label">Mini surprise: tap the heart 5 times.</p>
              <button
                type="button"
                className={`quiz-bonus-heart ${bonusUnlocked ? "is-unlocked" : ""}`}
                aria-label="Tap heart to unlock surprise"
                onClick={() => setBonusTaps((prev) => Math.min(prev + 1, QUIZ_BONUS_MAX))}
              >
                {"<3"}
              </button>
              <p className="quiz-bonus-note">
                {bonusUnlocked
                  ? "Unlocked: You are my safest place, always."
                  : `${bonusTaps}/${QUIZ_BONUS_MAX} taps`}
              </p>
            </div>
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
