import { useMemo, useState } from "react";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import type { StepComponentProps } from "../types/app";
import { localize } from "../utils/i18n";
import { getJSON, setJSON } from "../utils/storage";

const QUIZ_BEST_SCORE_KEY = "mutu.quiz.bestScore";

interface MatchCard {
  id: string;
  pairId: string;
  label: string;
  kind: "date" | "moment";
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function StepQuiz({ content, languageMode, onBack, onNext }: StepComponentProps) {
  const quiz = content.play.quiz;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [quizComplete, setQuizComplete] = useState(false);
  const [bestScore, setBestScore] = useState<number>(() => getJSON<number>(QUIZ_BEST_SCORE_KEY, 0));

  const currentQuestion = quiz.questions[questionIndex];

  const pairs = useMemo(() => {
    return content.timeline.items.slice(0, content.play.memoryMatch.pairCount).map((item) => ({
      id: item.id,
      date: item.displayDate,
      moment: localize(item.title, languageMode).primary
    }));
  }, [content.play.memoryMatch.pairCount, content.timeline.items, languageMode]);

  const cards = useMemo(() => {
    const collection: MatchCard[] = [];
    pairs.forEach((pair) => {
      collection.push(
        { id: `${pair.id}-date`, pairId: pair.id, label: pair.date, kind: "date" },
        { id: `${pair.id}-moment`, pairId: pair.id, label: pair.moment, kind: "moment" }
      );
    });
    return shuffle(collection);
  }, [pairs]);

  const [openIds, setOpenIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);

  const submitAnswer = (index: number) => {
    if (selectedIndex !== null) {
      return;
    }

    setSelectedIndex(index);
    const correct = index === currentQuestion.answerIndex;
    const note = correct ? currentQuestion.feedbackCorrect : currentQuestion.feedbackWrong;
    setFeedback(localize(note, languageMode).primary);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (selectedIndex === null) {
      return;
    }
    if (questionIndex >= quiz.questions.length - 1) {
      const finalScore = score;
      const best = Math.max(bestScore, finalScore);
      setBestScore(best);
      setJSON(QUIZ_BEST_SCORE_KEY, best);
      setQuizComplete(true);
      return;
    }
    setQuestionIndex((prev) => prev + 1);
    setSelectedIndex(null);
    setFeedback("");
  };

  const selectMatchCard = (card: MatchCard) => {
    const locked = matchedPairIds.includes(card.pairId) || openIds.includes(card.id) || openIds.length >= 2;
    if (locked) {
      return;
    }

    const nextOpen = [...openIds, card.id];
    setOpenIds(nextOpen);
    if (nextOpen.length < 2) {
      return;
    }

    setAttempts((prev) => prev + 1);
    const [firstId, secondId] = nextOpen;
    const first = cards.find((item) => item.id === firstId);
    const second = cards.find((item) => item.id === secondId);
    if (first && second && first.pairId === second.pairId) {
      window.setTimeout(() => {
        setMatchedPairIds((prev) => [...prev, first.pairId]);
        setOpenIds([]);
      }, 260);
      return;
    }

    window.setTimeout(() => {
      setOpenIds([]);
    }, 700);
  };

  const allMatched = matchedPairIds.length === pairs.length;

  return (
    <StepShell
      eyebrow="Step 6"
      title={localize(quiz.title, languageMode).primary}
      subtitle={localize(quiz.subtitle, languageMode).primary}
    >
      {!quizComplete ? (
        <div className="quiz-card">
          <p className="quiz-meta">
            <span>
              {questionIndex + 1}/{quiz.questions.length}
            </span>
            <span>
              Score: {score}/{quiz.questions.length}
            </span>
          </p>
          <h3>{localize(currentQuestion.question, languageMode).primary}</h3>
          <div className="quiz-options">
            {currentQuestion.options.map((option, index) => {
              const copy = localize(option, languageMode);
              const selected = selectedIndex === index;
              return (
                <button
                  key={`${currentQuestion.id}-${option.en}-${option.np}`}
                  className={`quiz-option ${selected ? "is-selected" : ""}`}
                  type="button"
                  onClick={() => submitAnswer(index)}
                >
                  <span>{copy.primary}</span>
                  {copy.secondary ? <span className="bilingual-secondary">{copy.secondary}</span> : null}
                </button>
              );
            })}
          </div>
          <p className={`quiz-feedback ${feedback ? "is-visible" : ""}`}>{feedback}</p>
          <button className="btn btn-primary" type="button" disabled={selectedIndex === null} onClick={nextQuestion}>
            {questionIndex >= quiz.questions.length - 1 ? "Finish quiz" : "Next question"}
          </button>
        </div>
      ) : (
        <div className="quiz-result">
          <h3>
            Quiz done: {score}/{quiz.questions.length}
          </h3>
          <p>Best score on this device: {bestScore}</p>
        </div>
      )}

      {quizComplete ? (
        <section className="match-game">
          <header>
            <h3>{localize(content.play.memoryMatch.title, languageMode).primary}</h3>
            <p>{localize(content.play.memoryMatch.subtitle, languageMode).primary}</p>
            <p>Attempts: {attempts}</p>
          </header>

          <div className="match-grid">
            {cards.map((card) => {
              const open = openIds.includes(card.id) || matchedPairIds.includes(card.pairId);
              return (
                <button
                  key={card.id}
                  className={`match-card ${open ? "is-open" : ""}`}
                  type="button"
                  onClick={() => selectMatchCard(card)}
                >
                  <span>{open ? card.label : "?"}</span>
                </button>
              );
            })}
          </div>

          {allMatched ? (
            <p className="match-complete">{localize(content.play.memoryMatch.endMessage, languageMode).primary}</p>
          ) : null}
        </section>
      ) : null}

      <StepActions onBack={onBack} onNext={onNext} nextLabel={quizComplete ? "Continue to promises" : "Skip to promises"} />
    </StepShell>
  );
}
