import { useEffect, useMemo, useState } from "react";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import type { StepComponentProps } from "../types/app";
import type { CouponItem } from "../types/mutu";
import { localize } from "../utils/i18n";
import { getJSON, setJSON } from "../utils/storage";

const COUPONS_KEY = "mutu.coupons.redeemedIds";

type FilterId = "all" | "unlocked" | "redeemed";

function isUnlocked(item: CouponItem, hasVault: boolean): boolean {
  if (item.rarity === "Legendary") {
    return hasVault;
  }
  return true;
}

export default function StepPromises({
  content,
  languageMode,
  unlocks,
  onBack,
  onNext
}: StepComponentProps) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [redeemedIds, setRedeemedIds] = useState<string[]>(() => getJSON<string[]>(COUPONS_KEY, []));

  useEffect(() => {
    setJSON(COUPONS_KEY, redeemedIds);
  }, [redeemedIds]);

  const coupons = useMemo(() => {
    const sorted = [...content.promises.items].sort((a, b) => {
      const order = { Legendary: 0, Rare: 1, Common: 2 };
      return order[a.rarity] - order[b.rarity];
    });

    return sorted.filter((item) => {
      const unlocked = isUnlocked(item, unlocks.vault);
      if (filter === "all") {
        return true;
      }
      if (filter === "unlocked") {
        return unlocked;
      }
      return redeemedIds.includes(item.id);
    });
  }, [content.promises.items, filter, redeemedIds, unlocks.vault]);

  const toggleRedeemed = (id: string) => {
    setRedeemedIds((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]));
  };

  return (
    <StepShell
      eyebrow="Step 7"
      title={localize(content.promises.title, languageMode).primary}
      subtitle={localize(content.promises.subtitle, languageMode).primary}
    >
      <div className="tag-row">
        {content.promises.filters.map((item) => (
          <button
            key={item.id}
            className={`jump-pill ${filter === item.id ? "is-active" : ""}`}
            type="button"
            onClick={() => setFilter(item.id)}
          >
            {localize(item.label, languageMode).primary}
          </button>
        ))}
      </div>

      <div className="coupon-grid">
        {coupons.map((coupon) => {
          const unlocked = isUnlocked(coupon, unlocks.vault);
          const redeemed = redeemedIds.includes(coupon.id);
          const title = localize(coupon.title, languageMode);
          const desc = localize(coupon.desc, languageMode);
          return (
            <button
              key={coupon.id}
              className={`coupon-card ${redeemed ? "is-collected" : ""} ${!unlocked ? "is-locked" : ""}`}
              type="button"
              onClick={() => unlocked && toggleRedeemed(coupon.id)}
              disabled={!unlocked}
            >
              <p className="coupon-kicker">
                {coupon.icon} {coupon.rarity}
              </p>
              <p>{title.primary}</p>
              {title.secondary ? <p className="bilingual-secondary">{title.secondary}</p> : null}
              <p>{desc.primary}</p>
              <span className="coupon-state">
                {!unlocked
                  ? "Unlock vault first"
                  : redeemed
                    ? localize(content.promises.ctaUndo, languageMode).primary
                    : localize(content.promises.ctaRedeem, languageMode).primary}
              </span>
            </button>
          );
        })}
      </div>

      <StepActions onBack={onBack} onNext={onNext} nextLabel="Continue to finale" />
    </StepShell>
  );
}
