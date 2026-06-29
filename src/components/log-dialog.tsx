"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import type { LogDraft, Movie } from "@/types/movie";
import { RatingControl } from "@/components/rating-control";
import { Poster } from "@/components/poster";
import { Tooltip } from "@/components/tooltip";
import { usePresence } from "@/lib/use-presence";
import { cn } from "@/lib/cn";

type LogDialogProps = {
  movie: Movie | null;
  initialDraft?: LogDraft;
  onClose: () => void;
  onSave: (movie: Movie, draft: LogDraft) => void;
};

const DIALOG_MS = 220;

export function LogDialog({ movie, initialDraft, onClose, onSave }: LogDialogProps) {
  const open = movie != null;
  const { mounted, visible } = usePresence(open, DIALOG_MS);

  // Keep the last opened movie around so the exit animation has something to show.
  // Captured in state (not a ref) and refreshed during render when a new movie opens.
  const [cache, setCache] = useState<{ movie: Movie; initialDraft?: LogDraft } | null>(null);
  if (movie && cache?.movie !== movie) {
    setCache({ movie, initialDraft });
  }

  const shown = movie ? { movie, initialDraft } : cache;
  if (!mounted || !shown) return null;
  if (typeof document === "undefined") return null;

  const key = `${shown.movie.imdbID}-${shown.initialDraft?.rating ?? "new"}-${shown.initialDraft?.note ?? ""}`;

  return createPortal(
    <LogDialogForm
      key={key}
      movie={shown.movie}
      initialDraft={shown.initialDraft}
      visible={visible}
      onClose={onClose}
      onSave={onSave}
    />,
    document.body,
  );
}

function LogDialogForm({
  movie,
  initialDraft,
  visible,
  onClose,
  onSave,
}: LogDialogProps & { movie: Movie; visible: boolean }) {
  const titleId = useId();
  const panelRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(initialDraft?.rating ?? 0);
  const [note, setNote] = useState(initialDraft?.note ?? "");
  const [touched, setTouched] = useState(false);
  const isEditing = initialDraft !== undefined;

  // Lock scroll, trap Escape, and move focus into the dialog while it is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (rating === 0) return;

    onSave(movie, { rating, note });
    onClose();
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[var(--z-dialog)] flex items-center justify-center bg-[oklch(0_0_0_/_0.62)] p-4 backdrop-blur-md transition-opacity duration-[220ms] ease-out",
        visible ? "opacity-100" : "opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        ref={panelRef}
        tabIndex={-1}
        onSubmit={handleSubmit}
        className={cn(
          "max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-[20px] bg-[var(--surface)] shadow-[var(--shadow-lg)] outline-none ring-1 ring-[var(--line-strong)]",
          "transition-[transform,opacity] duration-[220ms] ease-out",
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] p-5">
          <div className="flex min-w-0 items-center gap-4">
            <Poster
              src={movie.poster}
              title={movie.title}
              className="w-16 shrink-0 rounded-xl"
              sizes="64px"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                {isEditing ? "Edit log" : "Log a watch"}
              </p>
              <h2 id={titleId} className="mt-1 line-clamp-2 text-lg font-semibold leading-6 text-[var(--ink)]">
                {movie.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)] tabular-nums">{movie.year}</p>
            </div>
          </div>
          <Tooltip label="Close">
            <button
              type="button"
              onClick={onClose}
              className="grid size-10 shrink-0 place-items-center rounded-xl text-[var(--muted)] transition-[background-color,color,transform] duration-150 ease-out hover:bg-[var(--surface-2)] hover:text-[var(--ink)] active:scale-95"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>

        <div className="space-y-6 p-5">
          <div>
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-[var(--ink-soft)]">Your rating</label>
              {touched && rating === 0 ? (
                <span className="text-sm font-semibold text-[var(--danger)]">Choose a rating</span>
              ) : null}
            </div>
            <RatingControl value={rating} onChange={setRating} />
          </div>

          <div>
            <label htmlFor="watch-note" className="text-sm font-medium text-[var(--ink-soft)]">
              Note <span className="font-normal text-[var(--muted)]">(optional)</span>
            </label>
            <textarea
              id="watch-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              maxLength={180}
              placeholder="What stayed with you?"
              className="mt-2 w-full resize-none rounded-xl bg-[var(--bg-2)] px-3.5 py-3 text-sm leading-6 text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--line)] outline-none transition-[box-shadow] duration-150 placeholder:text-[var(--muted)] focus:shadow-[inset_0_0_0_1.5px_var(--accent-line)]"
            />
            <div className="mt-1.5 text-right text-xs text-[var(--muted)] tabular-nums">
              {note.length}/180
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[var(--line)] p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--surface-2)] px-5 text-sm font-semibold text-[var(--ink-soft)] shadow-[inset_0_0_0_1px_var(--line)] transition-[background-color,color,transform] duration-150 ease-out hover:bg-[var(--surface-3)] hover:text-[var(--ink)] active:scale-[0.97]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)] shadow-[var(--shadow-accent)] transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--accent-strong)] active:scale-[0.97]"
          >
            <Check className="size-4" aria-hidden="true" />
            {isEditing ? "Save changes" : "Save to log"}
          </button>
        </div>
      </form>
    </div>
  );
}
