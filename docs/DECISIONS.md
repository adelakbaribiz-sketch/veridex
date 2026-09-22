# Decisions

Real decisions made while building this repository, in roughly chronological order.

## Invent one concrete product concept instead of building an empty shell

The source dossier had no product definition. Rather than build generic, contentless CRUD
scaffolding, one demo product concept ("Veridex", vendor compliance tracking) was invented and
disclosed explicitly — see [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md). This makes the UI, data
model, and docs coherent and demoable instead of abstract.

## Two services (Next.js + NestJS), not a single full-stack framework or microservices

A single Next.js app with Route Handlers as the "backend" was considered, but a separate NestJS
API was chosen instead so the backend has its own real test suite, its own OpenAPI-documented
contract, and can be deployed/scaled independently of the frontend — a more realistic shape for a
"portfolio-grade" SaaS. Microservices were rejected as unjustified complexity for a single
bounded context.

## Next.js as a BFF with an httpOnly cookie, not a bearer token in localStorage

Storing the JWT in `localStorage` and attaching it from client JS is the more common shortcut,
but it means any XSS vulnerability (present or future) can exfiltrate the token. Routing
auth through Next.js Route Handlers that set an httpOnly cookie costs one extra hop for
client-side mutations (via `/api/proxy/*`) but keeps the token out of reach of page JavaScript
entirely.

## Prisma 7 + driver adapter, not a bare `datasource url`

Discovered mid-build: Prisma 7 removed support for `datasource { url = env(...) }` in the schema
file in favor of driver adapters passed to the `PrismaClient` constructor, plus a separate
`prisma.config.ts` for CLI commands. This required installing `pg` + `@prisma/adapter-pg`,
adding `prisma.config.ts` with `process.loadEnvFile()` (Prisma's config loader deliberately does
not read `.env` itself), and updating `PrismaService` and the seed script accordingly.

## Pin `prisma`/`@prisma/client` to matching stable versions

`npm install prisma @prisma/client` resolved `prisma@8.0.0-rc.15` (CLI's `latest` tag) against
`@prisma/client@7.10.0` (client's `latest` tag, since 8.0 hasn't had a stable client release yet)
— a major-version mismatch between CLI and client. Both were pinned to `7.10.0` for a build meant
to be production-representative rather than tracking a release candidate.

## Document status is computed, not trusted from storage

`ComplianceDocument.status` is stored (so it's queryable/indexable), but every read path
recomputes it from `expiresAt` before returning it to the client (`document-status.util.ts`).
A document that was `VALID` yesterday and is `EXPIRED` today should never show as `VALID` just
because nothing re-saved the row — trusting a cached status field would be a real correctness
bug in a compliance-tracking product specifically.

## No fabricated historical trend chart

The dashboard shows the *current* vendor risk distribution, not a trend line over time, because
there is no snapshot table to compute a real trend from. A chart implying historical change from
a single point-in-time query would be fabricated data, which the project's own ground rules rule
out — see [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).

## Serif + navy/copper visual identity, not a default component-library look

Given this is one of several portfolio projects (this workspace contains half a dozen other
independent apps), a visual identity specific to "governance/compliance" — serif headings
(Source Serif 4), navy/copper palette, restrained rounding — was designed rather than reusing
whatever a UI kit ships by default, so this project doesn't look interchangeable with the others.

## Dependency vulnerabilities fixed, not just documented

`npm audit` surfaced 9 vulnerabilities in `api/` (transitive to the Prisma CLI's multi-DB support
and to an unused NestJS cloud-deploy CLI). Both were fixed — `overrides` for the Prisma chain,
outright removal for the unused `@nestjs/mau` package — rather than left as a documented risk,
since both had a clean fix available. See [SECURITY.md](SECURITY.md).
