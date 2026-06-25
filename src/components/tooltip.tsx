"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Lightweight hover/focus tooltip. Rendered into `document.body` so it is never
 * clipped by an ancestor's `overflow: hidden` or transformed containing block.
 */
export function Tooltip({ label, children, className }: TooltipProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  const show = (event: React.SyntheticEvent<HTMLSpanElement>) =>
    setRect(event.currentTarget.getBoundingClientRect());
  const hide = () => setRect(null);

  return (
    <span
      className={className ? `inline-flex ${className}` : "inline-flex"}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {rect && typeof document !== "undefined"
        ? createPortal(
            <span
              role="tooltip"
              style={{ left: rect.left + rect.width / 2, top: rect.top - 10 }}
              className="pointer-events-none fixed z-[var(--z-toast)] -translate-x-1/2 -translate-y-full"
            >
              <span className="tooltip-pop block whitespace-nowrap rounded-lg bg-[var(--surface-3)] px-2.5 py-1.5 text-xs font-medium text-[var(--ink)] shadow-[var(--shadow-md)] ring-1 ring-[var(--line-strong)]">
                {label}
              </span>
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
