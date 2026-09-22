# Upgrade Report

A targeted quality pass over the initial build (see [CHANGELOG.md](../CHANGELOG.md) v0.1.0),
evaluated against the full 17-area matrix (architecture, backend, frontend, database, security,
UX, UI, design system, AI, performance, reliability, testing, DevOps, docs, observability,
production readiness), then fixed only what scored real findings. This is not a rewrite — the
initial build already had a working, tested, distinctly-designed product surface (see
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) and [DECISIONS.md](DECISIONS.md)); this pass corrects
specific defects and adds a restrained depth/elevation layer, rather than re-architecting
anything.

## Scope note: why several areas are marked "no change — healthy"

Architecture, backend API design, and the database schema/indexes were reviewed and found sound:
clean module boundaries, no circular dependencies, no N+1 queries, indexes already cover the real
query patterns (`tenantId`, `expiresAt`). Rewriting healthy code to have something to show for the
pass would be the exact over-engineering §6 and §38 of the upgrade brief warn against.

## Improvement matrix

| Area | Problem found | Impact | Priority | Action taken |
|---|---|---|---|---|
| Dependency hygiene | `@tanstack/react-query` installed and wrapped in a provider at the root layout, but no component anywhere actually used it — all data fetching went through Server Components / `router.refresh()` | Dead dependency, dead code, misleading to a future reader who'd assume it's the data layer | **P1** | Removed the package and `providers.tsx` entirely |
| Security — rate limiting | `/auth/login` and `/auth/register` had no request-rate limit | Open to credential-stuffing and signup-abuse scripts | **P1** | Added `@nestjs/throttler`: global 100/min guard, plus a tighter 5/min limit specifically on those two endpoints |
| Accessibility | `Dialog` handled Escape-to-close only — no focus trap, no initial focus, no focus restore | A keyboard user could Tab out of an open modal into the page behind the overlay | **P1** | Added a real focus trap (Tab/Shift+Tab cycles within the dialog), initial focus on the first field, and focus restored to the trigger on close |
| Test coverage | `DashboardService.summary()` had real branching logic (risk-band bucketing, status recomputation) with zero tests | An untested computation feeding the product's main dashboard | **P1** | Added 4 unit tests: zero-data case, risk-band bucketing at exact boundaries, expiring/expired computed from real dates not stored status, tenant scoping |
| UX — perceived performance | No `loading.tsx` for any authenticated route | A slow network shows a blank page rather than immediate feedback | **P2** | Added real skeleton screens (matching each page's actual layout) for dashboard, vendors, vendor detail, team, settings — Next.js shows these automatically during the Server Component's data fetch |
| UI — semantic emphasis | Every KPI card and every button variant was visually equal weight | The one number that matters most (vendors at risk) and the one action that matters most (primary CTA) didn't read as such | **P2** | Added an `elevated` prop to `KpiCard`, applied to exactly the "Vendors at risk" tile; gave the primary `Button` variant tactile depth (shadow, hover lift, press-down) — every other card/button variant stays flat by design |
| Accessibility — motion | The new button hover/lift transition had no `prefers-reduced-motion` handling | Would ignore a stated OS-level accessibility preference | **P1** (bundled with the above) | Added `motion-reduce:` variants collapsing the transition |
| Code quality | A `class-validator` DTO spread in `VendorsService.create` triggered a real (if practically harmless) `no-misused-spread` lint warning that had gone unaddressed | Lint noise; the pattern was fine (Prisma reads plain fields, no prototype/methods needed) but unexplained | **P2** | Suppressed with an inline comment stating why, matching the existing suppression pattern in the file |
| Architecture | Reviewed module boundaries, coupling, service boundaries, background jobs/events/caching need | No findings — two services, no circular deps, no N+1 queries, no caching/queue need at this scale | — | No change — healthy |
| Backend API design | Reviewed validation, error handling, permissions, pagination need | No findings beyond rate limiting (fixed above); `/vendors` returning a full array without pagination was evaluated and left as-is — an 8-vendor demo dataset doesn't justify pagination complexity | — | No change |
| Database | Reviewed schema, indexes, N+1 risk | No findings — `tenantId` and `expiresAt` indexes already cover the real query patterns | — | No change |
| AI | N/A | This product has no AI/ML component | — | Not applicable |
| DevOps / Observability | Reviewed Docker Compose, CI workflow, logging | No new findings this pass — already covered in the initial build's `docs/DEPLOYMENT.md`/`docs/SECURITY.md` | — | No change |

## What was deliberately *not* done, and why

- **No uniform card shadows or hover-lift on every card.** Applying depth everywhere is the most
  common tell of a generated/templated UI. Depth was applied to exactly two semantic moments (the
  one critical KPI, the one primary button) — the vendors table, forms, and other panels stay
  flat and fast, matching the same restraint already established in this workspace's other
  projects (e.g., `arbitragex-pro`'s own upgrade pass used the identical pattern).
- **No WebGL/Three.js.** Every depth effect is a CSS `box-shadow`/`transform` — GPU-cheap, no new
  dependency, and it respects `prefers-reduced-motion`.
- **No CSRF tokens.** Reasoned explicitly in [SECURITY.md](SECURITY.md): this is a JSON-only API
  behind a `SameSite=Lax` cookie, which already closes the realistic CSRF threat model for this
  request shape. Adding tokens would be complexity with no additional protection.
- **No pagination on `/vendors`.** An 8-vendor demo dataset doesn't justify it; flagged instead as
  a scale-triggered roadmap item, not built pre-emptively.
- **No BabaHakim/medical-app-specific 3D component set** (3D Stats Card, Spatial Dashboard Hero,
  Patient Summary, etc.) from the generic upgrade template this pass was run from — that section
  of the source instructions describes a different, unrelated project's brand system and does not
  apply to Veridex.

## Testing

```
api:  npm run build   → passes
api:  npm run lint    → passes (only known false-positive warnings, see docs/TESTING.md)
api:  npm test        → 16/16 passing (up from 12 — added DashboardService coverage)
web:  npm run build   → passes (all 13 routes)
web:  npm run lint    → passes, 0 warnings
```

**Not re-verified this pass:** the UI changes (skeletons, button/KPI depth) were not re-checked
in a live browser — this workspace's shared preview-server capacity (5 dev servers per folder)
was already fully used by other concurrent sessions when this pass ran. Verified instead via a
clean build/lint pass and by reusing the exact CSS technique already visually confirmed working
in the prior session. Docker Desktop also still could not be started in this sandboxed
environment (same limitation as the initial build — see [LIMITATIONS.md](LIMITATIONS.md)), so the
authenticated pages and live-database paths remain unverified end-to-end.

## Security

No critical or high findings from this pass beyond the rate-limiting gap, which is now fixed. Full
detail, including the CSRF reasoning, in [SECURITY.md](SECURITY.md).

## Final quality gate

- [x] Code quality improved (dead dependency removed, lint warning explained)
- [x] Backend improved (rate limiting, test coverage)
- [x] Frontend improved (loading states, accessibility)
- [x] Security improved (rate limiting; CSRF explicitly reasoned, not skipped)
- [x] UX improved (skeleton loading states)
- [x] UI improved (semantic depth on exactly the elements that warrant it)
- [x] Testing improved (12 → 16 tests)
- [x] Documentation improved (this report, plus SECURITY/TESTING/ROADMAP updated in place)
- [ ] Architecture / Database / DevOps / AI — reviewed, no findings, correctly left unchanged
- [ ] Mobile / accessibility fully re-verified live — blocked by the preview-server and Docker
      constraints noted above; code-level fixes are in place and were correct in the prior
      session's live verification of the same technique

**Final status: READY FOR NEXT PASS** (not "production ready" — see
[LIMITATIONS.md](LIMITATIONS.md) for the standing, disclosed gaps that are out of scope for a
demo project).
