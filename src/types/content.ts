export interface AppMeta {
  title: string;
  coverLine: string;
  tagline: string;
  openButton: string;
}

export interface LetterContent {
  eyebrow: string;
  heading: string;
  body: string;
  revealPrompt: string;
}

export interface MemoryCard {
  date: string;
  title: string;
  caption: string;
}

export interface MemoryChapter {
  id: string;
  title: string;
  memories: MemoryCard[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

export interface QuizMessages {
  high: string;
  mid: string;
  low: string;
}

export interface FinaleContent {
  eyebrow: string;
  heading: string;
  holdPrompt: string;
  holdButton: string;
  revealedLine: string;
}

export interface AppContent {
  meta: AppMeta;
  letter: LetterContent;
  reasons: string[];
  chapters: MemoryChapter[];
  quiz: QuizQuestion[];
  quizMessages: QuizMessages;
  coupons: string[];
  finale: FinaleContent;
}

export interface StepComponentProps {
  content: AppContent;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onRestart: () => void;
}
