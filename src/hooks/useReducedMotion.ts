import { useEffect, useMemo, useState } from "react";

type MotionPreference = "system" | "on" | "off";

const QUERY = "(prefers-reduced-motion: reduce)";

function readSystemReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

export function useReducedMotion(preference: MotionPreference = "system"): boolean {
  const [systemReduced, setSystemReduced] = useState<boolean>(readSystemReducedMotion);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia(QUERY);
    const onChange = () => setSystemReduced(media.matches);

    onChange();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  return useMemo(() => {
    if (preference === "on") {
      return true;
    }
    if (preference === "off") {
      return false;
    }
    return systemReduced;
  }, [preference, systemReduced]);
}

export type { MotionPreference };
