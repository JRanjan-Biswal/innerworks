import type { NextRequest } from "next/server";
import type { Movie, OmdbSearchItem, OmdbSearchResponse } from "@/types/movie";

const OMDB_URL = process.env.OMDB_URL ?? "https://www.omdbapi.com/";

function normalizePoster(poster: string) {
  return poster && poster !== "N/A" ? poster : null;
}

function toMovie(movie: OmdbSearchItem): Movie {
  return {
    imdbID: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    type: movie.Type,
    poster: normalizePoster(movie.Poster),
  };
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.OMDB_API_KEY;
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!apiKey) {
    return Response.json(
      { error: "OMDB_API_KEY is not configured. Add it to .env.local and restart the dev server." },
      { status: 503 },
    );
  }

  if (!query || query.length < 2) {
    return Response.json({ error: "Search with at least two characters." }, { status: 400 });
  }

  const url = new URL(OMDB_URL);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("s", query);
  url.searchParams.set("type", "movie");
  url.searchParams.set("page", "1");

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    return Response.json({ error: "OMDB is unavailable right now." }, { status: 502 });
  }

  const payload = (await response.json()) as OmdbSearchResponse;

  if (payload.Response === "False") {
    if (payload.Error !== "Movie not found!") {
      return Response.json({ error: payload.Error }, { status: 502 });
    }

    return Response.json({
      results: [],
      totalResults: 0,
      message: payload.Error,
    });
  }

  return Response.json({
    results: payload.Search.map(toMovie),
    totalResults: Number(payload.totalResults) || payload.Search.length,
  });
}
