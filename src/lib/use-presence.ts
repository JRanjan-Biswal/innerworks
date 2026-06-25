"use client";

import { useEffect, useState } from "react";

/**
 * Keeps a component mounted long enough to play an exit animation.
 *
 * `mounted` controls whether to render at all; `visible` flips to `true` one
 * frame after mount (to trigger the enter transition) and to `false` on close
 * (to trigger the exit transition) before unmounting after `duration`.
 */
export function usePresence(open: boolean, duration = 220) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  // Mount synchronously while rendering when opening — React's supported
  // "adjust state during render" pattern, so the element exists before paint.
  if (open && !mounted) {
    setMounted(true);
  }

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const frame = requestAnimationFrame(() => setVisible(false));
    const timer = window.setTimeout(() => setMounted(false), duration);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [open, duration]);

  return { mounted, visible };
}
