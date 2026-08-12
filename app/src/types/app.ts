import type { LanguageMode, MoodMode, MutuContent } from "./mutu";

export interface AppUnlocks {
  gate: boolean;
  vault: boolean;
  futurePasscodes: Record<string, boolean>;
}

export interface StepComponentProps {
  content: MutuContent;
  stepIndex: number;
  totalSteps: number;
  languageMode: LanguageMode;
  mood: MoodMode;
  reducedMotion: boolean;
  unlocks: AppUnlocks;
  onSetLanguageMode: (mode: LanguageMode) => void;
  onSetMood: (mood: MoodMode) => void;
  onUnlockVault: () => void;
  onUpdateUnlocks: (partial: Partial<AppUnlocks>) => void;
  onNext: () => void;
  onBack: () => void;
  onRestart: () => void;
}
