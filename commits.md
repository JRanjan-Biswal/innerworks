# Commit Push Ledger

Append-only record of successful git pushes. Most recent push batches stay at the top.

Each entry includes:

```markdown
### <short-sha> — <subject>

- **Full SHA:** <40-char hash>
- **Branch:** <branch name when pushed>
- **Pushed to:** <remote>/<branch>
- **Pushed at:** <ISO-8601 UTC timestamp>
- **Author:** <Name <email>> or git user.name
- **Type:** feat | fix | chore | docs | refactor | merge | revert | security
- **Subject:** <conventional-commit subject>

#### Task — context
Why this commit exists. Problem statement, motivation, prior state, who/what asked for it.

#### Task — what changed
Bullet list grouped by area.

#### Task — design notes
Key decisions, trade-offs, alternatives rejected, back-compat guarantees.

#### Files
`git show --stat --format="" <sha>` summary.

#### Tests
What passed or was skipped.

#### Operator follow-up
Things a human must do. "None" is valid.

#### Related
Cross-refs to other SHAs.
```

## 2026-06-29 — push to origin/main (1 commit)

### 05de84d — fix: center log dialog modals

- **Full SHA:** 05de84df9e009211fe0b6a70bd3829cab9965d22
- **Branch:** main
- **Pushed to:** origin/main
- **Pushed at:** 2026-06-29T06:49:03Z
- **Author:** jranjan <jranjan2017@gmail.com>
- **Type:** fix
- **Subject:** fix: center log dialog modals

#### Task — context
The user reported a production UI issue on the Vercel deployment: "on this page : https://innerworks.vercel.app/ when i click on the edit button, the modal is not opening properly, rather the modal should be center of the screen. please make sure all the modal are at the center of the screen". The prior dialog behaved like a bottom sheet on smaller viewports and could also be affected by route-level transforms because it rendered inside the app tree instead of at the document root.

#### Task — what changed
- Web UI: updated `src/components/log-dialog.tsx` so the log/edit dialog is rendered through a React portal into `document.body`.
- Web UI: changed the modal overlay alignment to center the dialog on every breakpoint rather than bottom-aligning it on mobile.
- Web UI: added viewport-aware max height and internal scrolling so the centered modal remains usable on shorter screens.

#### Task — design notes
The portal prevents fixed-position dialog layout from being scoped by transformed route containers. Center alignment is now the single modal behavior across desktop and mobile, which keeps the edit flow visually consistent. The dialog keeps its existing save, cancel, Escape, backdrop-close, rating validation, and note editing behavior unchanged.

#### Files
`src/components/log-dialog.tsx` changed.

Summary: 1 file changed, 7 insertions(+), 4 deletions(-).

#### Tests
- `npm run lint` passed.
- `npm run build` passed.
- Playwright desktop check passed on `http://localhost:3000/watched`: the edit dialog was mounted under `body`, aligned with `items-center` and `justify-center`, and measured `centerDelta: { x: 0, y: 0 }`.
- Playwright mobile check passed at 390px by 844px on `http://localhost:3000/watched`: the edit dialog was mounted under `body`, had no horizontal overflow, and measured `centerDelta: { x: 0, y: 0 }`.

#### Operator follow-up
Deploy the pushed fix to Vercel and smoke test the production URL.

#### Related
Follows README publication commit `22131d88a4d8789d6a196cab8a765d9fc7706d76`.

## 2026-06-25 — fourth push to origin/main (1 commit)

### 22131d8 — docs: expand project readme

- **Full SHA:** 22131d88a4d8789d6a196cab8a765d9fc7706d76
- **Branch:** main
- **Pushed to:** origin/main
- **Pushed at:** 2026-06-25T07:34:40Z
- **Author:** jranjan <jranjan2017@gmail.com>
- **Type:** docs
- **Subject:** docs: expand project readme

#### Task — context
The user first asked to rewrite the README with the full flow and AI usage details, then clarified: "dont push anything right now, first show me once i give an approval then only push this to live". After reviewing the local README draft, the user approved with: "okay lets push this to live". This commit publishes the approved README rewrite to the public repository.

