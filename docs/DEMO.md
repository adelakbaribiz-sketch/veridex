# Demo Guide

## Running it locally

```bash
# 1. Start Postgres
docker compose up -d postgres

# 2. Backend
cd api
cp .env.example .env
npm install
npm run db:migrate      # applies the schema
npm run db:seed         # loads demo data (see below)
npm run start:dev       # http://localhost:4000, docs at /api/docs

# 3. Frontend (separate terminal)
cd web
npm install
npm run dev              # http://localhost:3000
```

Or via Docker Compose end-to-end: `docker compose up -d` (builds and runs `postgres`, `api`, and
`web`), then run the migrate/seed commands inside the `api` container once.

> **Environment note:** this repository was built and verified in a sandboxed environment where
> Docker Desktop could not be started (see [LIMITATIONS.md](LIMITATIONS.md)). The backend was
> built and unit-tested against a mocked Prisma client and the schema was validated against the
> live Prisma engine; the migration and seed commands above have not been run end-to-end against
> a live Postgres instance in this environment. They should work as written — the schema is valid
> and the seed script has no untested logic beyond standard Prisma calls — but run them yourself
> before relying on this as a working demo.

## Demo login

After seeding:

```
Email:    demo@veridex.app
Password: demo-password-123
```

This account belongs to a seeded tenant ("Veridex Demo Org") with 8 vendors and ~18 compliance
documents spread across valid, expiring-soon, and expired states, so the dashboard and risk
chart have real, varied data to show immediately.

You can also click "Create a free organization" on the landing page to register a brand-new,
empty organization and see the empty states (no vendors, no documents, "Nothing expiring") —
useful for judging first-run UX.

## What's real vs. seeded vs. simulated

| Thing | Status |
|---|---|
| Authentication (register/login/JWT) | Real |
| Vendor and document CRUD | Real — backed by Postgres via Prisma |
| Dashboard KPIs and risk chart | Real — computed from whatever is actually in the database at request time, not hardcoded |
| Document status (Valid/Expiring/Expired) | Real — computed from `expiresAt` on every read |
| The 8 vendors / ~18 documents you see after seeding | **Seed/demo data** — fictional vendor names, not real companies |
| Audit log entries | Real — written on every mutation, just no UI to view them yet |
| Team page | Real — lists actual users in your tenant (just you, unless you register more) |
| "Invite member" button | Intentionally disabled — not implemented, not faked |

## Suggested walkthrough

1. Visit `/` — read the landing page, note the "Demo project" badge.
2. Sign in with the demo credentials.
3. Dashboard: note the KPI cards and risk distribution chart reflect real seeded data.
4. Vendors: search "Ferro", filter by "At risk" — see Ferro Manufacturing and Ashgrove Facilities.
5. Click into a vendor with an expired document — see the red "Expired" badge.
6. Add a new vendor, then add a compliance document with an expiry date next week — watch it
   show up in the dashboard's "Needs attention" panel and as "Expiring soon" on the vendor page.
7. Sign out, then register a brand-new organization — see the empty states.
