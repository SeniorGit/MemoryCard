# Dragon Ball Memory

A memory card game with Dragon Ball characters. Flip two cards at a time, match every pair, and finish in as few moves as you can.

Unofficial fan project, not affiliated with the Dragon Ball franchise.

## Features

- Three difficulties: 6, 8 or 10 pairs
- Moves, time, pairs found, and a best score per difficulty (kept in `localStorage`)
- Character images are fetched and verified before a game starts, so a card can't fail to load mid-game
- Loading, error and retry states for the image API
- Responsive from 320px phones to desktop; the board is sized to fit the screen
- Keyboard play (arrow keys move between cards, Enter/Space flips), screen-reader announcements, reduced-motion support

## Tech stack

React 19, React Router 7 (SPA mode), TypeScript, Vite. No UI or CSS framework.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # static site in build/client
npm run preview    # serve the production build locally
npm run typecheck
```

## API

Character names and images come from the public [Dragon Ball API](https://dragonball-api.com):

`GET https://dragonball-api.com/api/characters?limit=100`

The list is requested once per page load and reused for every game. Images that fail to load are skipped and replaced with other characters.

## Environment variables

None are required. To point the game at a different API, create a `.env` file (it is git-ignored).

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://dragonball-api.com/api` | Base URL of the character API |

Vite embeds `VITE_*` variables in the client bundle, so they are public. Don't put secrets in them.

## Project structure

```
app/
  root.tsx            document shell, error boundary
  routes/home.tsx     the one route
  components/         Game, Board, CardView, Stats, Controls, Panels
  game/
    types.ts          shared types and difficulty settings
    logic.ts          pure game rules: deck creation, shuffle, reducer
    api.ts            fetching, validating and preloading characters
    storage.ts        best-score persistence
    useMemoryGame.ts  ties the reducer, API and timers together
  assets/             card-back artwork, title font
  app.css             all styles
```

## Gameplay

Click or tap a card to flip it, then flip a second one. A match stays face up; a mismatch flips back after a moment. The board is locked while a mismatch is showing. Find every pair to finish. Changing difficulty or pressing New Game deals a fresh set of characters.

## Deployment

The build output in `build/client` is plain static files. Upload it to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, nginx) and serve it from the site root.

## Credits

- Character data and images: [dragonball-api.com](https://dragonball-api.com)
- Title font: Saiyan Sans by Ben Palmer ([tboyonline.com](http://www.tboyonline.com)), freeware. Its readme is in `app/assets/fonts/`.
