# Limitations

An honest, non-exhaustive list. See [ROADMAP.md](ROADMAP.md) for what would address each of
these.

## Product limitations

- **No role-based authorization enforcement.** Any authenticated user in a tenant can do
  anything any other user in that tenant can do. Cross-*tenant* access is blocked; within-tenant
  permission granularity is not.
- **No team invitations.** Only the person who registers an organization has an account in it.
- **No real file upload.** `ComplianceDocument.fileName` is a string field; no file bytes are
  ever received or stored.
- **No notifications.** Nothing emails or alerts anyone when a document is about to expire — the
  dashboard's "Needs attention" panel only appears if someone is looking at it.
- **No editing UI for vendor status**, though the API supports it (`PATCH /vendors/:id`).
- **`riskScore` is entirely manual.** There is no automated or data-driven risk model.
- **No audit log viewer**, though every mutation is recorded.
- **No billing, no pricing page, no plan gating.**

## Technical limitations

- **No live database was available while building this**, because Docker Desktop could not be
  started in this sandboxed environment (its process spawned and exited without ever reaching a
  usable daemon state, and a manual attempt to run `dockerd` inside its WSL distro directly did
  not find a daemon binary there either). Consequences:
  - `prisma migrate dev` / `db:seed` have not actually been run end-to-end here.
  - The backend was validated by: schema validation against the real Prisma engine
    (`prisma validate`, `prisma generate` — both succeeded), a full `nest build` type-check, and
    12 unit tests against a mocked Prisma client.
  - The authenticated frontend pages (dashboard, vendors, team, settings) were **not** visually
    verified in a browser, since they require a live API + database. The public pages (landing,
    login, register) were verified in a real browser at desktop and mobile widths, light and dark
    color scheme.
- **No live database integration tests, no end-to-end browser tests.**
- **No CI has actually executed yet** — `.github/workflows/ci.yml` was written and its steps were
  run manually and locally (build/lint/test all pass), but the workflow itself has not run on
  GitHub Actions since this repository has not been pushed anywhere.
- **Token model is simple.** Stateless JWT, 1-day expiry, no refresh flow, no server-side
  revocation.
- **Swagger UI (`/api/docs`) is unauthenticated.**

## Scope limitations (by design, not oversight)

- Single-region, single-database deployment model — no multi-region, no read replicas, no
  caching layer. Not needed at this scale, and adding it would be complexity for its own sake.
- No microservices, no message queue — see [DECISIONS.md](DECISIONS.md) for why.
