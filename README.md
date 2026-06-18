# Swasth — hospital booking & live capacity platform (mockup)

A clickable front-end mockup for **Group 5's "Foundations for AI" final project** — a
public booking platform for hospitals in India. It pairs a **patient booking app**
(find care → compare → book → skip the queue) with a **hospital capacity dashboard**
(live occupancy, free beds, demand-by-department, 7-day forecast).

> All data is **mock/illustrative** — there is no backend or live ML model. The figures
> are tuned to the planning deck (AIIMS Delhi: 2,084 beds, ~85% occupancy, ~5.5-day stay).

Built for **Slide 10 (The Product)** and **Slide 11 (Back to Business)** of the deck.

---

## Run it locally

```bash
npm install
npm run dev          # → http://localhost:5173/poorna_ai/
```

Local production preview:

```bash
npm run build
npm run preview      # → http://localhost:4173/poorna_ai/
```

## Screens

| Route | Screen |
|---|---|
| `#/` | Patient home — search by department & location |
| `#/find` | Ranked hospitals (wait, free slots, cost, insurance) + filters |
| `#/hospital/:id` | Hospital detail — departments, doctors, slots, insurance |
| `#/book/:id` | Booking flow — date, slot, patient details, insurance pre-fill |
| `#/confirm` | Confirmation — token, QR, cashless claim status |
| `#/dashboard` | Hospital dashboard — KPIs, occupancy by dept, bottleneck alerts, ward table |
| `#/dashboard/forecast` | Monthly demand forecast, 7-day occupancy, discharge/roster prompts |

Use the **Patient / Hospital toggle** in the top bar to switch between the two apps.

## Generate slide-ready screenshots (optional)

Captures every screen to `screenshots/*.png` (needs Chromium once):

```bash
npm run preview &                     # serve the built app
npx playwright install chromium       # one-time browser download
npm run screenshots
```

## Deploy / update the live site

The site is hosted on **GitHub Pages** at **https://<your-username>.github.io/poorna_ai/**, served
from the `gh-pages` branch. After you change anything and want it live:

```bash
npm run deploy
```

That rebuilds the app and publishes it to `gh-pages`. Wait ~1 minute, then hard-refresh the
site (Cmd/Ctrl + Shift + R).

> **First-time Pages setup:** Settings → Pages → Source = "Deploy from a branch" →
> `gh-pages` / `root`. Routing uses `HashRouter` and `vite.config.js` sets `base: '/poorna_ai/'`,
> so deep links work with no 404s. If you rename the repo, update `base` to match.

## How it maps to the assignment

- **Slide 10 — The Product:** the patient app + hospital dashboard, with occupancy, free
  beds, demand-by-department, and a monthly AIIMS-Delhi forecast.
- **Slide 11 — Back to Business:** each prediction is tied to a concrete decision with an
  explicit **automated vs human-approved** boundary (booking slot suggestions = auto, bed
  reallocation = human-approved, claim pre-fill = auto) — surfaced in the dashboard alerts
  and the forecast action prompts.

## Tech

React 18 · Vite · Tailwind CSS · React Router (HashRouter) · Recharts · lucide-react.
To rebrand, edit `src/config.js`. To change the mock data, edit `src/data/*`.