#### Task — what changed
- Docs: rewrote `README.md` as an extensive project handoff for Framekeep.
- Docs: added a product summary, user flow, technical flow, state management explanation, API handling explanation, UI and UX direction, project structure, tradeoffs, and verification notes.
- Docs: added a candid "Where AI Was Used" section that explains the app and logic were developed first, then local UI skills were used as a refinement layer.
- Docs: named the local skills used during UI polish: `ui-ux-pro-max`, `impeccable`, `make-interfaces-feel-better`, and `12-principles-of-animation`.

#### Task — design notes
The README was intentionally written in a prose-heavy, frontend-lead handoff style rather than a terse generated checklist. It avoids dash-heavy formatting, preserves a numbered user flow where sequencing matters, and frames AI as an assistive review and polish tool rather than the owner of the implementation.

#### Files
`README.md` changed.

Summary: 1 file changed, 99 insertions(+), 21 deletions(-).

#### Tests
- `git diff --check -- README.md` passed.
- `npm run lint` passed before the push.

#### Operator follow-up
None.

#### Related
Follows skill publication commit `e9a7bd0b07a69604ad05c3b418ee919cd8d09c4e`.

## 2026-06-25 — third push to origin/main (1 commit)

### e9a7bd0 — chore: publish local skills

- **Full SHA:** e9a7bd0b07a69604ad05c3b418ee919cd8d09c4e
- **Branch:** main
- **Pushed to:** origin/main
- **Pushed at:** 2026-06-25T07:17:10Z
- **Author:** jranjan <jranjan2017@gmail.com>
- **Type:** chore
- **Subject:** chore: publish local skills

#### Task — context
The user asked: "push the skill files as well and skill json file as well, remove Agents.md and claude.md file from root of the project. also check .env make chages accrodingly in .env.example". The prior push intentionally kept `.agents/` and `skills-lock.json` local, but this request reversed that choice so the installed skills and their lock metadata are now committed to the public repository.

#### Task — what changed
- Skills: committed the local `.agents/skills/` tree for `ui-ux-pro-max`, `12-principles-of-animation`, `impeccable`, and `make-interfaces-feel-better`.
- Skills metadata: committed `skills-lock.json` with sources, skill paths, and computed hashes.
- Root cleanup: removed root `AGENTS.md` and `CLAUDE.md`.
- Environment docs: updated `.env.example` to include the non-secret `OMDB_URL=https://www.omdbapi.com/` entry alongside the existing blank `OMDB_API_KEY=`.
- Ignore rules: removed `.agents/` and `skills-lock.json` from `.gitignore`; added Python cache ignores for generated `__pycache__/` and `*.py[cod]` files so compiled cache artifacts are not published.

#### Task — design notes
The real `.env` remains ignored and was not staged. `.env.example` mirrors the key names from local `.env` without exposing the OMDB API key. The downloaded skill source files were committed mostly verbatim; `git diff --cached --check` reports upstream whitespace issues inside third-party skill data/source files, so those assets were not reformatted to avoid altering vendor content. Generated Python cache files inside the skill folder were intentionally excluded.

#### Files
`.agents/skills/**`, `.env.example`, `.gitignore`, `skills-lock.json`, `AGENTS.md`, and `CLAUDE.md` changed.

Summary: 146 files changed, 61763 insertions(+), 10 deletions(-).

#### Tests
- `npm run lint` passed after staging the update.
- `git diff --cached --check -- .env.example .gitignore AGENTS.md CLAUDE.md skills-lock.json` passed for project-owned changes.
- Full `git diff --cached --check` was not clean because third-party skill files contain pre-existing trailing whitespace/newline issues; left unchanged intentionally.

#### Operator follow-up
None.

#### Related
Follows `95aa639a29fb8099f145144f24690726f69b2138` and `c1d3153dd3a5b9cbfa039f91ed1bc86f97590442`.

## 2026-06-25 — second push to origin/main (1 commit)

### 95aa639 — docs: add deployment details

- **Full SHA:** 95aa639a29fb8099f145144f24690726f69b2138
- **Branch:** main
- **Pushed to:** origin/main
- **Pushed at:** 2026-06-25T07:10:30Z
- **Author:** jranjan <jranjan2017@gmail.com>
- **Type:** docs
- **Subject:** docs: add deployment details

