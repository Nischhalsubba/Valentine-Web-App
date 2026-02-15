export interface AppMeta {
  title: string;
  coverLine: string;
  tagline: string;
  openButton: string;
  lock?: {
    enabled?: boolean;
    hint?: string;
    sessionHours?: number;
    fallbackPin?: string;
  };
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
  expandedCaption?: string;
  secret?: string;
  media?: {
    type?: "image" | "video";
    src: string;
    alt: string;
    poster?: string;
  };
}

export interface MemoryChapter {
  id: string;
  title: string;
  reflection?: string;
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

export interface EasterEggContent {
  title: string;
  hint: string;
  message: string;
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
  easterEgg: EasterEggContent;
}

export interface StepComponentProps {
  content: AppContent;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onRestart: () => void;
}
