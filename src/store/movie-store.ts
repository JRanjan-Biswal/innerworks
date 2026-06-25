"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SAMPLE_SEED_VERSION, seedWatched, seedWatchlist } from "@/lib/seed-movies";
import type { LogDraft, Movie, WatchedMovie, WatchlistMovie } from "@/types/movie";

type MovieStore = {
  watchlist: WatchlistMovie[];
  watched: WatchedMovie[];
  sampleSeeded: boolean;
  sampleSeedVersion: number;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  addToWatchlist: (movie: Movie) => void;
  logMovie: (movie: Movie, draft: LogDraft) => void;
  updateWatched: (imdbID: string, draft: LogDraft) => void;
  removeFromWatchlist: (imdbID: string) => void;
  removeFromWatched: (imdbID: string) => void;
};

const byNewest = <T extends { addedAt?: string; watchedAt?: string }>(items: T[]) =>
  [...items].sort((a, b) => {
    const first = a.watchedAt ?? a.addedAt ?? "";
    const second = b.watchedAt ?? b.addedAt ?? "";
    return second.localeCompare(first);
  });

type PersistedMovieState = Partial<
  Pick<MovieStore, "watchlist" | "watched" | "sampleSeeded" | "sampleSeedVersion">
>;

const seedIds = new Set(
  [...seedWatchlist, ...seedWatched].map((movie) => movie.imdbID),
);

function mergeMissingSeedItems<T extends Movie>(savedItems: T[], seedItems: T[], existingIds: Set<string>) {
  return [...savedItems, ...seedItems.filter((movie) => !existingIds.has(movie.imdbID))];
}

function uniqueById<T extends Movie>(movies: T[]) {
  const seen = new Set<string>();

  return movies.filter((movie) => {
    if (seen.has(movie.imdbID)) return false;
    seen.add(movie.imdbID);
    return true;
  });
}

function mergePersistedState(persisted: unknown, current: MovieStore): MovieStore {
  const saved = persisted as PersistedMovieState | undefined;

  if (!saved) return current;

  const hasSavedMovies = Boolean(saved.watchlist?.length || saved.watched?.length);
  const cameFromOlderEmptyCache = saved.sampleSeeded === undefined && !hasSavedMovies;

  if (cameFromOlderEmptyCache) return current;

  const savedWatchlist = saved.watchlist ?? [];
  const savedWatched = saved.watched ?? [];
  const hasOnlySeedMovies = [...savedWatchlist, ...savedWatched].every((movie) =>
    seedIds.has(movie.imdbID),
  );
  const savedIds = new Set([...savedWatchlist, ...savedWatched].map((movie) => movie.imdbID));
  const shouldBackfillSeed =
    saved.sampleSeeded === true &&
    hasOnlySeedMovies &&
    (saved.sampleSeedVersion ?? 1) < SAMPLE_SEED_VERSION;
  const nextWatched = uniqueById(
    shouldBackfillSeed
      ? mergeMissingSeedItems(savedWatched, seedWatched, savedIds)
      : savedWatched,
  );
  const watchedIds = new Set(nextWatched.map((movie) => movie.imdbID));
  const nextWatchlist = uniqueById(
    shouldBackfillSeed
      ? mergeMissingSeedItems(savedWatchlist, seedWatchlist, savedIds)
      : savedWatchlist,
  ).filter((movie) => !watchedIds.has(movie.imdbID));

  return {
    ...current,
    ...saved,
    watchlist: nextWatchlist,
    watched: nextWatched,
    sampleSeeded: saved.sampleSeeded ?? true,
    sampleSeedVersion: SAMPLE_SEED_VERSION,
  };
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set) => ({
      watchlist: seedWatchlist,
      watched: seedWatched,
      sampleSeeded: true,
      sampleSeedVersion: SAMPLE_SEED_VERSION,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      addToWatchlist: (movie) =>
        set((state) => {
          if (
            state.watchlist.some((item) => item.imdbID === movie.imdbID) ||
            state.watched.some((item) => item.imdbID === movie.imdbID)
          ) {
            return state;
          }

          return {
            sampleSeeded: true,
            sampleSeedVersion: SAMPLE_SEED_VERSION,
            watchlist: byNewest([
              { ...movie, addedAt: new Date().toISOString() },
              ...state.watchlist,
            ]),
          };
        }),
      logMovie: (movie, draft) =>
        set((state) => {
          const nextWatched: WatchedMovie = {
            ...movie,
            rating: draft.rating,
            note: draft.note.trim() || undefined,
            watchedAt: new Date().toISOString(),
          };

          return {
            sampleSeeded: true,
            sampleSeedVersion: SAMPLE_SEED_VERSION,
            watchlist: state.watchlist.filter((item) => item.imdbID !== movie.imdbID),
            watched: byNewest([
              nextWatched,
              ...state.watched.filter((item) => item.imdbID !== movie.imdbID),
            ]),
          };
        }),
      updateWatched: (imdbID, draft) =>
        set((state) => ({
          sampleSeeded: true,
          sampleSeedVersion: SAMPLE_SEED_VERSION,
          watched: state.watched.map((movie) =>
            movie.imdbID === imdbID
              ? {
                  ...movie,
                  rating: draft.rating,
                  note: draft.note.trim() || undefined,
                }
              : movie,
          ),
        })),
      removeFromWatchlist: (imdbID) =>
        set((state) => ({
          sampleSeeded: true,
          sampleSeedVersion: SAMPLE_SEED_VERSION,
          watchlist: state.watchlist.filter((movie) => movie.imdbID !== imdbID),
        })),
      removeFromWatched: (imdbID) =>
        set((state) => ({
          sampleSeeded: true,
          sampleSeedVersion: SAMPLE_SEED_VERSION,
          watched: state.watched.filter((movie) => movie.imdbID !== imdbID),
        })),
    }),
    {
      name: "innerworks-movie-tracker",
      partialize: (state) => ({
        watchlist: state.watchlist,
        watched: state.watched,
        sampleSeeded: state.sampleSeeded,
        sampleSeedVersion: state.sampleSeedVersion,
      }),
      merge: mergePersistedState,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
