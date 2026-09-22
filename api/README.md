# Veridex API

NestJS backend for Veridex. See the [repo root README](../README.md) for the full project
overview and [../docs/](../docs/) for architecture, API reference, and data model docs.

## Setup

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate    # requires a running Postgres — see ../docker-compose.yml
npm run db:seed        # optional, demo data
npm run start:dev      # http://localhost:4000, Swagger at /api/docs
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run start:dev` | Dev server with watch mode |
| `npm run build` | Type-check and compile to `dist/` |
| `npm test` | Run the unit test suite (Vitest, mocked Prisma — no DB needed) |
| `npm run lint` | oxlint, type-aware |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:deploy` | Apply Prisma migrations (production, non-interactive) |
| `npm run db:seed` | Load demo data — see [../docs/DEMO.md](../docs/DEMO.md) |
| `npm run db:studio` | Open Prisma Studio |

## Structure

```
src/
├── auth/       # register/login, JWT strategy & guard
├── users/      # current-user profile, tenant member listing
├── vendors/    # vendor + compliance-document CRUD, tenant-scoped
├── dashboard/  # computed KPI summary
├── health/     # liveness/readiness (real DB ping)
└── prisma/     # PrismaService (Prisma 7 driver-adapter setup)
prisma/
├── schema.prisma
└── seed.ts
```
