"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bookmark, Eye, Film, Star } from "lucide-react";
import { SegmentedNav } from "@/components/segmented-nav";
import { MobileNav } from "@/components/mobile-nav";
import { useMovieStore } from "@/store/movie-store";

export function SiteHeader() {
  const watchlist = useMovieStore((state) => state.watchlist);
  const watched = useMovieStore((state) => state.watched);

  const averageRating = useMemo(() => {
    if (!watched.length) return "0.0";
    const total = watched.reduce((sum, movie) => sum + movie.rating, 0);
    return (total / watched.length).toFixed(1);
  }, [watched]);

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--line)] bg-[oklch(0.165_0.006_66_/_0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent)] text-[var(--accent-ink)] shadow-[var(--shadow-accent)] transition-transform duration-200 ease-out group-hover:-rotate-3 group-active:scale-95">
            <Film className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-[var(--ink)]">
              Framekeep
            </span>
            <span className="mt-1 text-[11px] font-medium text-[var(--muted)]">Movie log</span>
          </span>
        </Link>

        {/* Desktop: centered moving-pill nav */}
        <div className="mx-auto hidden md:block">
          <SegmentedNav />
        </div>

        {/* Desktop: inline stats */}
        <div className="hidden items-center gap-1.5 md:flex">
          <StatChip icon={<Bookmark className="size-4" />} label="Watchlist" value={watchlist.length} />
          <StatChip icon={<Eye className="size-4" />} label="Watched" value={watched.length} />
          <StatChip
            icon={<Star className="size-4 fill-[var(--accent)] text-[var(--accent)]" />}
            label="Average"
            value={averageRating}
            accent
          />
        </div>

        {/* Mobile: hamburger + drawer */}
        <div className="ml-auto md:hidden">
          <MobileNav
            watchlistCount={watchlist.length}
            watchedCount={watched.length}
            averageRating={averageRating}
          />
        </div>
      </div>
    </header>
  );
}

function StatChip({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-2 shadow-[inset_0_0_0_1px_var(--line)]">
      <span className={accent ? "text-[var(--accent)]" : "text-[var(--muted)]"}>{icon}</span>
      <span className="hidden text-[11px] font-medium uppercase tracking-wide text-[var(--muted)] lg:inline">
        {label}
      </span>
      <span className="text-sm font-semibold leading-none text-[var(--ink)] tabular-nums">
        {value}
      </span>
    </div>
  );
}
