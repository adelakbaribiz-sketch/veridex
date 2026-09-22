# Changelog

All notable changes to this project are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] — Initial build

### Added

- NestJS API (`api/`): JWT auth (register/login), multi-tenant vendor + compliance-document
  CRUD, computed dashboard summary, tenant member listing, health check, Swagger docs.
- Prisma schema and PostgreSQL data model: `Tenant`, `User`, `Vendor`, `ComplianceDocument`,
  `AuditLog`.
- Next.js frontend (`web/`): public landing page, register/login, authenticated app shell
  (dashboard, vendors list/detail, team, settings), all with real empty/loading/error states.
- Design system: navy/copper "governance" visual identity, serif + sans typography, light/dark
  mode.
- Docker Compose stack (Postgres + api + web) and Dockerfiles for both services.
- GitHub Actions CI workflow (lint, build, test for both services).
- Backend unit test suite (12 tests: auth, tenant scoping, document status computation).
- Full documentation set under `docs/` plus this changelog and the root README.

### Fixed

- Pinned `prisma`/`@prisma/client` to matching stable `7.10.0` (installed CLI resolved to an
  8.0 release candidate against a 7.x client by default).
- Migrated `prisma/schema.prisma` and `PrismaService` to Prisma 7's driver-adapter model
  (`@prisma/adapter-pg`) after the classic `datasource { url }` pattern was removed upstream.
- Fixed 9 dependency vulnerabilities (4 high) via `npm audit`: pinned `deepmerge-ts`/`mysql2`
  transitive versions for the Prisma CLI chain, removed the unused `@nestjs/mau` package
  entirely. `api/` and `web/` both audit clean.
- Added a `status` field to the vendor create/update DTOs — without it there was no way to
  change a vendor's status via the API at all.

### Known limitations

See [docs/LIMITATIONS.md](docs/LIMITATIONS.md).
