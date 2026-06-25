"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, Eye, Search } from "lucide-react";
import { EmptyList, WatchedCard, WatchlistCard } from "@/components/movie-card";
import { LogDialog } from "@/components/log-dialog";
import { useMovieStore } from "@/store/movie-store";
import type { LogDraft, Movie, WatchedMovie } from "@/types/movie";

type MovieListPageProps = {
  kind: "watchlist" | "watched";
};

type DialogState =
  | { mode: "create"; movie: Movie }
  | { mode: "edit"; movie: WatchedMovie }
  | null;

const GRID = "grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(168px,1fr))]";

export function MovieListPage({ kind }: MovieListPageProps) {
  const {
    watchlist,
    watched,
    hasHydrated,
    logMovie,
    updateWatched,
    removeFromWatchlist,
    removeFromWatched,
  } = useMovieStore();
  const [dialogState, setDialogState] = useState<DialogState>(null);

  const isWatchlist = kind === "watchlist";
  const title = isWatchlist ? "Watchlist" : "Watched log";
  const count = isWatchlist ? watchlist.length : watched.length;
  const icon = isWatchlist ? (
    <Bookmark className="size-5" aria-hidden="true" />
  ) : (
    <Eye className="size-5" aria-hidden="true" />
  );

  const subtitle = useMemo(() => {
    if (isWatchlist) {
      return count === 1 ? "1 film queued up" : `${count} films queued up`;
    }
    return count === 1 ? "1 film logged" : `${count} films logged`;
  }, [count, isWatchlist]);

  function saveLog(movie: Movie, draft: LogDraft) {
    if (dialogState?.mode === "edit") {
      updateWatched(movie.imdbID, draft);
      return;
    }

    logMovie(movie, draft);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="mb-7 flex items-center gap-3.5">
        <span className="grid size-12 place-items-center rounded-2xl bg-[var(--accent-quiet)] text-[var(--accent)] shadow-[inset_0_0_0_1px_var(--accent-line)]">
          {icon}
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] text-balance">
            {title}
          </h1>
          <p className="text-sm text-[var(--muted)] tabular-nums">{subtitle}</p>
        </div>
      </div>

      {hasHydrated ? (
        isWatchlist ? (
          watchlist.length ? (
            <div className={GRID}>
              {watchlist.map((movie, index) => (
                <WatchlistCard
                  key={movie.imdbID}
                  movie={movie}
                  index={index}
                  priority={index < 5}
                  onLogMovie={(nextMovie) => setDialogState({ mode: "create", movie: nextMovie })}
                  onRemove={removeFromWatchlist}
                />
              ))}
            </div>
          ) : (
            <EmptyList
              icon={<Bookmark className="size-5" aria-hidden="true" />}
              title="Your watchlist is empty"
              copy="Find a film from search and add it to plan your next watch."
              action={<FindFilmsLink />}
            />
          )
        ) : watched.length ? (
          <div className={GRID}>
            {watched.map((movie, index) => (
              <WatchedCard
                key={movie.imdbID}
                movie={movie}
                index={index}
                priority={index < 5}
                onEdit={(nextMovie) => setDialogState({ mode: "edit", movie: nextMovie })}
                onRemove={removeFromWatched}
              />
            ))}
          </div>
        ) : (
          <EmptyList
            icon={<Eye className="size-5" aria-hidden="true" />}
            title="Nothing logged yet"
            copy="Mark a film as watched with a rating to start your record."
            action={<FindFilmsLink />}
          />
        )
      ) : (
        <ListSkeleton />
      )}

      <LogDialog
        movie={dialogState?.movie ?? null}
        initialDraft={
          dialogState?.mode === "edit"
            ? { rating: dialogState.movie.rating, note: dialogState.movie.note ?? "" }
            : undefined
        }
        onClose={() => setDialogState(null)}
        onSave={saveLog}
      />
    </div>
  );
}

function FindFilmsLink() {
  return (
    <Link
      href="/"
      className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)] shadow-[var(--shadow-accent)] transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--accent-strong)] active:scale-[0.97]"
    >
      <Search className="size-4" aria-hidden="true" />
      Find films
    </Link>
  );
}

function ListSkeleton() {
  return (
    <div className={GRID}>
      {Array.from({ length: 10 }).map((_, item) => (
        <div
          key={item}
          className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)] shadow-[inset_0_0_0_1px_var(--line)]"
        >
          <div className="skeleton aspect-[2/3] w-full" />
          <div className="space-y-3 p-3">
            <div className="skeleton h-4 w-4/5 rounded" />
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-10 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
