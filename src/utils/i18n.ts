import type { BilingualText, LanguageMode } from "../types/mutu";

export interface LocalizedText {
  primary: string;
  secondary?: string;
}

function sanitize(value: string | undefined): string {
  return (value ?? "").trim();
}

export function localize(text: BilingualText, mode: LanguageMode): LocalizedText {
  const en = sanitize(text.en);
  const np = sanitize(text.np);

  if (mode === "en") {
    return { primary: en || np };
  }
  if (mode === "np") {
    return { primary: np || en };
  }

  if (en && np) {
    return { primary: en, secondary: np };
  }
  return { primary: en || np };
}

export function localizeInline(text: BilingualText, mode: LanguageMode): string {
  const view = localize(text, mode);
  return view.secondary ? `${view.primary} ${view.secondary}` : view.primary;
}

export function localizeSearchBlob(text: BilingualText): string {
  return `${text.en} ${text.np}`.toLowerCase();
}
