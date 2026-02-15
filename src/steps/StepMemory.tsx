import { useEffect, useMemo, useRef, useState } from "react";
import MilestoneWidget from "../components/MilestoneWidget";
import StepActions from "../components/StepActions";
import StepShell from "../components/StepShell";
import type { StepComponentProps } from "../types/app";
import type { TimelineItem } from "../types/mutu";
import { localize, localizeSearchBlob } from "../utils/i18n";
import { getJSON, setJSON } from "../utils/storage";

const VIEWED_KEY = "mutu.memories.viewedIds";
const REACTIONS_KEY = "mutu.memories.reactionsById";

const REACTIONS = ["🥺", "😂", "❤️", "😳", "👀"] as const;

interface AudioState {
  playing: boolean;
  currentTime: number;
  duration: number;
}

function itemSearchBlob(item: TimelineItem): string {
  return [
    item.displayDate,
    localizeSearchBlob(item.title),
    localizeSearchBlob(item.short),
    localizeSearchBlob(item.long),
    item.tags.join(" ")
  ]
    .join(" ")
    .toLowerCase();
}

export default function StepMemory({
  content,
  languageMode,
  unlocks,
  reducedMotion,
  onBack,
  onNext
}: StepComponentProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [activeMemoryId, setActiveMemoryId] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<string[]>(() => getJSON<string[]>(VIEWED_KEY, []));
  const [reactionsById, setReactionsById] = useState<Record<string, string>>(() =>
    getJSON<Record<string, string>>(REACTIONS_KEY, {})
  );
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [audioState, setAudioState] = useState<AudioState>({ playing: false, currentTime: 0, duration: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    content.timeline.items.forEach((item) => {
      item.tags.forEach((tag) => tags.add(tag));
    });
    return ["All", ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
  }, [content.timeline.items]);

  const itemsById = useMemo(
    () => new Map(content.timeline.items.map((item) => [item.id, item])),
    [content.timeline.items]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return content.timeline.items.filter((item) => {
      const matchesTag = activeTag === "All" || item.tags.includes(activeTag);
      const matchesQuery = !query || itemSearchBlob(item).includes(query);
      return matchesTag && matchesQuery;
    });
  }, [activeTag, content.timeline.items, search]);

  const featuredMemoryIds = useMemo(
    () =>
      content.timeline.items
        .filter((item) => !item.locked)
        .slice(0, 8)
        .map((item) => item.id),
    [content.timeline.items]
  );

  const grouped = useMemo(() => {
    const groupedMap = new Map<string, TimelineItem[]>();
    filteredItems.forEach((item) => {
      const existing = groupedMap.get(item.chapterId) ?? [];
      existing.push(item);
      groupedMap.set(item.chapterId, existing);
    });
    return groupedMap;
  }, [filteredItems]);

  const activeMemory = activeMemoryId ? itemsById.get(activeMemoryId) ?? null : null;

  const memoryProgress = useMemo(() => {
    const total = content.timeline.items.length;
    const viewed = content.timeline.items.filter((item) => viewedIds.includes(item.id)).length;
    return {
      viewed,
      total,
      percent: total > 0 ? (viewed / total) * 100 : 0
    };
  }, [content.timeline.items, viewedIds]);

  useEffect(() => {
    setJSON(VIEWED_KEY, viewedIds);
  }, [viewedIds]);

  useEffect(() => {
    setJSON(REACTIONS_KEY, reactionsById);
  }, [reactionsById]);

  useEffect(() => {
    if (!slideshowActive || featuredMemoryIds.length === 0) {
      return;
    }

    const id = featuredMemoryIds[slideshowIndex % featuredMemoryIds.length];
    setActiveMemoryId(id);
    setViewedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

    const timer = window.setTimeout(() => {
      setSlideshowIndex((prev) => {
        const next = prev + 1;
        if (next >= featuredMemoryIds.length) {
          setSlideshowActive(false);
          return 0;
        }
        return next;
      });
    }, reducedMotion ? 2600 : 4200);

    return () => window.clearTimeout(timer);
  }, [featuredMemoryIds, reducedMotion, slideshowActive, slideshowIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const sync = () => {
      setAudioState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: Number.isFinite(audio.duration) ? audio.duration : 0
      }));
    };

    const onPlay = () => setAudioState((prev) => ({ ...prev, playing: true }));
    const onPause = () => setAudioState((prev) => ({ ...prev, playing: false }));

    audio.volume = 0.7;
    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("loadedmetadata", sync);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", sync);
      audio.removeEventListener("loadedmetadata", sync);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [activeMemoryId]);

  const openMemory = (item: TimelineItem) => {
    if (item.locked && !unlocks.vault) {
      return;
    }
    setSlideshowActive(false);
    setActiveMemoryId(item.id);
    setViewedIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
  };

  const closeMemory = () => {
    setActiveMemoryId(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggleReaction = (itemId: string, reaction: string) => {
    setReactionsById((prev) => {
      const next = { ...prev };
      if (next[itemId] === reaction) {
        delete next[itemId];
      } else {
        next[itemId] = reaction;
      }
      return next;
    });
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      await audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    setAudioState((prev) => ({ ...prev, currentTime: 0 }));
  };

  const onSeekAudio = (percent: number) => {
    const audio = audioRef.current;
    if (!audio || audioState.duration <= 0) {
      return;
    }
    audio.currentTime = (percent / 100) * audioState.duration;
  };

  return (
    <StepShell
      eyebrow="Step 3"
      title={localize(content.timeline.title, languageMode).primary}
      subtitle={localize(content.timeline.subtitle, languageMode).primary}
    >
      <MilestoneWidget milestones={content.milestones} timezone={content.meta.timezone} languageMode={languageMode} />

      <section className="memory-toolbar">
        <label className="memory-search-wrap">
          <span>Search</span>
          <input
            className="memory-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search memories, tags, dates..."
          />
        </label>
        <button className="btn btn-secondary" type="button" onClick={() => {
          setSearch("");
          setActiveTag("All");
        }}>
          Clear
        </button>
        <button
          className={`btn ${slideshowActive ? "btn-secondary" : "btn-primary"}`}
          type="button"
          onClick={() => {
            if (slideshowActive) {
              setSlideshowActive(false);
              return;
            }
            setSlideshowIndex(0);
            setSlideshowActive(true);
          }}
        >
          {slideshowActive ? "Pause story" : "Play our story"}
        </button>
      </section>

      <div className="tag-row" role="list" aria-label="Memory filters">
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`jump-pill ${activeTag === tag ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <section className="memory-puzzle">
        <div className="memory-puzzle-head">
          <p className="eyebrow">Memory Puzzle</p>
          <p>
            {memoryProgress.viewed} / {memoryProgress.total}
          </p>
        </div>
        <div className="memory-puzzle-track" aria-hidden>
          <span style={{ width: `${memoryProgress.percent}%` }} />
        </div>
      </section>

      <div className="chapter-list">
        {content.timeline.chapterOrder.map((chapterId) => {
          const chapter = content.timeline.chapters.find((item) => item.id === chapterId);
          if (!chapter) {
            return null;
          }
          const chapterItems = grouped.get(chapter.id) ?? [];
          if (chapterItems.length === 0) {
            return null;
          }

          return (
            <article key={chapter.id} className="chapter">
              <header className="chapter-head">
                <h3 className="chapter-title">{localize(chapter.title, languageMode).primary}</h3>
                <p className="chapter-reflection">{localize(chapter.hint, languageMode).primary}</p>
              </header>
              <div className="memory-grid">
                {chapterItems.map((item) => {
                  const locked = Boolean(item.locked && !unlocks.vault);
                  const reaction = reactionsById[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`memory-card ${locked ? "is-locked" : ""} ${
                        viewedIds.includes(item.id) ? "is-opened" : ""
                      }`}
                      onClick={() => openMemory(item)}
                      aria-label={`Open memory ${localize(item.title, languageMode).primary}`}
                    >
                      <div className="memory-face memory-front">
                        <time>{item.displayDate}</time>
                        <h4>{localize(item.title, languageMode).primary}</h4>
                        <p>{localize(item.short, languageMode).primary}</p>
                        <p className="memory-tag-line">{item.tags.join(" • ")}</p>
                        {reaction ? <p className="memory-reaction-chip">Reeja reacted {reaction}</p> : null}
                        {locked ? <p className="memory-lock-note">Locked in the vault ❤️</p> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <h4>No memories match that… yet 😉</h4>
          <p>Try clearing search or selecting another tag.</p>
        </div>
      ) : null}

      {activeMemory ? (
        <div className="sheet-backdrop" role="presentation" onClick={closeMemory}>
          <div className="sheet-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-content-head">
              <p className="eyebrow">{activeMemory.displayDate}</p>
              <h3>{localize(activeMemory.title, languageMode).primary}</h3>
              <p>{localize(activeMemory.long, languageMode).primary}</p>
              {languageMode === "mixed" ? (
                <p className="bilingual-secondary">{localize(activeMemory.long, languageMode).secondary}</p>
              ) : null}
            </div>

            <div className="reaction-row" role="group" aria-label="Reactions">
              {REACTIONS.map((reaction) => (
                <button
                  key={reaction}
                  type="button"
                  className={`reaction-pill ${reactionsById[activeMemory.id] === reaction ? "is-active" : ""}`}
                  onClick={() => toggleReaction(activeMemory.id, reaction)}
                  aria-pressed={reactionsById[activeMemory.id] === reaction}
                >
                  {reaction}
                </button>
              ))}
            </div>

            {activeMemory.audio ? (
              <div className="audio-box">
                <audio ref={audioRef} src={activeMemory.audio} preload="metadata" />
                <div className="audio-actions">
                  <button className="btn btn-secondary" type="button" onClick={toggleAudio}>
                    {audioState.playing ? "Pause" : "Play"}
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={stopAudio}>
                    Stop
                  </button>
                </div>
                <input
                  className="audio-progress"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={audioState.duration > 0 ? (audioState.currentTime / audioState.duration) * 100 : 0}
                  onChange={(event) => onSeekAudio(Number(event.target.value))}
                />
                <p className="audio-time">
                  {audioState.currentTime.toFixed(0)}s / {audioState.duration.toFixed(0)}s
                </p>
              </div>
            ) : null}

            <button className="btn btn-primary" type="button" onClick={closeMemory}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      <StepActions onBack={onBack} onNext={onNext} nextLabel="Continue to gallery" />
    </StepShell>
  );
}
