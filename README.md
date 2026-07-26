# BookWise — University Library Management Platform

Fullstack library app with a dark user platform and light admin dashboard.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **PostgreSQL** via [Supabase](https://supabase.com) or [Neon](https://neon.tech)
- **Drizzle ORM** for schema & migrations
- **Auth.js** (NextAuth v5) credentials provider
- **Upstash Redis** for rate limiting
- **ImageKit** for ID cards, covers, and trailers

## Features

### User platform
- Sign up / sign in with university ID upload
- Home with featured book + latest books
- Search with empty state
- Book details, trailer, summary, similar books
- Borrow flow (approved users only)
- Profile with digital ID card + borrowed books

### Admin panel
- Dashboard stats and recent activity
- Manage users (promote / demote / delete)
- Approve or deny account requests
- CRUD books (cover color, ImageKit uploads)
- Borrow request tracking

## Setup

### 1. Install

```bash
npm install --legacy-peer-deps
```

### 2. Environment

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [Supabase](https://supabase.com/dashboard) → Connect → URI (or Neon) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | [Upstash](https://console.upstash.com) |
| ImageKit keys | [ImageKit](https://imagekit.io) dashboard |
| `ADMIN_EMAIL` | Email used by the seed script for the admin user |

### 3. Database

```bash
npm run db:push
npm run db:seed
```

Default admin after seed:

- Email: `admin@bookwise.com` (or your `ADMIN_EMAIL`)
- Password: `admin12345`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- User app: `/`
- Admin: `/admin` (admin role required)

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the same env vars from `.env.example`.
4. Deploy.
5. Run migrations against Neon (`npm run db:push` locally or in CI), then `npm run db:seed`.

Set `AUTH_URL` / `NEXT_PUBLIC_APP_URL` to your production URL after the first deploy.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:push` | Push Drizzle schema to Neon |
| `npm run db:seed` | Seed admin + sample books |
| `npm run db:studio` | Open Drizzle Studio |

## Project structure

```
src/
  app/
    (auth)/          # Sign in / sign up
    (root)/          # User platform
    admin/           # Admin dashboard
    api/             # Auth.js + ImageKit auth
  components/        # UI + admin forms
  database/          # Drizzle schema + client
  lib/               # Actions, validations, rate limit
```


cp .env.example .env.local

npm install --legacy-peer-deps
npm run db:push
npm run db:seed
npm run dev


npm run db:push
npm run db:seed

npm run dev


BookWise

Database: GYiHsmwxQH3l1VUZ

