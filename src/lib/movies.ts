import type { MovieSearchResponse } from "@/types/movie";

export async function searchMovies(query: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ q: query.trim() });
  const response = await fetch(`/api/omdb?${params.toString()}`, { signal });
  const payload = (await response.json()) as MovieSearchResponse | { error: string };

  if (!response.ok) {
    throw new Error("error" in payload ? payload.error : "Movie search failed.");
  }

  return payload as MovieSearchResponse;
}
