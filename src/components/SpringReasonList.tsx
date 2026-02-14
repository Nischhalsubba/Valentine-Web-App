import { animated, useTransition } from "@react-spring/web";

interface SpringReasonListProps {
  reasons: string[];
}

export default function SpringReasonList({ reasons }: SpringReasonListProps) {
  const transitions = useTransition(reasons, {
    keys: (item: string) => item,
    from: { opacity: 0, transform: "translateY(10px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-6px)" },
    trail: 70
  });

  return (
    <ul className="reason-list">
      {transitions((style, item, _state, index) => (
        <animated.li key={item} style={style}>
          <span>Reason {index + 1}</span>
          {item}
        </animated.li>
      ))}
    </ul>
  );
}
