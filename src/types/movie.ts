export type MovieKind = "movie" | "series" | "episode";

export type Movie = {
  imdbID: string;
  title: string;
  year: string;
  type: MovieKind;
  poster: string | null;
};

export type WatchlistMovie = Movie & {
  addedAt: string;
};

export type WatchedMovie = Movie & {
  watchedAt: string;
  rating: number;
  note?: string;
};

export type OmdbSearchItem = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: MovieKind;
  Poster: string;
};

export type OmdbSearchResponse =
  | {
      Response: "True";
      Search: OmdbSearchItem[];
      totalResults: string;
    }
  | {
      Response: "False";
      Error: string;
    };

export type MovieSearchResponse = {
  results: Movie[];
  totalResults: number;
  message?: string;
};

export type LogDraft = {
  rating: number;
  note: string;
};
