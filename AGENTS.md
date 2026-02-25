# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Mint & Make is a Next.js 16.1.6 app (Chinese-language UI) for content creators to save and analyze YouTube inspirations. Tech stack: React 19, Tailwind CSS 4, NextAuth v4 (Credentials/JWT), Supabase (PostgreSQL), pnpm 9.15.0.

### Services

| Service | How to start | Port | Notes |
|---------|-------------|------|-------|
| Next.js dev server | `pnpm dev` | 3000 | Uses webpack mode (`next dev --webpack`) |
| Local Supabase | `sudo supabase start` (from repo root) | API 54321, DB 54322, Studio 54323 | Requires Docker running (`sudo dockerd`) |

### Environment variables

A `.env.local` file is needed with these keys (values come from `sudo supabase status -o env` for local dev):

- `NEXT_PUBLIC_SUPABASE_URL` — local: `http://127.0.0.1:54321`
- `SUPABASE_SERVICE_ROLE_KEY` — from `SERVICE_ROLE_KEY` in supabase status output
- `NEXTAUTH_SECRET` — any 32+ char string for local dev
- `NEXTAUTH_URL` — `http://localhost:3000`
- `OPENAI_API_KEY` — optional; AI breakdown gracefully degrades without it

### Commands (standard, see `package.json`)

- **Dev**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`

### Gotchas

- **Docker must be running** before `supabase start`. Start with `sudo dockerd &` and wait a few seconds.
- **`app/inspiration/[id]/page.tsx` is an empty file** causing `pnpm build` to fail with "is not a module". The dev server (`pnpm dev`) works fine despite this.
- **Lint picks up macOS `._*` resource fork files** as parse errors — these are not real source files.
- **Save inspiration requires selecting at least one "like point" tag** (标题, 结构, etc.) before the save button becomes enabled.
- The middleware file convention is deprecated in Next.js 16; a warning appears but does not block operation.
- Supabase local keys are deterministic demo keys — they do not change between `supabase start` invocations on the same project.