#### Task — context
After the production Vercel deploy completed, Vercel warned that it detected a local `.env` file during CLI deployment. The user had asked: "push this project to github keep it public and then deploy it on vercel as well". This follow-up push documents the live deployment URL in the public README and adds Vercel-specific ignore rules so future CLI deploys do not upload local env files or local agent tooling.

#### Task — what changed
- Docs: added the live production URL `https://innerworks.vercel.app` to `README.md`.
- Deploy: added `.vercelignore` to exclude `.env`, `.env.*`, `.agents/`, `skills-lock.json`, build output, dependencies, and coverage artifacts from future Vercel uploads.

#### Task — design notes
The application had already deployed successfully before this push. This commit is deployment hygiene: it keeps the public repo useful for reviewers while reducing the chance of local secrets or local-only tooling being sent to Vercel during future CLI deployments. `.env.example` remains committed for onboarding; real env files remain local.

#### Files
`.vercelignore` and `README.md` changed.

Summary: 2 files changed, 10 insertions(+).

#### Tests
No code was changed. The preceding app verification still applies: `npm run lint` and `npm run build` passed before deployment.

#### Operator follow-up
None.

#### Related
Follows initial app push `c1d3153dd3a5b9cbfa039f91ed1bc86f97590442` and deployment `dpl_7YC6snWsivhGXRp2nvbv9ynDgjXN`.

## 2026-06-25 — push to origin/main (1 commit)

### c1d3153 — feat: ship framekeep movie tracker

- **Full SHA:** c1d3153dd3a5b9cbfa039f91ed1bc86f97590442
- **Branch:** main
- **Pushed to:** origin/main
- **Pushed at:** 2026-06-25T07:07:42Z
- **Author:** jranjan <jranjan2017@gmail.com>
- **Type:** feat
- **Subject:** feat: ship framekeep movie tracker

#### Task — context
The user asked to publish the completed interview assignment: "push this project to github keep it public and then deploy it on vercel as well". This push created the public GitHub repository for the Framekeep movie tracker after the app had been built locally with Next.js, Zustand persistence, OMDB search, default Pirates seed data, watchlist and watched-log management, and a polished responsive UI.

#### Task — what changed
- App/API: added the OMDB proxy route in `src/app/api/omdb/route.ts`, movie normalization helpers in `src/lib/movies.ts`, local seed data in `src/lib/seed-movies.ts`, and typed movie models in `src/types/movie.ts`.
- State: added the persisted Zustand store in `src/store/movie-store.ts`, including hydration handling, seed backfill, duplicate prevention, watchlist-to-watched movement, rating/note updates, and removals.
- Web UI: replaced the starter page with the Framekeep app shell in `src/app/page.tsx`, added dedicated `/watchlist` and `/watched` routes, and introduced components for search, cards, collection rails, header/navigation, ratings, posters, tooltips, and log dialog workflows.
- Styling: expanded `src/app/globals.css` with the dark cinematic visual system, responsive layout tokens, touch/motion treatment, skeletons, transitions, and reduced-motion support.
- Docs/config: updated README setup/tooling notes, added `PRODUCT.md`, configured remote Amazon poster images in `next.config.ts`, added `.env.example`, and ignored local agent skill files from public source control.

#### Task — design notes
The implementation keeps the assignment scoped to a frontend app without authentication or share links. The OMDB key remains server-side through the local API route. Zustand `persist` keeps state in localStorage while the seed movies ensure the first load is not empty. The public repo intentionally excludes `.env`, `.agents/`, `.vercel/`, and `skills-lock.json`; README lists the local skills/tools instead of publishing their source. The UI prioritizes poster-led cards, mobile-first grids, explicit touch targets, debounced search, loading/error/empty states, and read-only visibility for persisted lists.

#### Files
`.env.example`, `.gitignore`, `PRODUCT.md`, `README.md`, `eslint.config.mjs`, `next.config.ts`, `package-lock.json`, `package.json`, and 25 files under `src/` changed.

Summary: 33 files changed, 2581 insertions(+), 101 deletions(-).

#### Tests
- `npm run lint` passed before push.
- `npm run build` passed before push.

#### Operator follow-up
Vercel deployment and production environment configuration are being handled immediately after this push as part of the same user request.

#### Related
Initial public repository push to `https://github.com/JRanjan-Biswal/innerworks`.
