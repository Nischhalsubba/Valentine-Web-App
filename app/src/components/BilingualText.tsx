import type { ReactNode } from "react";
import type { BilingualText as TextShape, LanguageMode } from "../types/mutu";
import { localize } from "../utils/i18n";

interface BilingualTextProps {
  text: TextShape;
  mode: LanguageMode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  secondaryClassName?: string;
}

export default function BilingualText({
  text,
  mode,
  as = "p",
  className,
  secondaryClassName = "bilingual-secondary"
}: BilingualTextProps) {
  const Tag = as;
  const view = localize(text, mode);

  return (
    <Tag className={className}>
      {view.primary}
      {view.secondary ? <span className={secondaryClassName}>{view.secondary}</span> : null}
    </Tag>
  );
}

export function renderLines(value: string): ReactNode[] {
  return value.split("\n").map((line, index) => (
    <span key={`line-${index}`}>
      {line}
      {index < value.split("\n").length - 1 ? <br /> : null}
    </span>
  ));
}
