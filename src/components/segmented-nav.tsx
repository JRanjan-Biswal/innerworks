"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/watched", label: "Watched" },
];

export function SegmentedNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const [ready, setReady] = useState(false);

  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((item) => item.href === pathname),
  );

  const measure = useCallback(() => {
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [activeIndex]);

  // Position the pill before paint so it never slides in from zero on first load.
  useIsomorphicLayoutEffect(() => {
    measure();
  }, [measure]);

  // Enable the sliding transition only after the initial position is set.
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Re-measure when the viewport or font metrics change.
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <nav aria-label="Primary" className="min-w-0">
      <div
        ref={listRef}
        className="relative flex items-center gap-1 rounded-full bg-[var(--surface-2)] p-1 shadow-[inset_0_0_0_1px_var(--line)]"
      >
        <span
          aria-hidden="true"
          className={cn("nav-pill", ready && "is-ready")}
          style={
            pill
              ? ({
                  "--pill-x": `${pill.x}px`,
                  "--pill-w": `${pill.w}px`,
                } as React.CSSProperties)
              : { opacity: 0 }
          }
        />
        {NAV_ITEMS.map((item, index) => {
          const active = index === activeIndex;
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative z-10 flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold",
                "transition-[color,transform] duration-200 ease-out active:scale-[0.96]",
                active
                  ? "text-[var(--bg)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
