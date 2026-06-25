"use client";

import { useMemo, useState } from "react";
import { CollectionRails } from "@/components/collection-rails";
import { LogDialog } from "@/components/log-dialog";
import { SearchPanel } from "@/components/search-panel";
import { seedSearchResults } from "@/lib/seed-movies";
import { useMovieStore } from "@/store/movie-store";
import type { LogDraft, Movie, WatchedMovie } from "@/types/movie";

type DialogState =
  | { mode: "create"; movie: Movie }
  | { mode: "edit"; movie: WatchedMovie }
  | null;

export function MovieApp() {
  const {
    watchlist,
    watched,
    hasHydrated,
    addToWatchlist,
    logMovie,
    updateWatched,
    removeFromWatchlist,
    removeFromWatched,
  } = useMovieStore();
  const [dialogState, setDialogState] = useState<DialogState>(null);

  const watchlistIds = useMemo(
    () => new Set(watchlist.map((movie) => movie.imdbID)),
    [watchlist],
  );
  const watchedIds = useMemo(() => new Set(watched.map((movie) => movie.imdbID)), [watched]);

  function saveLog(movie: Movie, draft: LogDraft) {
    if (dialogState?.mode === "edit") {
      updateWatched(movie.imdbID, draft);
      return;
    }

    logMovie(movie, draft);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      {hasHydrated ? (
        <div className="space-y-10">
          <SearchPanel
            watchlistIds={watchlistIds}
            watchedIds={watchedIds}
            defaultResults={seedSearchResults}
            onAddToWatchlist={addToWatchlist}
            onLogMovie={(movie) => setDialogState({ mode: "create", movie })}
          />
          <hr className="border-t border-[var(--line)]" />
          <CollectionRails
            watchlist={watchlist}
            watched={watched}
            onLogMovie={(movie) => setDialogState({ mode: "create", movie })}
            onEditWatched={(movie) => setDialogState({ mode: "edit", movie })}
            onRemoveFromWatchlist={removeFromWatchlist}
            onRemoveFromWatched={removeFromWatched}
          />
        </div>
      ) : (
        <HomeSkeleton />
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

function HomeSkeleton() {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-4">
        <div className="skeleton h-9 w-72 rounded-lg" />
        <div className="skeleton h-5 w-full max-w-md rounded" />
        <div className="skeleton h-14 w-full rounded-2xl" />
      </div>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(168px,1fr))]">
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
    </div>
  );
}
