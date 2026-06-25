# Framekeep

Framekeep is a small movie tracking application built for the Innerworks frontend engineering assignment. It lets a user search movies through OMDB, keep a watchlist of films they want to see, and maintain a watched log with ratings and short notes.

Live demo: [https://innerworks.vercel.app](https://innerworks.vercel.app)

GitHub repo: [https://github.com/JRanjan-Biswal/innerworks](https://github.com/JRanjan-Biswal/innerworks)

## Product Summary

The goal of Framekeep is to make the core movie tracking flow feel fast, useful, and polished without turning a small assignment into an overbuilt product. The app focuses on the everyday loop of finding a title, saving it for later, and recording what you watched.

I developed the full website structure, application logic, API integration, and state management first. Once the core product was working end to end, I used AI assisted UI skills as a review and polish layer to improve the interface, motion, responsive behavior, accessibility details, and overall presentation.

## User Flow

1. The user lands on the home page and immediately sees a useful starter state instead of an empty screen. A small Pirates of the Caribbean movie set is shown by default so the interface has real content from the first load.

2. The user searches OMDB by movie title. Search is debounced, so the app waits briefly while the user types instead of firing a request for every keystroke. The user can also submit immediately with the search button.

3. Search results can be added to the Watchlist or logged directly as watched. Each result is aware of the current state, so movies already queued or already watched show the correct disabled action state.

4. The Watchlist is for movies the user wants to watch later. A movie can be removed from this list or moved into the Watched Log.

5. When a movie is moved into the Watched Log, the user gives it a rating and can optionally add a short note.

6. The Watched Log stores the movie, rating, note, and watched timestamp. Watched entries can be edited or removed.

7. The home page shows a focused preview of both lists. Dedicated pages at `/watchlist` and `/watched` provide the full list views.

8. The user can refresh the browser and keep their saved movies because the app persists state in localStorage through Zustand.

## Technical Flow

The app uses Next.js App Router with a small server route at `/api/omdb`. The browser never calls OMDB directly with the API key. Instead, the client calls the local API route, and the route forwards the request to OMDB using `OMDB_API_KEY` from the environment.

The UI is composed from focused components: search, movie cards, collection rails, rating controls, poster rendering, navigation, and the watched log dialog. The app state lives in a Zustand store, which keeps the watchlist and watched log mutually exclusive. When a movie is logged as watched, it is automatically removed from the watchlist.

The store also handles hydration and persistence. A small seed data set is used for the first meaningful load, but saved user data takes priority once localStorage is hydrated.

## State Management

Zustand is used because the state model is shared across multiple routes and components, but it does not require the weight of a larger state library. The store owns the watchlist, watched log, hydration status, and list actions.

The important state actions are adding a movie to the watchlist, logging a movie as watched, updating a watched rating or note, removing from the watchlist, and removing from the watched log.

The persistence layer writes only the movie state that needs to survive refreshes. UI only state such as the active dialog remains local to the component.

## API Handling

OMDB search requests are proxied through the Next.js route handler. The route validates short queries, handles missing API configuration, normalizes poster values, maps OMDB response fields into the local movie type, and returns a predictable response shape to the frontend.

This keeps API key handling server side and gives the UI a cleaner data contract.

## UI And UX Direction

The interface is designed to feel like a compact, premium movie library rather than a generic dashboard. Posters carry most of the visual character, while the surrounding UI stays restrained and functional.

The layout is mobile first. Search is the primary action, movie cards are poster led, touch targets are sized for mobile use, and the full watchlist and watched log remain easy to reach. Loading, empty, duplicate, disabled, and error states are all represented.

Motion is used lightly. Interactions have quick transitions for feedback, and reduced motion preferences are respected.

## Where AI Was Used

I built the application flow, data model, state transitions, OMDB integration, routing structure, and core component architecture as the main implementation work.

After the product was functional, I used AI as a refinement tool rather than as a replacement for engineering judgment. The AI support was used to review the interface, challenge rough UI decisions, improve responsive behavior, tune interaction states, and make the final product feel more considered.

The following local skills were used during the polish stage:

`ui-ux-pro-max`: Used to reason about product UI patterns, mobile first layout, search behavior, accessible color choices, and how the movie tracker should feel as a compact product surface.

`impeccable`: Used as a product and interface critique layer. It helped define the product context, avoid generic AI looking UI patterns, and keep the visual direction grounded in a real product brief.

`make-interfaces-feel-better`: Used for smaller interface details such as touch targets, typography, surface treatment, button feedback, hover states, focus states, and overall polish.

`12-principles-of-animation`: Used to keep motion subtle, fast, purposeful, and respectful of reduced motion preferences.

I also used OpenAI Codex as an implementation assistant while building and checking the project. The final decisions, scope, architecture, and code review judgment were handled from the frontend engineering perspective.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add a free OMDB API key to `.env.local`.

```bash
OMDB_URL=https://www.omdbapi.com/
OMDB_API_KEY=your_key_here
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Project Structure

`src/app` contains the App Router pages and the OMDB route handler.

`src/components` contains the application UI, including search, movie cards, collection rails, dialog, navigation, poster, tooltip, and rating components.

`src/store` contains the Zustand movie store and persistence logic.

`src/lib` contains movie search helpers, seed data, class name utilities, and small hooks.

`src/types` contains the movie and OMDB response types.

`.agents/skills` contains the local AI skills used for UI and UX refinement.

## Tradeoffs

I kept the assignment focused on the requested frontend experience instead of adding accounts, authentication, database storage, or shareable public lists. localStorage is enough for this scope and keeps the app easy to run.

With more time, I would add pagination for OMDB results, movie detail fetching by IMDb ID, a small reducer focused test suite, and a shareable read only list flow.

## Verification

The project was checked with linting and a production build.

```bash
npm run lint
npm run build
```
