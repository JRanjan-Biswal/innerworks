"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Bookmark, Eye, Home, Menu, Star, X } from "lucide-react";
import { usePresence } from "@/lib/use-presence";
import { cn } from "@/lib/cn";

type MobileNavProps = {
  watchlistCount: number;
  watchedCount: number;
  averageRating: string;
};

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/watched", label: "Watched", icon: Eye },
];

export function MobileNav({ watchlistCount, watchedCount, averageRating }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { mounted, visible } = usePresence(open, 250);

  // Lock scroll and trap Escape while the drawer is on screen.
  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted]);

  const counts: Record<string, number | string> = {
    "/": "",
    "/watchlist": watchlistCount,
    "/watched": watchedCount,
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="grid size-10 place-items-center rounded-xl bg-[var(--surface)] text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--line)] transition-transform duration-150 ease-out active:scale-95"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {mounted && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[var(--z-dialog)]" role="dialog" aria-modal="true" aria-label="Menu">
              <div
                onClick={() => setOpen(false)}
                className={cn(
                  "absolute inset-0 bg-[oklch(0_0_0_/_0.6)] backdrop-blur-sm transition-opacity duration-[250ms] ease-out",
                  visible ? "opacity-100" : "opacity-0",
                )}
              />
              <aside
                className={cn(
                  "absolute right-0 top-0 flex h-dvh w-[300px] max-w-[85vw] flex-col bg-[var(--bg-2)] shadow-[var(--shadow-lg)] ring-1 ring-[var(--line)]",
                  "transition-transform duration-[250ms] ease-out",
                  visible ? "translate-x-0" : "translate-x-full",
                )}
              >
                <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3.5">
                  <span className="text-sm font-semibold tracking-tight text-[var(--ink)]">Menu</span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="grid size-10 place-items-center rounded-xl text-[var(--muted)] transition-[background-color,color,transform] duration-150 ease-out hover:bg-[var(--surface-2)] hover:text-[var(--ink)] active:scale-95"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <nav aria-label="Primary" className="flex flex-col gap-1 p-3">
                  {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    const count = counts[item.href];
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-[background-color,color] duration-150 ease-out",
                          active
                            ? "bg-[var(--accent-quiet)] text-[var(--accent)] shadow-[inset_0_0_0_1px_var(--accent-line)]"
                            : "text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                        <span className="flex-1">{item.label}</span>
                        {count !== "" ? (
                          <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-xs font-semibold text-[var(--muted)] shadow-[inset_0_0_0_1px_var(--line)] tabular-nums">
                            {count}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto border-t border-[var(--line)] p-4">
                  <div className="grid grid-cols-3 gap-2">
                    <DrawerStat icon={<Bookmark className="size-4" />} label="Queued" value={watchlistCount} />
                    <DrawerStat icon={<Eye className="size-4" />} label="Watched" value={watchedCount} />
                    <DrawerStat
                      icon={<Star className="size-4 fill-[var(--accent)] text-[var(--accent)]" />}
                      label="Average"
                      value={averageRating}
                    />
                  </div>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function DrawerStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-[var(--surface)] p-2.5 shadow-[inset_0_0_0_1px_var(--line)]">
      <span className="text-[var(--muted)]">{icon}</span>
      <span className="text-base font-semibold leading-none text-[var(--ink)] tabular-nums">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">{label}</span>
    </div>
  );
}
