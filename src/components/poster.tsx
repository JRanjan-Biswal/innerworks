"use client";

import { useState } from "react";
import Image from "next/image";
import { Clapperboard } from "lucide-react";
import { cn } from "@/lib/cn";

type PosterProps = {
  src: string | null;
  title: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Adds the hover-zoom behaviour when the poster sits inside a `.card`. */
  interactive?: boolean;
};

export function Poster({
  src,
  title,
  className,
  sizes,
  priority = false,
  interactive = false,
}: PosterProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "poster-frame relative aspect-[2/3] overflow-hidden bg-[var(--surface-2)]",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={`${title} poster`}
          fill
          sizes={sizes ?? "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"}
          className={cn("object-cover", interactive && "poster-media")}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center text-[var(--faint)]">
          <Clapperboard className="size-6" aria-hidden="true" />
          <span className="text-xs font-medium leading-4">No poster</span>
        </div>
      )}
    </div>
  );
}
