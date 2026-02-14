import type { ReactNode } from "react";

interface StepShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function StepShell({ eyebrow, title, subtitle, children }: StepShellProps) {
  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {subtitle ? <p className="subtitle">{subtitle}</p> : null}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}
