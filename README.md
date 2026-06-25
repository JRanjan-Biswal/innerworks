# Framekeep

A small Next.js movie tracker for managing a watchlist and a watched log. Movies are searched through the OMDB API, while the user's lists persist locally in the browser.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add a free OMDB API key to `.env.local`:

```bash
OMDB_API_KEY=your_key_here
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Implementation Notes

- Next.js App Router is used for the app shell and a small `/api/omdb` route handler.
- The OMDB key stays server-side. The browser calls the local route, which proxies search requests to OMDB.
- Search is debounced and aborts stale requests while still supporting an immediate submit.
- Zustand owns the watchlist and watched log, with `persist` writing movie state to localStorage.
- A small Pirates of the Caribbean dataset is shown on first load so the app does not open empty.
- The homepage keeps watchlist and watched previews in always-visible carousel panels, showing two items by default.
- Full list management lives on `/watchlist` and `/watched`.
- The store keeps watchlist and watched entries mutually exclusive, so logging a movie automatically removes it from the watchlist.
- Watched movies can be rated, annotated, edited, or removed.
- Search has loading skeletons, empty states, invalid-query handling, API configuration errors, and duplicate-aware actions.

## Tradeoffs

I kept the scope close to the assignment rather than building accounts or share links. With more time, I would add pagination for OMDB results, richer movie detail fetching by IMDb ID, and a small test suite around the store reducers and API route normalization.

## Tools Used

- Next.js, React, TypeScript, Tailwind CSS
- Zustand for state management and localStorage persistence
- lucide-react for icons
- OMDB API documentation
- OpenAI Codex for implementation support
- Local Codex skills: ui-ux-pro-max, impeccable, 12-principles-of-animation, make-interfaces-feel-better
