"use client";
import { useEffect, useRef, useState } from "react";

interface UseInactivityTimerOptions {
  // Milliseconds of inactivity before the callback fires.
  timeoutMs: number;
  // When false, the timer is paused (and any running timer is cleared).
  enabled?: boolean;
  // Fire only once per mount; subsequent inactivity will not retrigger.
  once?: boolean;
}

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "wheel",
];

/**
 * Tracks user inactivity on the window. After `timeoutMs` of no input
 * events, the returned `isInactive` flag flips to true. Any subsequent
 * input resets the timer.
 *
 * If `once: true`, the flag stays true once it fires (the consumer can
 * still flip it back manually with `reset`); the timer won't rearm.
 */
export const useInactivityTimer = ({
  timeoutMs,
  enabled = true,
  once = true,
}: UseInactivityTimerOptions) => {
  const [isInactive, setIsInactive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);

  const reset = () => {
    setIsInactive(false);
    firedRef.current = false;
  };

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }

    const armTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (once && firedRef.current) return;
      timerRef.current = setTimeout(() => {
        firedRef.current = true;
        setIsInactive(true);
      }, timeoutMs);
    };

    const handleActivity = () => {
      if (once && firedRef.current) return;
      armTimer();
    };

    armTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [timeoutMs, enabled, once]);

  return { isInactive, reset };
};
