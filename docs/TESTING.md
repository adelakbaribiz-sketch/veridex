# Testing

## What exists

**Backend (`api/`, Vitest):**

| File | Covers |
|---|---|
| `src/auth/auth.service.spec.ts` | Registration (duplicate email rejected, tenant+admin user created, token issued), login (unknown email, wrong password, correct password) |
| `src/vendors/vendors.service.spec.ts` | Tenant scoping (`findOne` throws `NotFoundException` for a vendor in another tenant), vendor creation is scoped to the caller's tenant and writes an audit log, document status is recomputed rather than trusted from storage |
| `src/vendors/document-status.util.spec.ts` | The pure status-computation function: expired, expiring-soon, valid, and the exact 30-day boundary |
| `src/dashboard/dashboard.service.spec.ts` | Zero-data KPIs, risk-band bucketing at exact boundaries (33/34, 66/67), documents counted as expiring/expired from real dates rather than stored status, tenant scoping of both queries |

All four suites use a mocked `PrismaService` (no live database required), which keeps them fast
and deterministic in CI. **16 tests, all passing** as of this writing — run `npm test` in `api/`
to reproduce.

**Frontend (`web/`):** no automated test suite. The frontend was verified manually via a running
dev server in the initial build pass: build (`next build`) succeeds with full type-checking,
`eslint` passes clean, and the landing/login/register pages were checked in the browser (desktop +
mobile viewport, light + dark color scheme, form validation states, console error-free). The
subsequent upgrade pass (loading skeletons, button/KPI depth, dialog focus trap) was **not**
re-verified live in a browser — this workspace's shared preview-server slots (max 5 per folder)
were already at capacity from other concurrent sessions — and was instead verified via a clean
`next build` + `eslint` pass plus code review, reusing the exact same CSS technique (transform/
box-shadow, `prefers-reduced-motion`) already confirmed working in the initial pass.

## What was run before calling this done

```
api:  npm run build   → passes (nest build, full TypeScript check)
api:  npm run lint    → passes (oxlint --type-aware; known false-positive warnings only, see below)
api:  npm test        → 16/16 passing (vitest, mocked Prisma)
web:  npm run build   → passes (next build with Turbopack, full TypeScript check, all 13 routes generated)
web:  npm run lint    → passes (eslint, 0 warnings)
```

### Known lint warnings (not fixed, and why)

`oxlint`'s type-aware `unbound-method` rule flags several lines across `vendors.service.spec.ts`
and `dashboard.service.spec.ts` where a Vitest mock method (`prisma.vendor.findFirst as Mock`) is
referenced for `.mockResolvedValue()` — a known false-positive pattern with this rule against
Vitest's mocking API, not an actual unbound-`this` bug. Two `no-misused-spread` warnings (one on a
Prisma result object, one on a class-validator DTO spread — both plain-data-only usages with no
class prototype/methods actually needed) are suppressed inline with comments explaining why.

## What was not tested

- **No live database integration tests.** The unit tests mock Prisma entirely; there is no test
  that runs migrations against a real Postgres and exercises the API through HTTP. This
  environment could not run Docker (see [LIMITATIONS.md](LIMITATIONS.md)), so this could not be
  verified here — it's a reasonable next step, not something silently skipped.
- **No authenticated frontend pages verified live** (dashboard, vendors, team, settings) — these
  require a running API + database, which this environment could not provide. The public pages
  (landing, login, register) that don't need the backend were verified in a real browser.
- **No end-to-end (Playwright/Cypress) tests.** `test:e2e` exists as an npm script (Vitest
  config) but no actual e2e specs were written — this is scope that would come after the manual
  UI verification above, not before it.
- **No load/performance testing.**

## How to actually verify the parts that weren't verified here

```bash
docker compose up -d postgres
cd api && npm run db:migrate && npm run db:seed && npm run start:dev
cd web && npm run dev
# then sign in with the demo credentials in DEMO.md and click through the app
```
