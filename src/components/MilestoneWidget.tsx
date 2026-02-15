import { useMemo } from "react";
import type { Milestone, MutuContent } from "../types/mutu";
import type { LanguageMode } from "../types/mutu";
import { localize } from "../utils/i18n";

interface MilestoneWidgetProps {
  milestones: Milestone[];
  timezone: MutuContent["meta"]["timezone"];
  languageMode: LanguageMode;
  compact?: boolean;
}

interface MilestoneCounter {
  milestone: Milestone;
  daysSince: number;
  hoursSince: number;
}

const HOUR_MS = 1000 * 60 * 60;
const DAY_MS = HOUR_MS * 24;

function getNextAnnualDate(dateISO: string, now: Date): Date {
  const source = new Date(dateISO);
  const next = new Date(source);
  next.setUTCFullYear(now.getUTCFullYear());
  if (next.getTime() <= now.getTime()) {
    next.setUTCFullYear(now.getUTCFullYear() + 1);
  }
  return next;
}

export default function MilestoneWidget({
  milestones,
  timezone,
  languageMode,
  compact = false
}: MilestoneWidgetProps) {
  const snapshot = useMemo(() => {
    const now = new Date();
    const counters: MilestoneCounter[] = milestones.map((milestone) => {
      const deltaMs = Math.max(0, now.getTime() - new Date(milestone.dateISO).getTime());
      return {
        milestone,
        daysSince: Math.floor(deltaMs / DAY_MS),
        hoursSince: Math.floor(deltaMs / HOUR_MS)
      };
    });

    const nextMilestone = milestones
      .map((milestone) => {
        const nextDate = getNextAnnualDate(milestone.dateISO, now);
        const daysUntil = Math.max(0, Math.ceil((nextDate.getTime() - now.getTime()) / DAY_MS));
        return {
          milestone,
          nextDate,
          daysUntil
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)[0];

    return {
      counters,
      nextMilestone
    };
  }, [milestones]);

  if (milestones.length === 0) {
    return null;
  }

  return (
    <section className={`milestone-widget ${compact ? "is-compact" : ""}`} aria-label="Milestone counter">
      <header>
        <p className="eyebrow">Day Counter</p>
        <h3>{compact ? "Our days" : "Days, hours, and the next milestone"}</h3>
      </header>

      <ul className="milestone-list">
        {snapshot.counters.slice(0, compact ? 2 : 3).map((entry) => {
          const copy = localize(entry.milestone.label, languageMode);
          return (
            <li key={entry.milestone.id}>
              <p className="milestone-label">{copy.primary}</p>
              {copy.secondary ? <p className="bilingual-secondary">{copy.secondary}</p> : null}
              <p className="milestone-value">
                {entry.daysSince} days
                {!compact ? <span> ({entry.hoursSince}h)</span> : null}
              </p>
            </li>
          );
        })}
      </ul>

      {snapshot.nextMilestone ? (
        <p className="milestone-next">
          Next milestone in <strong>{snapshot.nextMilestone.daysUntil} days</strong>:{" "}
          {localize(snapshot.nextMilestone.milestone.label, languageMode).primary}
          <span className="milestone-next-date">
            {" "}
            (
            {new Intl.DateTimeFormat("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: timezone
            }).format(snapshot.nextMilestone.nextDate)}
            )
          </span>
        </p>
      ) : null}
    </section>
  );
}
