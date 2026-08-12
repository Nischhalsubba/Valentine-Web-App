export type LanguageMode = "mixed" | "en" | "np";
export type MoodMode = "soft" | "funny" | "romantic";

export interface BilingualText {
  en: string;
  np: string;
}

export interface Milestone {
  id: string;
  label: BilingualText;
  dateISO: string;
}

export interface StepDef {
  id: string;
  label: BilingualText;
}

export interface TimelineChapter {
  id: string;
  title: BilingualText;
  hint: BilingualText;
}

export interface UnlockRule {
  type: "vault" | "date" | "passcode";
  requires?: string;
  dateISO?: string;
  codeHint?: string;
}

export interface TimelineItem {
  id: string;
  chapterId: string;
  dateISO: string;
  displayDate: string;
  title: BilingualText;
  short: BilingualText;
  long: BilingualText;
  tags: string[];
  image: string | null;
  audio: string | null;
  locked?: boolean;
  unlock?: UnlockRule;
  location?: BilingualText;
}

export interface GalleryItem {
  id: string;
  image: string;
  dateISO: string;
  caption: BilingualText;
}

export interface QuizOption {
  en: string;
  np: string;
}

export interface QuizQuestion {
  id: string;
  type: "single";
  question: BilingualText;
  options: QuizOption[];
  answerIndex: number;
  feedbackCorrect: BilingualText;
  feedbackWrong: BilingualText;
}

export interface CouponItem {
  id: string;
  rarity: "Common" | "Rare" | "Legendary";
  icon: string;
  title: BilingualText;
  desc: BilingualText;
  expires?: string;
}

export interface EndingVariant {
  headline: BilingualText;
  body: BilingualText;
  ctaPrimary: BilingualText;
  ctaSecondary: BilingualText;
}

export interface FutureItem {
  id: string;
  locked: boolean;
  unlock: {
    type: "date" | "passcode";
    dateISO?: string;
    codeHint?: string;
  };
  title: BilingualText;
  short: BilingualText;
}

export interface MutuContent {
  meta: {
    appId: string;
    appName: BilingualText;
    version: string;
    timezone: string;
    localeDefault: LanguageMode;
    notes: BilingualText;
  };
  settings: {
    languageModeDefault: LanguageMode;
    moodDefault: MoodMode;
    reducedMotionDefault: "system" | "on" | "off";
    privacy: {
      noIndex: boolean;
      showAppTitlePublic: boolean;
    };
  };
  gate: {
    enabled: boolean;
    title: BilingualText;
    subtitle: BilingualText;
    hint: BilingualText;
    pinMode: "phrase" | "pin";
    phraseOptions: string[];
    errorMessage: BilingualText;
    successMessage: BilingualText;
  };
  cover: {
    title: BilingualText;
    subtitle: BilingualText;
    helper: BilingualText;
    ctaPrimary: BilingualText;
    ctaSecondary: BilingualText;
    footer: BilingualText;
  };
  milestones: Milestone[];
  steps: StepDef[];
  letter: {
    title: BilingualText;
    variants: Record<MoodMode, { body: BilingualText; cta: BilingualText }>;
  };
  timeline: {
    title: BilingualText;
    subtitle: BilingualText;
    chapterOrder: string[];
    chapters: TimelineChapter[];
    items: TimelineItem[];
  };
  gallery: {
    title: BilingualText;
    subtitle: BilingualText;
    items: GalleryItem[];
  };
  nurseAppreciation: {
    title: BilingualText;
    sections: Array<{
      id: string;
      heading: BilingualText;
      body: BilingualText;
    }>;
    audio: string;
  };
  play: {
    quiz: {
      title: BilingualText;
      subtitle: BilingualText;
      questions: QuizQuestion[];
    };
    memoryMatch: {
      title: BilingualText;
      subtitle: BilingualText;
      pairSource: string;
      pairCount: number;
      endMessage: BilingualText;
    };
  };
  promises: {
    title: BilingualText;
    subtitle: BilingualText;
    filters: Array<{ id: "all" | "unlocked" | "redeemed"; label: BilingualText }>;
    ctaRedeem: BilingualText;
    ctaUndo: BilingualText;
    items: CouponItem[];
  };
  finale: {
    title: BilingualText;
    choices: Array<{ id: MoodMode; label: BilingualText }>;
    variants: Record<MoodMode, EndingVariant>;
  };
  vault: {
    title: BilingualText;
    subtitle: BilingualText;
    unlock: {
      type: "tapSequence";
      target: string;
      count: number;
      successMessage: BilingualText;
    };
    items: Array<{ id: string; title: BilingualText; body: BilingualText }>;
  };
  futureTimeline: {
    title: BilingualText;
    subtitle: BilingualText;
    items: FutureItem[];
  };
  writeBack: {
    title: BilingualText;
    subtitle: BilingualText;
    placeholders: BilingualText;
    ctaSave: BilingualText;
    ctaClear: BilingualText;
    savedToast: BilingualText;
  };
}
