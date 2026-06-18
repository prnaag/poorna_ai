# Swasth — hospital booking & live capacity platform (mockup)

A clickable front-end mockup for **Group 5's "Foundations for AI" final project** — a
public booking platform for hospitals in India. It pairs a **patient booking app**
(find care → compare → book → skip the queue) with a **hospital capacity dashboard**
(live occupancy, free beds, demand-by-department, 7-day forecast).

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


## Deploy / update the live site

The site is hosted on **GitHub Pages** at **https://prnaag.github.io/poorna_ai/**, served
from the `gh-pages` branch. After you change anything and want it live:

```bash
npm run deploy
```

That rebuilds the app and publishes it to `gh-pages`. Wait ~1 minute, then hard-refresh the
site (Cmd/Ctrl + Shift + R).

> **First-time Pages setup:** Settings → Pages → Source = "Deploy from a branch" →
> `gh-pages` / `root`. Routing uses `HashRouter` and `vite.config.js` sets `base: '/poorna_ai/'`,
> so deep links work with no 404s. If you rename the repo, update `base` to match.


## Tech

React 18 · Vite · Tailwind CSS · React Router (HashRouter) · Recharts · lucide-react.
To rebrand, edit `src/config.js`. To change the mock data, edit `src/data/*`.
