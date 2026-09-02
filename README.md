# Demo1 — Budhram

A production-quality premium fine jewellery catalog website. React + Vite + TypeScript + Tailwind CSS v4 + Motion frontend backed by an Express + TypeScript API foundation that is Supabase-ready.

## Repo layout

```
.
├── frontend/   React SPA (catalog, filters, wishlist, quick view, collections, contacts) — works on mock/local data
└── backend/    Express 5 + TypeScript API foundation — Supabase-ready (health + product route stubs)
```

## Requirements

- Node.js >= 20 (tested on 22)

## Setup

```bash
# frontend
cd frontend
npm install
npm run dev          # http://localhost:5173

# backend
cd backend
npm install
cp .env.example .env # configure Supabase keys if desired
npm run dev          # http://localhost:4000
```

## Scripts

| Location   | Command              | Description                                  |
| ---------- | -------------------- | -------------------------------------------- |
| frontend   | `npm run dev`        | Vite dev server (port 5173)                  |
| frontend   | `npm run build`      | Production build                             |
| frontend   | `npm run typecheck`  | TypeScript type check                        |
| backend    | `npm run dev`        | tsx watch server (port 4000)                 |
| backend    | `npm run build`      | Compile TypeScript to `dist/`                |
| backend    | `npm run start`      | Run compiled server                          |
| backend    | `npm run typecheck`  | TypeScript type check                        |

## API

The backend is intentionally thin right now. It ships a working health check and
placeholder product routes so the integration point is explicit:

| Method | Path                                  | Description                          |
| ------ | ------------------------------------- | ------------------------------------ |
| GET    | `/api/health`                         | Service health                       |
| GET    | `/api/products`                       | List products (filters/sort/page)    |
| GET    | `/api/products/:slug`                 | Single product                       |
| GET    | `/api/collections/:collection/products` | Pieces in a collection               |

Example:

```bash
curl "http://localhost:4000/api/health"
```

## Architecture

The frontend isolates all data access behind `frontend/src/services/productService.ts`.
Pages and components never import the mock array directly, so swapping local mock data
for the Express/Supabase API is a drop-in change at the service layer.

```
UI components
    └── productService.ts     (single swap point)
            └── mock data  OR  Express `/api/products` → Supabase
```

## Backend env

See `backend/.env.example`. Anon key can be public; the **service role key must only
ever be used server-side.** The server boots without Supabase credentials configured.
