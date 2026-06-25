"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search, XCircle } from "lucide-react";
import { searchMovies } from "@/lib/movies";
import type { Movie, MovieSearchResponse } from "@/types/movie";
import { SearchCard } from "@/components/movie-card";
import { Tooltip } from "@/components/tooltip";

const SEARCH_DEBOUNCE_MS = 450;
const GRID = "grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(168px,1fr))]";

type SearchPanelProps = {
  watchlistIds: Set<string>;
  watchedIds: Set<string>;
  defaultResults?: Movie[];
  onAddToWatchlist: (movie: Movie) => void;
  onLogMovie: (movie: Movie) => void;
};

export function SearchPanel({
  watchlistIds,
  watchedIds,
  defaultResults = [],
  onAddToWatchlist,
  onLogMovie,
}: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [payload, setPayload] = useState<MovieSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);

  const visibleResults = payload?.results.length ? payload.results : defaultResults;
  const showingFallback = visibleResults === defaultResults;

  const resultLabel = useMemo(() => {
    if (payload && lastQuery && payload.totalResults === 0) {
      return `No matches for “${lastQuery}”. Showing a starter set instead.`;
    }

    if (!payload || !lastQuery) {
      return defaultResults.length ? "A few picks to get you started" : null;
    }

    return `${Math.min(payload.results.length, payload.totalResults)} of ${payload.totalResults} matches for “${lastQuery}”`;
  }, [defaultResults.length, payload, lastQuery]);

  const runSearch = useCallback(async (rawQuery: string, showValidation = false) => {
    const nextQuery = rawQuery.trim();

    activeRequest.current?.abort();

    if (nextQuery.length < 2) {
      setPayload(null);
      setLastQuery("");
      setIsLoading(false);
      setError(showValidation ? "Type at least two characters to search." : null);
      return;
    }

    const controller = new AbortController();
    activeRequest.current = controller;

    setIsLoading(true);
    setError(null);
    setLastQuery(nextQuery);

    try {
      const nextPayload = await searchMovies(nextQuery, controller.signal);
      setPayload(nextPayload);
    } catch (searchError) {
      if (controller.signal.aborted) return;
      setPayload(null);
      setError(searchError instanceof Error ? searchError.message : "Movie search failed.");
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        if (activeRequest.current === controller) {
          activeRequest.current = null;
        }
      }
    }
  }, []);

  useEffect(() => {
    const nextQuery = query.trim();
    if (nextQuery.length < 2) return;

    const debounce = window.setTimeout(() => {
      void runSearch(nextQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(debounce);
  }, [query, runSearch]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(query, true);
  }

  function handleQueryChange(value: string) {
    const nextQuery = value.trim();

    setQuery(value);
    activeRequest.current?.abort();
    setIsLoading(false);
    setError(null);

    if (nextQuery.length < 2) {
      setPayload(null);
      setLastQuery("");
      return;
    }

    setPayload(null);
  }

  function clearSearch() {
    activeRequest.current?.abort();
    setQuery("");
    setLastQuery("");
    setPayload(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <section className="min-w-0">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] text-balance sm:text-4xl">
          Find your next film
        </h1>
        <p className="mt-2 text-base leading-7 text-[var(--muted)] text-pretty">
          Search the catalogue, queue what looks good, and log what you have already seen.
        </p>

        <form onSubmit={handleSearch} className="mt-5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--muted)]"
              aria-hidden="true"
            />
            <span className="sr-only">Search movies by title</span>
            <input
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="Search by title — try “Pirates”"
              autoComplete="off"
              className="h-14 w-full rounded-2xl bg-[var(--surface)] pl-12 pr-28 text-base text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--line)] outline-none transition-[box-shadow] duration-200 placeholder:text-[var(--muted)] focus:shadow-[inset_0_0_0_1.5px_var(--accent-line)]"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {query ? (
                <Tooltip label="Clear search">
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="grid size-10 place-items-center rounded-xl text-[var(--muted)] transition-[background-color,color,transform] duration-150 ease-out hover:bg-[var(--surface-2)] hover:text-[var(--ink)] active:scale-95"
                    aria-label="Clear search"
                  >
                    <XCircle className="size-5" aria-hidden="true" />
                  </button>
                </Tooltip>
              ) : null}
              <Tooltip label="Search">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="grid size-10 place-items-center rounded-xl bg-[var(--accent)] text-[var(--accent-ink)] shadow-[var(--shadow-accent)] transition-[background-color,transform,opacity] duration-150 ease-out hover:bg-[var(--accent-strong)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-55"
                  aria-label="Search now"
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Search className="size-5" aria-hidden="true" />
                  )}
                </button>
              </Tooltip>
            </div>
          </div>
        </form>

        <div className="mt-3 flex min-h-6 flex-wrap items-center gap-2" aria-live="polite">
          {error ? (
            <span className="rounded-lg bg-[var(--danger-quiet)] px-3 py-1.5 text-sm font-medium text-[var(--danger)]">
              {error}
            </span>
          ) : resultLabel ? (
            <>
              <span className="text-sm text-[var(--muted)] tabular-nums">{resultLabel}</span>
              {showingFallback && defaultResults.length ? (
                <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ink-soft)] shadow-[inset_0_0_0_1px_var(--line)]">
                  Starter set
                </span>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <SearchSkeleton />
        ) : visibleResults.length ? (
          <div className={GRID}>
            {visibleResults.map((movie, index) => (
              <SearchCard
                key={movie.imdbID}
                movie={movie}
                index={index}
                priority={index < 4}
                isInWatchlist={watchlistIds.has(movie.imdbID)}
                isWatched={watchedIds.has(movie.imdbID)}
                onAddToWatchlist={onAddToWatchlist}
                onLogMovie={onLogMovie}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SearchSkeleton() {
  return (
    <div className={GRID} aria-label="Loading search results">
      {Array.from({ length: 10 }).map((_, item) => (
        <div
          key={item}
          className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)] shadow-[inset_0_0_0_1px_var(--line)]"
        >
          <div className="skeleton aspect-[2/3] w-full" />
          <div className="space-y-3 p-3">
            <div className="skeleton h-4 w-4/5 rounded" />
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="flex gap-2 pt-1">
              <div className="skeleton h-10 flex-1 rounded-xl" />
              <div className="skeleton h-10 flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
