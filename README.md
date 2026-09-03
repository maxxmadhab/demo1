# Budhram — Premium Fine Jewelry

A production-quality premium fine jewellery catalog website. React + Vite + TypeScript + Tailwind CSS v4 + Motion frontend backed by an Express + TypeScript API that integrates with Supabase (Auth + PostgreSQL).

## Repo layout

```
.
├── frontend/   React SPA (catalog, filters, wishlist, quick view, collections, contacts, auth)
├── backend/    Express 5 + TypeScript API (health check + future product endpoints)
└── supabase/   SQL migrations (profiles table, RLS, triggers)
```

## Phase 1: Authentication & Role System

This project includes full authentication with two roles (`user` and `admin`).

### Routes

| Route              | Description                          |
| ------------------ | ------------------------------------ |
| `/login`           | Customer login (email + Google)      |
| `/signup`          | Customer registration                |
| `/forgot-password` | Request a password reset             |
| `/reset-password`  | Set a new password (from email link) |
| `/admin/login`     | Separate admin login                 |
| `/admin`           | Admin dashboard (admin-only)         |

### Roles

- **`user`** — default role assigned to every new registration and Google sign-in.
- **`admin`** — assigned only through a secure administrative process (SQL/service role). There is **no** public UI to become admin.

Admin privileges are validated **server-side** via Supabase database + RLS. Never trust client-side role state.

---

## Requirements

- Node.js >= 20 (tested on 22)
- A Supabase project (free tier works)

---

## Setup

### 1. Clone & install

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. Configure Supabase

#### Create the database schema

1. Open your Supabase project → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/migrations/20240101000000_create_profiles.sql` and run it.
3. This creates:
   - `public.profiles` table (id, email, full_name, role, created_at, updated_at)
   - Row Level Security (RLS) enabled
   - Policies so users can only read/update their **own** row
   - A `handle_new_user()` trigger that auto-creates a profile on signup
   - `role` CHECK constraint restricting values to `user` or `admin`

#### Configure Authentication

1. Supabase Dashboard → **Authentication** → **Providers**.
2. Enable **Email** provider (email/password sign-in is on by default).
3. For **Google** login:
   - Create a Google Cloud OAuth client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Copy the Client ID + Client Secret into the Google provider in Supabase.
4. Set the **Site URL** (Dashboard → Authentication → URL Configuration):
   - Site URL: `http://localhost:5173`
   - Redirect URLs: add `http://localhost:5173` (and your production URL later) so OAuth + reset links work.

#### Create an admin account

The trigger auto-creates every new signup with `role = 'user'`. To make an admin:

```sql
-- Option A — promote an existing user by email
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'you@example.com';

-- Option B — create a dedicated admin
-- 1. Sign up through /signup with your admin email (role = user)
-- 2. Then run the UPDATE above to promote that profile.
```

Alternatively, create the admin via an RPC function protected by the service role key (see backend, later phases).

---

### 3. Configure environment variables

#### Frontend (`frontend/.env`)

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon/publishable-key>
```

These are **public** keys — safe for the browser. RLS protects the actual data.

> **Never** put `SUPABASE_SERVICE_ROLE_KEY` or any secret key in frontend env vars.

#### Backend (`backend/.env`)

See `backend/.env.example`. Required vars:

```env
DATABASE_URL=postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-only, never ship to client
```

---

### 4. Run

```bash
cd frontend
npm run dev          # http://localhost:5173

cd backend
npm run dev          # http://localhost:4000
```

---

## Scripts

| Location   | Command            | Description                                  |
| ---------- | ------------------ | -------------------------------------------- |
| frontend   | `npm run dev`      | Vite dev server (port 5173)                  |
| frontend   | `npm run build`    | Production build                             |
| frontend   | `npm run typecheck`| TypeScript type check                        |
| backend    | `npm run dev`      | tsx watch server (port 4000)                 |
| backend    | `npm run build`    | Compile TypeScript to `dist/`                |
| backend    | `npm run start`    | Run compiled server                          |
| backend    | `npm run typecheck`| TypeScript type check                        |

---

## API

| Method | Path            | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/api/health`   | Service health check |

Product endpoints are stubbed and will be implemented in later phases.

---

## Authentication Architecture

```
frontend/src/
├── context/AuthContext.tsx    Global auth state (user, profile, role, loading)
├── hooks/useAuth.ts           useAuth() hook
├── lib/supabase.ts            Supabase client (public anon key only)
├── services/authService.ts    Supabase auth + profile operations
├── components/auth/           AuthGuard, AdminGuard (route protection)
└── pages/                     Login, Signup, ForgotPassword, ResetPassword
└── pages/admin/               AdminLogin, AdminDashboard
```

- **Route protection**: `AuthGuard` wraps user-only pages (redirects to `/login`). `AdminGuard` wraps admin routes (checks auth + role, redirects unauthorized to `/` or `/admin/login`).
- **Role validation** happens both client-side (UX only) and **server-side** through RLS + database constraints. The admin flag is derived from the `profiles.role` column, never from editable client state.

---

## Security notes

- Passwords are handled entirely by Supabase Auth — never stored or transmitted by the app.
- Auth tokens use Supabase's session system (localStorage-backed), not custom storage.
- No secret/service-role keys exist in the frontend.
- RLS prevents users from reading or modifying profiles they don't own.
- A `CHECK (role IN ('user', 'admin'))` constraint plus the trigger defaulting to `user` means no public signup can create an admin.
