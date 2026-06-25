"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type RatingControlProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
};

const DESCRIPTORS = ["", "Skip it", "It was fine", "Worth a watch", "Really good", "All-timer"];

export function RatingControl({
  value,
  onChange,
  readOnly = false,
  size = "md",
}: RatingControlProps) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;
  const label = value > 0 ? `${value} out of 5` : "No rating";

  if (readOnly) {
    return (
      <div className="flex items-center gap-2" aria-label={label}>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Star
              key={rating}
              aria-hidden="true"
              className={cn(
                size === "sm" ? "size-3.5" : "size-4",
                rating <= value
                  ? "fill-[var(--accent)] text-[var(--accent)]"
                  : "text-[var(--surface-3)]",
              )}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-[var(--muted)] tabular-nums">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((rating) => {
          const filled = rating <= shown;
          return (
            <button
              key={rating}
              type="button"
              className="group/star grid size-10 place-items-center rounded-xl transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--accent-quiet)] active:scale-95"
              onClick={() => onChange?.(rating)}
              onMouseEnter={() => setHovered(rating)}
              onFocus={() => setHovered(rating)}
              onBlur={() => setHovered(0)}
              aria-label={`Set rating to ${rating}`}
              title={`${rating} — ${DESCRIPTORS[rating]}`}
            >
              <Star
                aria-hidden="true"
                className={cn(
                  "size-5 transition-[transform,color,fill] duration-150 ease-out group-hover/star:scale-110",
                  filled
                    ? "fill-[var(--accent)] text-[var(--accent)]"
                    : "text-[var(--surface-3)]",
                )}
              />
            </button>
          );
        })}
      </div>
      <span
        className={cn(
          "text-sm font-medium tabular-nums transition-colors duration-150",
          shown ? "text-[var(--ink-soft)]" : "text-[var(--muted)]",
        )}
      >
        {shown ? `${shown} / 5 · ${DESCRIPTORS[shown]}` : "Tap to rate"}
      </span>
    </div>
  );
}
