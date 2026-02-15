const STORAGE_KEYS = [
  "mutu.progress.step",
  "mutu.memories.viewedIds",
  "mutu.memories.reactionsById",
  "mutu.coupons.redeemedIds",
  "mutu.quiz.bestScore",
  "mutu.user.notes",
  "mutu.unlocks",
  "mutu.settings.languageMode",
  "mutu.settings.mood",
  "mutu.settings.reducedMotion"
] as const;

export type StorageKey = (typeof STORAGE_KEYS)[number];

export function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function mergeJSON<T extends Record<string, unknown>>(key: string, partial: Partial<T>): T {
  const current = getJSON<T>(key, {} as T);
  const merged = { ...current, ...partial };
  setJSON(key, merged);
  return merged;
}

export function resetAll(): void {
  if (typeof window === "undefined") {
    return;
  }

  STORAGE_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

