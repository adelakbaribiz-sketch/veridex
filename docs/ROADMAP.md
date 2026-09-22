# Roadmap

Status key: what exists today vs. what a production version would need. Nothing here is a
promise or a timeline — it's an honest list of what was deliberately left out and why.

## Near-term (would come before any real users)

- **Role-based authorization.** The `role` field exists and is displayed, but no endpoint
  enforces it yet. Needed: a `RolesGuard` checking `role` against required roles per endpoint
  (e.g., only ADMIN can delete a vendor).
- **Team invitations.** Currently the only way into an organization is to be its founding Admin.
  Needed: an invite-by-email flow, a pending-invitation state, and an accept-invite page.
- **Editing a vendor's status from the UI.** The API supports `PATCH /vendors/:id` with a
  `status` field; there is no edit form in the frontend yet, only create.
- **Real file storage.** `ComplianceDocument.fileName` is metadata only. Needed: an object
  storage integration (S3-compatible), a signed upload URL flow, and virus/type scanning before
  accepting a file.
- **Expiration notifications.** Nothing currently emails or notifies anyone when a document
  becomes `EXPIRING_SOON`. Needed: a scheduled job (cron or queue-based) and an email provider
  integration.
- **Audit log viewer.** Every mutation is already recorded in `AuditLog`; there is no screen to
  browse it.

## Medium-term (scaling / hardening)

- **Token refresh & revocation.** Current JWTs are stateless with a 1-day expiry and no way to
  invalidate a token early (e.g., on logout-everywhere or a compromised device).
- **SSO/SAML for enterprise tenants.**
- **Row-level security or schema/DB-per-tenant** if a tenant ever needs stronger isolation
  guarantees than application-level `tenantId` filtering.
- **Locking down `/api/docs`** (Swagger) behind auth or removing it from production builds.

## Explicitly not planned unless a real need appears

- Microservices / message queue split — there's one bounded context and no independent scaling
  need today; splitting now would be complexity without a corresponding benefit.
- AI/ML risk scoring — `riskScore` is manual by design; an automated model would need real
  historical data this demo doesn't have, and fabricating one would violate the project's own
  ground rules (see [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)).

## Business model (proposed only, not implemented)

Seat-based or vendor-count-based subscription pricing, standard for this SaaS category. No
pricing page, billing integration, or plan gating exists in this build — this is a product/
engineering demo, not a monetized product.
