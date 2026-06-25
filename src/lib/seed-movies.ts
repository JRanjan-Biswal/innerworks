import type { Movie, WatchedMovie, WatchlistMovie } from "@/types/movie";

export const SAMPLE_SEED_VERSION = 2;

export const seedWatchlist: WatchlistMovie[] = [
  {
    imdbID: "tt0449088",
    title: "Pirates of the Caribbean: At World's End",
    year: "2007",
    type: "movie",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjIyNjkxNzEyMl5BMl5BanBnXkFtZTYwMjc3MDE3._V1_QL75_UX380_CR0,0,380,562_.jpg",
    addedAt: "2026-06-15T10:00:00.000Z",
  },
  {
    imdbID: "tt0383574",
    title: "Pirates of the Caribbean: Dead Man's Chest",
    year: "2006",
    type: "movie",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTcwODc1MTMxM15BMl5BanBnXkFtZTYwMDg1NzY3._V1_QL75_UX380_CR0,0,380,562_.jpg",
    addedAt: "2026-06-12T10:00:00.000Z",
  },
];

export const seedWatched: WatchedMovie[] = [
  {
    imdbID: "tt0325980",
    title: "Pirates of the Caribbean: The Curse of the Black Pearl",
    year: "2003",
    type: "movie",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNDhlMzEyNzItMTA5Mi00YWRhLThlNTktYTQyMTA0MDIyNDEyXkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg",
    rating: 5,
    note: "The one that still has the cleanest sense of adventure.",
    watchedAt: "2026-06-10T10:00:00.000Z",
  },
  {
    imdbID: "tt1298650",
    title: "Pirates of the Caribbean: On Stranger Tides",
    year: "2011",
    type: "movie",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjE5MjkwODI3Nl5BMl5BanBnXkFtZTcwNjcwMDk4NA@@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    rating: 3,
    note: "Messier than the early run, but still has enough sea air to count.",
    watchedAt: "2026-06-08T10:00:00.000Z",
  },
];

export const seedSearchResults: Movie[] = [
  ...seedWatchlist,
  ...seedWatched,
  {
    imdbID: "tt1790809",
    title: "Pirates of the Caribbean: Dead Men Tell No Tales",
    year: "2017",
    type: "movie" as const,
    poster: "https://m.media-amazon.com/images/M/MV5BMTYyMTcxNzc5M15BMl5BanBnXkFtZTgwOTg2ODE2MTI@._V1_SX300.jpg",
  },
].map((movie) => ({
  imdbID: movie.imdbID,
  title: movie.title,
  year: movie.year,
  type: movie.type,
  poster: movie.poster,
}));
