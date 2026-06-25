"use client";

import { BookmarkPlus, Check, Pencil, Star, Trash2 } from "lucide-react";
import type { Movie, WatchedMovie, WatchlistMovie } from "@/types/movie";
import { Poster } from "@/components/poster";
import { Tooltip } from "@/components/tooltip";
import { cn } from "@/lib/cn";

/* ----------------------------- shared pieces ----------------------------- */

const POSTER_SIZES = "(max-width: 480px) 44vw, (max-width: 768px) 30vw, (max-width: 1280px) 22vw, 200px";

function CardShell({
  testId,
  index = 0,
  children,
}: {
  testId?: string;
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <article
      data-testid={testId}
      className="card reveal group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)]"
      style={{ "--reveal-delay": `${Math.min(index, 10) * 35}ms` } as React.CSSProperties}
    >
      {children}
    </article>
  );
}

function Title({ title, year }: { title: string; year: string }) {
  return (
    <div className="min-w-0">
      <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[var(--ink)] text-pretty">
        {title}
      </h3>
      <p className="mt-1 text-xs font-medium text-[var(--muted)] tabular-nums">{year}</p>
    </div>
  );
}

function AccentButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 text-xs font-semibold text-[var(--accent-ink)]",
        "shadow-[var(--shadow-accent)] transition-[background-color,transform,opacity] duration-150 ease-out",
        "hover:bg-[var(--accent-strong)] active:scale-[0.96]",
        "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink-soft)]",
        "shadow-[inset_0_0_0_1px_var(--line)] transition-[background-color,color,transform,opacity] duration-150 ease-out",
        "hover:bg-[var(--surface-3)] hover:text-[var(--ink)] active:scale-[0.96]",
        "disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function IconButton({
  danger = false,
  tooltip,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean; tooltip?: string }) {
  const button = (
    <button
      type="button"
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)]",
        "shadow-[inset_0_0_0_1px_var(--line)] transition-[background-color,color,transform] duration-150 ease-out active:scale-95",
        danger
          ? "hover:bg-[var(--danger-quiet)] hover:text-[var(--danger)]"
          : "hover:bg-[var(--surface-3)] hover:text-[var(--ink)]",
        className,
      )}
      {...props}
    />
  );

  return tooltip ? <Tooltip label={tooltip}>{button}</Tooltip> : button;
}

/* ------------------------------ search card ------------------------------ */

export function SearchCard({
  movie,
  isInWatchlist,
  isWatched,
  priority = false,
  index = 0,
  onAddToWatchlist,
  onLogMovie,
}: {
  movie: Movie;
  isInWatchlist: boolean;
  isWatched: boolean;
  priority?: boolean;
  index?: number;
  onAddToWatchlist: (movie: Movie) => void;
  onLogMovie: (movie: Movie) => void;
}) {
  const queued = isInWatchlist || isWatched;

  return (
    <CardShell testId={`search-result-${movie.imdbID}`} index={index}>
      <div className="relative">
        <Poster src={movie.poster} title={movie.title} sizes={POSTER_SIZES} priority={priority} interactive />
        {isWatched ? (
          <Badge tone="accent">
            <Check className="size-3.5" aria-hidden="true" />
            Watched
          </Badge>
        ) : isInWatchlist ? (
          <Badge tone="neutral">
            <BookmarkPlus className="size-3.5" aria-hidden="true" />
            Queued
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <Title title={movie.title} year={movie.year} />
        <div className="mt-auto flex gap-2">
          <GhostButton
            data-testid={`queue-${movie.imdbID}`}
            onClick={() => onAddToWatchlist(movie)}
            disabled={queued}
          >
            {isInWatchlist || isWatched ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <BookmarkPlus className="size-3.5" aria-hidden="true" />
            )}
            {isInWatchlist ? "Queued" : isWatched ? "Done" : "Plan"}
          </GhostButton>
          <AccentButton
            data-testid={`log-${movie.imdbID}`}
            onClick={() => onLogMovie(movie)}
            disabled={isWatched}
          >
            {isWatched ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Star className="size-3.5" aria-hidden="true" />
            )}
            {isWatched ? "Logged" : "Log"}
          </AccentButton>
        </div>
      </div>
    </CardShell>
  );
}

