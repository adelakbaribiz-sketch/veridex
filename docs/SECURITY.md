# Security Review

This is a real review of the code in this repository as it exists today, not a template. Each
row states what was checked, what was found, and what was done about it.

| Area | Finding | Status |
|---|---|---|
| Secrets in repo | `.env` files are gitignored at the repo root (`.gitignore` matches `.env`); only `.env.example` (placeholder values) is committed | OK |
| Password storage | bcrypt, 12 salt rounds, via `bcryptjs` | OK |
| JWT secret | Read via `config.getOrThrow('JWT_SECRET')` — the app **fails to start** rather than silently using a default if unset in production | OK |
| Token storage in browser | Stored in an **httpOnly, sameSite=lax** cookie set by a Next.js Route Handler; the JWT never reaches client-side JavaScript, so it can't be exfiltrated by an XSS payload | OK |
| Token expiry | 1 day, no refresh/rotation, no revocation list | Documented limitation — see [LIMITATIONS.md](LIMITATIONS.md) |
| Tenant isolation | Every Prisma query in `VendorsService`, `DashboardService`, and `UsersController` filters by `tenantId` taken from the verified JWT payload — never from a client-supplied field | OK, and covered by a unit test (`vendors.service.spec.ts`) that asserts a cross-tenant `findOne` throws `NotFoundException` |
| Mass assignment | Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` in `main.ts` strips/rejects any field not declared on a DTO — a client cannot inject `tenantId`, `id`, or `passwordHash` through a request body | OK |
| Input validation | `class-validator` DTOs on every mutating endpoint; `zod` schemas mirror them on the frontend for UX (not a security boundary on their own) | OK |
| XSS | React escapes all rendered content by default; no `dangerouslySetInnerHTML` anywhere in the codebase | OK |
| SQL/NoSQL injection | All queries go through Prisma's parameterized query builder; the one raw query (`health` check: `` $queryRaw`SELECT 1` ``) has no interpolated input | OK |
| File upload | **Not implemented.** `ComplianceDocument.fileName` is a plain string field — no file is actually received, stored, or served, which also means the entire class of file-upload vulnerabilities (path traversal, content-type spoofing, unrestricted size) does not apply because there is no upload endpoint | N/A — documented in LIMITATIONS.md, not silently skipped |
| Sensitive data exposure | `passwordHash` is never selected/returned by any endpoint (`users/me` and `users` use explicit Prisma `select`/relation shaping) | OK |
| CORS | `main.ts` restricts `Access-Control-Allow-Origin` to a single configured `CORS_ORIGIN`, not `*` | OK |
| API documentation exposure | Swagger UI at `/api/docs` is unauthenticated | Acceptable for a demo; flagged in ROADMAP as something to gate or remove before any real production use |
| Dependency versions | Prisma CLI and `@prisma/client` were found mismatched at install time (`prisma@8.0.0-rc.15` vs `@prisma/client@7.10.0`, since Prisma's `latest` tag currently points at an RC for the CLI) — both were pinned to the matching stable `7.10.0` | Fixed during this build, see [DECISIONS.md](DECISIONS.md) |
| Role-based access control | The `role` column exists and is returned to the client for display, but **no endpoint currently checks it** — any authenticated member of a tenant can do anything any other member can do within that tenant | Documented limitation, not a cross-tenant vulnerability — see LIMITATIONS.md and ROADMAP.md |

## Dependency audit

`npm audit` was run against both `api/` and `web/`.

- **`api/`** initially reported 9 vulnerabilities (4 high) via two chains:
  1. `prisma` (CLI) → `@prisma/config` → `deepmerge-ts` (stack-exhaustion advisory) and
     `prisma` → `mysql2` (auth-downgrade / decompression-bomb advisories) — pulled in because
     the Prisma CLI bundles multi-database tooling we don't use (we're Postgres-only). Fixed with
     `overrides` pinning `deepmerge-ts@^8.0.2` and `mysql2@^3.24.4`, the patched versions,
     without downgrading Prisma itself.
  2. `@nestjs/mau` (NestJS's optional cloud-deploy CLI, auto-added by `nest new` but never used —
     we deploy via Docker Compose) → outdated `undici` (15 advisories, including HTTP
     request-smuggling and response-queue poisoning). Fixed by removing the unused dependency and
     its `deploy` script entirely rather than patching around it.
  - Result: **0 vulnerabilities**, verified with `npm audit` after the fix, and the build + test
    suite were re-run to confirm nothing broke.
- **`web/`**: 0 vulnerabilities at time of writing.

## What this review did not cover

- No penetration testing or fuzzing.
- No review of the Docker base images for CVEs (both use `node:22-alpine`, which should be kept
  current, but no image scan was run).

These are reasonable next steps before any real deployment and are listed in
[ROADMAP.md](ROADMAP.md), not claimed as done.
