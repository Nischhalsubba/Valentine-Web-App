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
    const parsed: unknown = JSON.parse(raw);
    // A saved "null", array or primitive cannot be used as a structured
    // preference object; restore the caller's default instead.
    if (fallback !== null && typeof fallback === "object") {
      if (Array.isArray(fallback)) {
        return (Array.isArray(parsed) ? parsed : fallback) as T;
      }
      return (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : fallback) as T;
    }
    return typeof parsed === typeof fallback ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getString(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function setString(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing or storage quotas must not block the current session.
  }
}

export function setJSON<T>(key: string, value: T): void {
  setString(key, JSON.stringify(value));
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
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Clearing preferences is best-effort when browser storage is denied.
    }
  });
}