/* ----------------------------- watchlist card ---------------------------- */

export function WatchlistCard({
  movie,
  priority = false,
  index = 0,
  onLogMovie,
  onRemove,
}: {
  movie: WatchlistMovie;
  priority?: boolean;
  index?: number;
  onLogMovie: (movie: Movie) => void;
  onRemove: (imdbID: string) => void;
}) {
  return (
    <CardShell testId={`watchlist-${movie.imdbID}`} index={index}>
      <div className="relative">
        <Poster src={movie.poster} title={movie.title} sizes={POSTER_SIZES} priority={priority} interactive />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3">
        <Title title={movie.title} year={movie.year} />
        <div className="mt-auto flex gap-2">
          <AccentButton
            data-testid={`mark-watched-${movie.imdbID}`}
            onClick={() => onLogMovie(movie)}
            className="whitespace-nowrap"
          >
            <Star className="size-3.5" aria-hidden="true" />
            Watched
          </AccentButton>
          <IconButton
            danger
            tooltip="Remove"
            data-testid={`remove-watchlist-${movie.imdbID}`}
            onClick={() => onRemove(movie.imdbID)}
            aria-label={`Remove ${movie.title} from watchlist`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </IconButton>
        </div>
      </div>
    </CardShell>
  );
}

/* ------------------------------ watched card ----------------------------- */

export function WatchedCard({
  movie,
  priority = false,
  index = 0,
  onEdit,
  onRemove,
}: {
  movie: WatchedMovie;
  priority?: boolean;
  index?: number;
  onEdit: (movie: WatchedMovie) => void;
  onRemove: (imdbID: string) => void;
}) {
  return (
    <CardShell testId={`watched-${movie.imdbID}`} index={index}>
      <div className="relative">
        <Poster src={movie.poster} title={movie.title} sizes={POSTER_SIZES} priority={priority} interactive />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[oklch(0_0_0_/_0.7)] to-transparent" />
        <div
          className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-[oklch(0_0_0_/_0.55)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)] backdrop-blur-sm tabular-nums"
          aria-label={`Rated ${movie.rating} out of 5`}
        >
          <Star className="size-3.5 fill-[var(--accent)] text-[var(--accent)]" aria-hidden="true" />
          {movie.rating}
          <span className="text-[var(--muted)]">/5</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <Title title={movie.title} year={movie.year} />
        {movie.note ? (
          <p className="line-clamp-3 text-sm leading-6 text-[var(--ink-soft)] text-pretty">
            {movie.note}
          </p>
        ) : null}
        <div className="mt-auto flex justify-end gap-2">
          <IconButton
            tooltip="Edit rating & note"
            data-testid={`edit-watched-${movie.imdbID}`}
            onClick={() => onEdit(movie)}
            aria-label={`Edit ${movie.title}`}
          >
            <Pencil className="size-4" aria-hidden="true" />
          </IconButton>
          <IconButton
            danger
            tooltip="Remove"
            data-testid={`remove-watched-${movie.imdbID}`}
            onClick={() => onRemove(movie.imdbID)}
            aria-label={`Remove ${movie.title} from log`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </IconButton>
        </div>
      </div>
    </CardShell>
  );
}

/* -------------------------------- badge ---------------------------------- */

function Badge({
  tone,
  children,
}: {
  tone: "accent" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm",
        tone === "accent"
          ? "bg-[var(--accent)] text-[var(--accent-ink)]"
          : "bg-[oklch(0_0_0_/_0.55)] text-[var(--ink)]",
      )}
    >
      {children}
    </span>
  );
}

/* ----------------------------- empty state ------------------------------- */

export function EmptyList({
  icon,
  title,
  copy,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] px-6 py-14 text-center shadow-[inset_0_0_0_1px_var(--line)]">
      {icon ? (
        <span className="grid size-12 place-items-center rounded-2xl bg-[var(--surface-2)] text-[var(--muted)] shadow-[inset_0_0_0_1px_var(--line)]">
          {icon}
        </span>
      ) : null}
      <div>
        <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
        <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-[var(--muted)] text-pretty">
          {copy}
        </p>
      </div>
      {action}
    </div>
  );
}
