import { useEffect, useMemo, useRef, useState } from "react";
import { animateMemoryCard, smoothScrollToChapter } from "../animations/memoryAnimations";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { MemoryCard, StepComponentProps } from "../types/content";

const MEMORY_PUZZLE_KEY = "valentine:memory-opened";

export default function StepMemory({
  content,
  onBack,
  onNext
}: StepComponentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeMemory, setActiveMemory] = useState<MemoryCard | null>(null);
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [pressedCardKey, setPressedCardKey] = useState<string | null>(null);
  const [secretCardKey, setSecretCardKey] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState(content.chapters[0]?.id ?? "");
  const [collapsedChapterIds, setCollapsedChapterIds] = useState<string[]>(
    () => content.chapters.slice(1).map((chapter) => chapter.id)
  );
  const [laneProgress, setLaneProgress] = useState(0);
  const [transitionModule, setTransitionModule] = useState<any>(null);
  const [openedMemoryKeys, setOpenedMemoryKeys] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(MEMORY_PUZZLE_KEY);
      const parsed = JSON.parse(raw ?? "[]");
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch {
      return [];
    }
  });
  const chapterRefs = useRef<Record<string, HTMLElement | null>>({});
  const pressTimerRef = useRef<number | null>(null);
  const totalMemories = content.chapters.reduce((count, chapter) => count + chapter.memories.length, 0);
  const allMemoryKeys = useMemo(
    () =>
      new Set(
        content.chapters.flatMap((chapter) => chapter.memories.map((_, index) => `${chapter.id}-${index}`))
      ),
    [content.chapters]
  );
  const openedCount = useMemo(
    () => openedMemoryKeys.filter((key) => allMemoryKeys.has(key)).length,
    [allMemoryKeys, openedMemoryKeys]
  );
  const memoryCompletion = totalMemories > 0 ? (openedCount / totalMemories) * 100 : 0;
  const puzzleComplete = totalMemories > 0 && openedCount >= totalMemories;

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

  useEffect(() => {
    return () => {
      if (pressTimerRef.current !== null) {
        window.clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const sanitized = openedMemoryKeys.filter((key) => allMemoryKeys.has(key));
    if (sanitized.length !== openedMemoryKeys.length) {
      setOpenedMemoryKeys(sanitized);
      return;
    }
    window.localStorage.setItem(MEMORY_PUZZLE_KEY, JSON.stringify(sanitized));
  }, [allMemoryKeys, openedMemoryKeys]);

  const jumpToChapter = (chapterId: string) => {
    const target = chapterRefs.current[chapterId];
    if (!target) {
      return;
    }
    setCollapsedChapterIds((prev) => prev.filter((id) => id !== chapterId));
    setActiveChapterId(chapterId);
    void smoothScrollToChapter(target, reducedMotion);
  };

  const toggleChapter = (chapterId: string) => {
    setCollapsedChapterIds((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
  };

  const openMemory = (
    chapterId: string,
    memoryIndex: number,
    memory: MemoryCard,
    target: HTMLElement
  ) => {
    const key = `${chapterId}-${memoryIndex}`;
    setOpenedMemoryKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
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

  const startLongPress = (cardKey: string, hasSecret: boolean) => {
    if (!hasSecret) {
      return;
    }
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
    }
    pressTimerRef.current = window.setTimeout(() => {
      setSecretCardKey(cardKey);
      pressTimerRef.current = null;
    }, 620);
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
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
        <p>{activeMemory?.expandedCaption ?? activeMemory?.caption}</p>
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
            aria-pressed={activeChapterId === chapter.id}
            aria-controls={`${chapter.id}-panel`}
          >
            {chapter.title.replace("Chapter ", "Ch ")}
          </button>
        ))}
      </div>

      <div className="memory-progress" aria-hidden>
        <span style={{ width: `${laneProgress}%` }} />
      </div>

      <section className="memory-puzzle" aria-live="polite">
        <div className="memory-puzzle-head">
          <p className="eyebrow">Memory puzzle</p>
          <p>{openedCount} / {totalMemories} moments opened</p>
        </div>
        <div className="memory-puzzle-track" aria-hidden>
          <span style={{ width: `${memoryCompletion}%` }} />
        </div>
        <p className="memory-puzzle-note">
          {puzzleComplete
            ? "All pieces found. You remembered every chapter of us."
            : "Tap each memory card to collect every piece."}
        </p>
      </section>

      <div className="chapter-list">
        {content.chapters.map((chapter) => {
          const isCollapsed = collapsedChapterIds.includes(chapter.id);
          return (
            <article
              key={chapter.id}
              id={chapter.id}
              className="chapter"
              ref={(node) => {
                chapterRefs.current[chapter.id] = node;
              }}
            >
              <header className="chapter-head">
                <button
                  className="chapter-toggle"
                  type="button"
                  onClick={() => toggleChapter(chapter.id)}
                  aria-expanded={!isCollapsed}
                  aria-controls={`${chapter.id}-panel`}
                >
                  <span className="chapter-toggle-copy">
                    <h3 className="chapter-title">{chapter.title}</h3>
                    <span className="chapter-count">{chapter.memories.length} memories</span>
                  </span>
                  <span className={`chapter-chevron ${isCollapsed ? "" : "is-open"}`} aria-hidden>
                    v
                  </span>
                </button>
              </header>
              <div id={`${chapter.id}-panel`} hidden={isCollapsed}>
                {chapter.reflection ? <p className="chapter-reflection">{chapter.reflection}</p> : null}
                <div className="memory-grid">
                  {chapter.memories.map((memory, index) => {
                    const cardKey = `${chapter.id}-${index}`;
                    const isActive = activeCardKey === cardKey;
                    const isPressed = pressedCardKey === cardKey;
                    const isOpened = openedMemoryKeys.includes(cardKey);
                    const showSecret = secretCardKey === cardKey && Boolean(memory.secret);
                    return (
                      <button
                        key={cardKey}
                        type="button"
                        className={`memory-card ${isActive ? "is-active" : ""} ${isPressed ? "is-pressed" : ""} ${
                          isOpened ? "is-opened" : ""
                        }`}
                        aria-label={`Open memory: ${memory.title} (${memory.date})`}
                        onClick={(event) => openMemory(chapter.id, index, memory, event.currentTarget)}
                        onPointerDown={() => {
                          setPressedCardKey(cardKey);
                          startLongPress(cardKey, Boolean(memory.secret));
                        }}
                        onPointerUp={() => {
                          setPressedCardKey(null);
                          cancelLongPress();
                        }}
                        onPointerLeave={() => {
                          setPressedCardKey(null);
                          cancelLongPress();
                        }}
                        onPointerCancel={() => {
                          setPressedCardKey(null);
                          cancelLongPress();
                        }}
                      >
                        <div className="memory-face memory-front">
                          <time>{memory.date}</time>
                          <h4>{memory.title}</h4>
                          <p>{memory.caption}</p>
                          {memory.secret ? <span className="memory-longpress-note">Hold to unlock tiny secret</span> : null}
                          {showSecret ? <p className="memory-secret">{memory.secret}</p> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {CSSTransition ? (
        <CSSTransition in={Boolean(activeMemory)} timeout={320} classNames="sheet" unmountOnExit>
          {sheetBody}
        </CSSTransition>
      ) : activeMemory ? (
        <div className="sheet-fallback">{sheetBody}</div>
      ) : null}

      <StepActions
        onBack={onBack}
        onNext={onNext}
        nextLabel={puzzleComplete ? "Continue to mini-games" : "Continue anyway"}
      />
    </StepShell>
  );
}
