"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Eye } from "lucide-react";
import type { Movie, WatchedMovie, WatchlistMovie } from "@/types/movie";
import { EmptyList, WatchedCard, WatchlistCard } from "@/components/movie-card";

type CollectionRailsProps = {
  watchlist: WatchlistMovie[];
  watched: WatchedMovie[];
  onLogMovie: (movie: Movie) => void;
  onEditWatched: (movie: WatchedMovie) => void;
  onRemoveFromWatchlist: (imdbID: string) => void;
  onRemoveFromWatched: (imdbID: string) => void;
};

const PREVIEW_LIMIT = 6;
const GRID = "grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(168px,1fr))]";

export function CollectionRails({
  watchlist,
  watched,
  onLogMovie,
  onEditWatched,
  onRemoveFromWatchlist,
  onRemoveFromWatched,
}: CollectionRailsProps) {
  return (
    <div className="space-y-10">
      <Section
        title="Watchlist"
        href="/watchlist"
        count={watchlist.length}
        icon={<Bookmark className="size-4" aria-hidden="true" />}
      >
        {watchlist.length ? (
          <div className={GRID}>
            {watchlist.slice(0, PREVIEW_LIMIT).map((movie, index) => (
              <WatchlistCard
                key={movie.imdbID}
                movie={movie}
                index={index}
                priority={index === 0}
                onLogMovie={onLogMovie}
                onRemove={onRemoveFromWatchlist}
              />
            ))}
          </div>
        ) : (
          <EmptyList
            icon={<Bookmark className="size-5" aria-hidden="true" />}
            title="Your watchlist is empty"
            copy="Search above and add a film when something catches your eye."
          />
        )}
      </Section>

      <hr className="border-t border-[var(--line)]" />

      <Section
        title="Watched log"
        href="/watched"
        count={watched.length}
        icon={<Eye className="size-4" aria-hidden="true" />}
      >
        {watched.length ? (
          <div className={GRID}>
            {watched.slice(0, PREVIEW_LIMIT).map((movie, index) => (
              <WatchedCard
                key={movie.imdbID}
                movie={movie}
                index={index}
                priority={index === 0}
                onEdit={onEditWatched}
                onRemove={onRemoveFromWatched}
              />
            ))}
          </div>
        ) : (
          <EmptyList
            icon={<Eye className="size-5" aria-hidden="true" />}
            title="Nothing logged yet"
            copy="Log a film with a rating and a note to start your record."
          />
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  href,
  count,
  icon,
  children,
}: {
  title: string;
  href: string;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const hasMore = count > PREVIEW_LIMIT;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--surface)] text-[var(--muted)] shadow-[inset_0_0_0_1px_var(--line)]">
            {icon}
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)]">{title}</h2>
          <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-xs font-semibold text-[var(--muted)] shadow-[inset_0_0_0_1px_var(--line)] tabular-nums">
            {count}
          </span>
        </div>
        {count ? (
          <Link
            href={href}
            className="group inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-[var(--surface-2)] px-4 text-sm font-semibold text-[var(--ink-soft)] shadow-[inset_0_0_0_1px_var(--line)] transition-[background-color,color,transform] duration-150 ease-out hover:bg-[var(--surface-3)] hover:text-[var(--ink)] active:scale-[0.97]"
          >
            {hasMore ? `View all ${count}` : "View all"}
            <ArrowRight
              className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
