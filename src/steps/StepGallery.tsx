import { useEffect, useMemo, useState } from "react";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import type { StepComponentProps } from "../types/app";
import type { GalleryItem } from "../types/mutu";
import { localize } from "../utils/i18n";

function isVideoAsset(path: string): boolean {
  return /\.mp4($|\?)/i.test(path);
}

export default function StepGallery({ content, languageMode, onBack, onNext }: StepComponentProps) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [active]);

  const title = localize(content.gallery.title, languageMode);
  const subtitle = localize(content.gallery.subtitle, languageMode);
  const items = useMemo(() => content.gallery.items, [content.gallery.items]);

  return (
    <StepShell eyebrow="Step 4" title={title.primary} subtitle={subtitle.primary}>
      {subtitle.secondary ? <p className="bilingual-secondary">{subtitle.secondary}</p> : null}
      <div className="polaroid-grid">
        {items.map((item, index) => {
          const angle = (index % 2 === 0 ? -1 : 1) * (4 + (index % 3));
          const caption = localize(item.caption, languageMode);
          const video = isVideoAsset(item.image);
          return (
            <button
              key={item.id}
              className="polaroid-card"
              style={{ ["--tilt" as string]: `${angle}deg` }}
              type="button"
              onClick={() => setActive(item)}
            >
              {video ? (
                <video
                  src={item.image}
                  className="polaroid-media"
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={caption.primary}
                />
              ) : (
                <img
                  src={item.image}
                  alt={caption.primary}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = "/memories/selfie.svg";
                  }}
                />
              )}
              <time>{new Date(item.dateISO).toLocaleDateString("en-US", { dateStyle: "medium" })}</time>
              <p>{caption.primary}</p>
              {caption.secondary ? <p className="bilingual-secondary">{caption.secondary}</p> : null}
            </button>
          );
        })}
      </div>

      {active ? (
        <div className="sheet-backdrop" role="presentation" onClick={() => setActive(null)}>
          <div className="sheet-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            {isVideoAsset(active.image) ? (
              <video
                src={active.image}
                className="sheet-media-video"
                controls
                playsInline
                preload="metadata"
                aria-label={localize(active.caption, languageMode).primary}
              />
            ) : (
              <img
                src={active.image}
                alt={localize(active.caption, languageMode).primary}
                className="sheet-media-image"
                onError={(event) => {
                  event.currentTarget.src = "/memories/selfie.svg";
                }}
              />
            )}
            <h3>{localize(active.caption, languageMode).primary}</h3>
            {languageMode === "mixed" ? (
              <p className="bilingual-secondary">{localize(active.caption, languageMode).secondary}</p>
            ) : null}
            <button className="btn btn-primary" type="button" onClick={() => setActive(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      <StepActions onBack={onBack} onNext={onNext} nextLabel="Continue to nurse page" />
    </StepShell>
  );
}
