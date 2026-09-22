# Product Requirements

## Product

**Veridex** — a vendor compliance & risk-tracking SaaS for procurement/operations teams. See
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for why this concept was chosen and what is invented vs.
real.

## Personas

| Persona | Goal | Access in this build |
|---|---|---|
| Org Admin | Set up the organization, see everything | Full access (role stored, not yet enforced per-endpoint) |
| Procurement / Compliance Manager | Track vendors and their documents day to day | Same access as Admin in this build — role-gated UI is a roadmap item |
| Team Member (Viewer) | See the dashboard and vendor list | Same access as Admin in this build |

Role-based access control has a `role` column and is read by the frontend to *display* a badge,
but no endpoint currently restricts an action by role. This is documented, not hidden — see
[SECURITY.md](SECURITY.md) and [ROADMAP.md](ROADMAP.md).

## Functional requirements implemented

1. A visitor can create a new organization (self-serve signup) and is signed in immediately as
   its Admin.
2. A user can sign in and out.
3. A signed-in user sees a dashboard with real, computed KPIs for their organization: vendor
   counts by status, risk-band distribution, and documents expiring soon / already expired.
4. A user can list, search, and filter their organization's vendors.
5. A user can view a single vendor's detail page, including its compliance documents.
6. A user can add a vendor and add a compliance document to a vendor, with client- and
   server-side validation.
7. A user can see the other members of their organization.
8. All of the above is isolated per tenant: one organization cannot see another's data.

## Functional requirements explicitly out of scope for this build

Documented in [LIMITATIONS.md](LIMITATIONS.md) and [ROADMAP.md](ROADMAP.md): team invitations,
per-role permission enforcement, file upload/storage, billing, SSO/SAML, email notifications for
expiring documents, an audit log viewer UI (the data is captured, there is no screen for it yet).

## Non-functional requirements

- **Multi-tenancy**: every tenant-scoped query filters by `tenantId` taken from the verified JWT,
  never from client-supplied input.
- **Responsive**: the UI is usable from a 375px-wide viewport up through desktop.
- **Accessible basics**: semantic form labels, focus-visible states, `aria-modal`/`aria-label` on
  the dialog, keyboard (Escape) support for dialogs. A full WCAG audit was not performed — see
  LIMITATIONS.md.
- **Honest UI**: every screen that would otherwise be empty on a fresh account shows a real empty
  state, not a placeholder chart with fabricated numbers.
