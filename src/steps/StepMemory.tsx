import { useEffect, useRef, useState } from "react";
import { animateMemoryCard, smoothScrollToChapter } from "../animations/memoryAnimations";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { MemoryCard, StepComponentProps } from "../types/content";

export default function StepMemory({
  content,
  onBack,
  onNext
}: StepComponentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeMemory, setActiveMemory] = useState<MemoryCard | null>(null);
  const [flippedKey, setFlippedKey] = useState<string | null>(null);
  const [transitionModule, setTransitionModule] = useState<any>(null);
  const chapterRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    let mounted = true;
    void import("react-transition-group")
      .then((module) => {
        if (mounted) {
          setTransitionModule(module);
        }
      })
      .catch(() => {
        setTransitionModule(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const jumpToChapter = (chapterId: string) => {
    const target = chapterRefs.current[chapterId];
    if (!target) {
      return;
    }
    void smoothScrollToChapter(target, reducedMotion);
  };

  const openMemory = (
    chapterId: string,
    memoryIndex: number,
    memory: MemoryCard,
    target: HTMLElement
  ) => {
    const key = `${chapterId}-${memoryIndex}`;
    setFlippedKey((prev) => (prev === key ? null : key));
    setActiveMemory(memory);
    void animateMemoryCard(target, reducedMotion);
  };

  const CSSTransition = transitionModule?.CSSTransition;
  const sheetBody = (
    <div className="sheet-backdrop" role="presentation" onClick={() => setActiveMemory(null)}>
      <div
        className="sheet-card"
        role="dialog"
        aria-modal="true"
        aria-label="Memory detail"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="eyebrow">{activeMemory?.date}</p>
        <h3>{activeMemory?.title}</h3>
        <p>{activeMemory?.caption}</p>
        <button className="btn btn-secondary" type="button" onClick={() => setActiveMemory(null)}>
          Close
        </button>
      </div>
    </div>
  );

  return (
    <StepShell
      eyebrow="Step 3/5 - Memory Lane"
      title="Our chapters"
      subtitle="Tap a card to focus it, then open it in the detail sheet."
    >
      <div className="chapter-jumps">
        {content.chapters.map((chapter) => (
          <button
            key={chapter.id}
            className="jump-pill"
            type="button"
            onClick={() => jumpToChapter(chapter.id)}
          >
            {chapter.title.replace("Chapter ", "Ch ")}
          </button>
        ))}
      </div>

      <div className="chapter-list">
        {content.chapters.map((chapter) => (
          <article
            key={chapter.id}
            id={chapter.id}
            className="chapter"
            ref={(node) => {
              chapterRefs.current[chapter.id] = node;
            }}
          >
            <h3>{chapter.title}</h3>
            <div className="memory-grid">
              {chapter.memories.map((memory, index) => {
                const cardKey = `${chapter.id}-${index}`;
                const isFlipped = flippedKey === cardKey;
                return (
                  <button
                    key={cardKey}
                    type="button"
                    className={`memory-card ${isFlipped ? "is-flipped" : ""}`}
                    onClick={(event) =>
                      openMemory(chapter.id, index, memory, event.currentTarget)
                    }
                  >
                    <div className="memory-inner">
                      <div className="memory-face memory-front">
                        <time>{memory.date}</time>
                        <h4>{memory.title}</h4>
                      </div>
                      <div className="memory-face memory-back">{memory.caption}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      {CSSTransition ? (
        <CSSTransition in={Boolean(activeMemory)} timeout={240} classNames="sheet" unmountOnExit>
          {sheetBody}
        </CSSTransition>
      ) : activeMemory ? (
        <div className="sheet-fallback">{sheetBody}</div>
      ) : null}

      <StepActions onBack={onBack} onNext={onNext} />
    </StepShell>
  );
}
