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
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [pressedCardKey, setPressedCardKey] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState(content.chapters[0]?.id ?? "");
  const [laneProgress, setLaneProgress] = useState(0);
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

  useEffect(() => {
    const chapters = content.chapters
      .map((chapter) => chapterRefs.current[chapter.id])
      .filter(Boolean) as HTMLElement[];

    if (chapters.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveChapterId(visible[0].target.id);
        }
      },
      {
        threshold: [0.35, 0.6],
        rootMargin: "-15% 0px -45% 0px"
      }
    );

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, [content.chapters]);

  useEffect(() => {
    const updateLaneProgress = () => {
      const first = chapterRefs.current[content.chapters[0]?.id ?? ""];
      const last = chapterRefs.current[content.chapters[content.chapters.length - 1]?.id ?? ""];
      if (!first || !last) {
        setLaneProgress(0);
        return;
      }

      const firstTop = first.getBoundingClientRect().top + window.scrollY;
      const lastBottom = last.getBoundingClientRect().bottom + window.scrollY;
      const start = firstTop - window.innerHeight * 0.4;
      const end = lastBottom - window.innerHeight * 0.55;
      const range = Math.max(1, end - start);
      const progress = ((window.scrollY - start) / range) * 100;
      setLaneProgress(Math.min(100, Math.max(0, progress)));
    };

    updateLaneProgress();
    window.addEventListener("scroll", updateLaneProgress, { passive: true });
    window.addEventListener("resize", updateLaneProgress);
    return () => {
      window.removeEventListener("scroll", updateLaneProgress);
      window.removeEventListener("resize", updateLaneProgress);
    };
  }, [content.chapters]);

  useEffect(() => {
    if (!activeMemory) {
      return;
    }
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMemory(null);
        setActiveCardKey(null);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [activeMemory]);

  const jumpToChapter = (chapterId: string) => {
    const target = chapterRefs.current[chapterId];
    if (!target) {
      return;
    }
    setActiveChapterId(chapterId);
    void smoothScrollToChapter(target, reducedMotion);
  };

  const openMemory = (
    chapterId: string,
    memoryIndex: number,
    memory: MemoryCard,
    target: HTMLElement
  ) => {
    const key = `${chapterId}-${memoryIndex}`;
    setPressedCardKey(null);
    setActiveCardKey(key);
    setActiveMemory(memory);
    void animateMemoryCard(target, reducedMotion);
  };

  const closeMemory = () => {
    setActiveMemory(null);
    setActiveCardKey(null);
    setPressedCardKey(null);
  };

  const CSSTransition = transitionModule?.CSSTransition;
  const sheetBody = (
    <div className="sheet-backdrop" role="presentation" onClick={closeMemory}>
      <div
        className="sheet-card"
        role="dialog"
        aria-modal="true"
        aria-label="Memory detail"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-content-head">
          <p className="eyebrow">{activeMemory?.date}</p>
          <h3>{activeMemory?.title}</h3>
        </div>
        <p>{activeMemory?.caption}</p>
        <button className="btn btn-secondary" type="button" onClick={closeMemory}>
          Close
        </button>
      </div>
    </div>
  );

  return (
    <StepShell
      eyebrow="Step 3/5 - Memory Lane"
      title="Our chapters"
      subtitle="Jump between chapters or tap cards to unfold each memory."
    >
      <div className="chapter-jumps">
        {content.chapters.map((chapter) => (
          <button
            key={chapter.id}
            className={`jump-pill ${activeChapterId === chapter.id ? "is-active" : ""}`}
            type="button"
            onClick={() => jumpToChapter(chapter.id)}
          >
            {chapter.title.replace("Chapter ", "Ch ")}
          </button>
        ))}
      </div>

      <div className="memory-progress" aria-hidden>
        <span style={{ width: `${laneProgress}%` }} />
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
            <header className="chapter-head">
              <h3>{chapter.title}</h3>
              <p>{chapter.memories.length} memories</p>
            </header>
            <div className="memory-grid">
              {chapter.memories.map((memory, index) => {
                const cardKey = `${chapter.id}-${index}`;
                const isActive = activeCardKey === cardKey;
                const isPressed = pressedCardKey === cardKey;
                return (
                  <button
                    key={cardKey}
                    type="button"
                    className={`memory-card ${isActive ? "is-active" : ""} ${isPressed ? "is-pressed" : ""}`}
                    onClick={(event) =>
                      openMemory(chapter.id, index, memory, event.currentTarget)
                    }
                    onPointerDown={() => setPressedCardKey(cardKey)}
                    onPointerUp={() => setPressedCardKey(null)}
                    onPointerLeave={() => setPressedCardKey(null)}
                    onPointerCancel={() => setPressedCardKey(null)}
                  >
                    <div className="memory-face memory-front">
                      <time>{memory.date}</time>
                      <h4>{memory.title}</h4>
                      <p>{memory.caption}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      {CSSTransition ? (
        <CSSTransition in={Boolean(activeMemory)} timeout={320} classNames="sheet" unmountOnExit>
          {sheetBody}
        </CSSTransition>
      ) : activeMemory ? (
        <div className="sheet-fallback">{sheetBody}</div>
      ) : null}

      <StepActions onBack={onBack} onNext={onNext} />
    </StepShell>
  );
}
