import { animated, useTransition } from "@react-spring/web";

interface ReasonLine {
  id: string;
  text: string;
  order: number;
}

interface SpringReasonListProps {
  reasons: ReasonLine[];
  latestId: string | null;
  reducedMotion: boolean;
}

export default function SpringReasonList({ reasons, latestId, reducedMotion }: SpringReasonListProps) {
  const transitions = useTransition(reasons, {
    keys: (item: ReasonLine) => item.id,
    from: {
      opacity: 0,
      transform: reducedMotion ? "translateY(0px)" : "translateY(10px)"
    },
    enter: {
      opacity: 1,
      transform: "translateY(0px)"
    },
    config: {
      tension: 240,
      friction: 30,
      clamp: true
    },
    trail: reducedMotion ? 0 : 56
  });

  return (
    <ul className="reason-list">
      {transitions((style, item) => (
        <animated.li
          key={item.id}
          style={style}
          className={`reason-row ${item.id === latestId ? "is-fresh" : ""}`}
        >
          <span>Reason {item.order}</span>
          {item.text}
        </animated.li>
      ))}
    </ul>
  );
}
