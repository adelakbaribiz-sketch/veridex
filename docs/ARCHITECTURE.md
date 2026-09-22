# Architecture

## Overview

Veridex is a conventional two-tier web application: a Next.js frontend and a NestJS API, each
with its own deployable container, talking to a single PostgreSQL database.

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│   Browser   │  HTTPS │  Next.js (web)   │  HTTPS │  NestJS (api) │
│             │───────▶│  App Router,     │───────▶│  REST API,    │
│             │        │  Route Handlers  │        │  JWT auth     │
└─────────────┘        │  as BFF          │        └──────┬───────┘
                        └──────────────────┘               │
                                                             ▼
                                                     ┌───────────────┐
                                                     │  PostgreSQL   │
                                                     │  (Prisma ORM) │
                                                     └───────────────┘
```

## Why this shape

- **Two services, not a monorepo of microservices.** There is one write model (vendors,
  documents, users) and no independent scaling need between features, so a single NestJS service
  is the right amount of backend. Splitting into microservices now would add deployment and
  networking complexity with no corresponding benefit — see [DECISIONS.md](DECISIONS.md).
- **Next.js as a BFF, not a thin static client.** The browser never holds the JWT. Login and
  register are handled by Next.js Route Handlers (`src/app/api/auth/*`) that call the NestJS API
  and store the resulting token in an **httpOnly, sameSite=lax cookie**. Server Components read
  that cookie server-side to call the API directly; Client Components that need to mutate data
  (create a vendor, add a document) go through a generic authenticated proxy
  (`src/app/api/proxy/[...path]/route.ts`) that attaches the bearer token server-side. This
  keeps the access token out of reach of any XSS in the client bundle.
- **Tenant isolation at the query layer, not the database layer.** All tenant-scoped tables carry
  a `tenantId` column, and every Prisma query in the service layer filters by the caller's
  `tenantId` (taken from the JWT payload, never from client input). This is the same approach
  used by most small-to-mid multi-tenant SaaS products; row-level security or database-per-tenant
  are documented as a scaling path in [ROADMAP.md](ROADMAP.md), not implemented now, because
  there is no second tenant with different isolation requirements yet.

## Frontend (`web/`)

- **Next.js 16, App Router, TypeScript, Tailwind CSS v4.**
- Route groups: `(auth)` for login/register (public), `(app)` for the authenticated product
  (dashboard, vendors, team, settings) — the `(app)` layout does a server-side auth check and
  redirects to `/login` if there is no valid session.
- Server Components fetch data directly from the NestJS API for initial page loads (fast,
  no client-side loading spinner for the first paint). Client Components (forms, filters) use
  TanStack Query patterns and the `apiClient` helper for interactive mutations, then call
  `router.refresh()` to re-run the Server Component fetch rather than maintaining duplicate
  client-side cache state.
- `recharts` for the one data visualization (vendor risk distribution) — chosen because it is the
  most widely used React charting library and the value is in the real computed data, not the
  charting library.

## Backend (`api/`)

- **NestJS 12, TypeScript, ESM.**
- Modules: `auth` (register/login, JWT issuance), `users` (current-user profile, tenant member
  list), `vendors` (CRUD + nested compliance documents, tenant-scoped), `dashboard` (computed KPI
  summary), `health` (liveness/readiness).
- **Prisma 7** ORM with the `@prisma/adapter-pg` driver adapter (Prisma 7 requires an explicit
  driver adapter rather than a bare connection string in the client).
- Document status (`VALID` / `EXPIRING_SOON` / `EXPIRED`) is **computed at read time** from
  `expiresAt`, not trusted from a stored column that could go stale — see
  `src/vendors/document-status.util.ts` and its test.
- Every mutation that changes a vendor or document writes an `AuditLog` row (tenant-scoped
  actor, action, entity). There is no audit log *viewer* UI yet — see ROADMAP.

## Data flow for a typical read (dashboard)

1. Browser requests `/dashboard`.
2. The `(app)` layout (Server Component) reads the `veridex_session` cookie, calls
   `GET /api/users/me` on the NestJS API with it as a bearer token. No cookie → redirect to
   `/login`.
3. The dashboard page (Server Component) calls `GET /api/dashboard/summary` and
   `GET /api/vendors` directly against the API, in parallel.
4. NestJS's `JwtAuthGuard` validates the token, `DashboardService`/`VendorsService` scope every
   Prisma query by `tenantId` from the token payload.
5. The page renders server-side with real data; the risk chart hydrates client-side.

## Data flow for a typical write (add vendor)

1. `CreateVendorDialog` (Client Component) submits a validated (Zod) form via `apiClient.post`.
2. That request hits `/api/proxy/vendors` (Next.js Route Handler), which reads the httpOnly
   cookie, forwards the request to `POST {API_URL}/api/vendors` with the bearer token attached.
3. NestJS validates the DTO (`class-validator`), creates the `Vendor` row scoped to
   `user.tenantId`, writes an `AuditLog` row, returns the created vendor.
4. The dialog closes and calls `router.refresh()`, which re-runs the Server Component fetch and
   shows the new vendor without a full page reload.

## What was deliberately not built

See [LIMITATIONS.md](LIMITATIONS.md) for the full list. The short version: no billing, no SSO,
no real file storage for uploaded documents (filename/metadata only), no background jobs /
scheduled reminders, no microservices, no message queue. None of these are needed to demonstrate
the product or the engineering approach, and adding them now would be scope for its own sake.
