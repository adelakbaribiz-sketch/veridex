# Project Context

## Origin

This project was created from a **generic, product-undefined technical dossier** produced during
an investor-follow-up conversation. That dossier explicitly marked almost every product-specific
field (name, domain, target users, business model, feature set) as `UNKNOWN`. Only the general
process ("send deck → meeting → negotiation → proposal → contract") and a generic list of modern
SaaS architecture patterns were confirmed.

No existing product name, customer, dataset, or business result was supplied anywhere in that
conversation. Building a credible, demoable SaaS therefore required inventing a concrete product
concept. **That invention is disclosed here explicitly** so nobody mistakes it for a real, funded,
or customer-validated business.

## Classification

Per the project-type taxonomy used to scope this work, this repository is classified as:

**C. SAAS** (B2B, multi-tenant, web application)

No Hybrid outputs (research package, trading strategy, book manuscript, etc.) apply — the source
material contained no research question, dataset, trading logic, or manuscript content.

## Invented demo concept: "Veridex"

To have something concrete enough to design a real UI, data model, and API around, this project
adopts one invented example vertical:

> **Veridex** — a vendor compliance & risk-tracking SaaS for mid-market procurement/ops teams.
> Teams upload vendor insurance certificates, SOC 2 / ISO reports, and contracts; Veridex tracks
> expiration dates, computes a simple risk score, and reminds the team before a compliance
> document lapses.

This was chosen because:
- It is a real, well-understood B2B SaaS category (comparable to existing products like Venminder
  or Prevalent), so the resulting UX/IA reads as a plausible product rather than a toy.
- It naturally exercises the UI surface an investor/reviewer expects from a SaaS demo: a KPI
  dashboard, a searchable/filterable data table, detail views, a calendar of upcoming events, an
  audit log, role-based team management, and settings/onboarding.
- It does **not** overlap with the other real projects in this workspace (a marketing-automation
  SaaS, a drug-repurposing research project, and a patent dossier), avoiding confusion between
  invented demo content and this user's actual, separate work.

**"Veridex" is a fictional product built for demonstration/portfolio purposes. No real company,
customers, revenue, investment, or compliance certification exists.** Every screen that shows
data not backed by the live database is labeled `DEMO DATA` in this documentation and, where
practical, in the UI itself.

## Gap analysis (what the source dossier did not provide, and how each gap was closed)

| Gap | Resolution | Status |
|---|---|---|
| Product name / domain | Invented "Veridex" (vendor compliance SaaS) | ASSUMPTION |
| Target users / personas | Assumed: Procurement Manager, Compliance Officer, Vendor (read-only), Org Admin | ASSUMPTION |
| Core feature set | Derived from the vendor-compliance vertical: vendor registry, document tracking, risk scoring, renewal calendar, team/roles, audit log | ASSUMPTION |
| Data model | Designed from scratch: `Tenant`, `User`, `Role`, `Vendor`, `ComplianceDocument`, `AuditLog` | DESIGNED |
| Business model / pricing | Not fabricated — left as `PROPOSED (seat + tier based)` in [ROADMAP.md](ROADMAP.md), no invented numbers | TODO / OPEN |
| Compliance certifications (SOC 2, ISO 27001, etc.) | **Not claimed.** The product tracks *other companies'* compliance documents; it does not itself hold any certification | NOT IMPLEMENTED |
| Real customers / usage / revenue | **Not fabricated anywhere in this repo.** | NOT APPLICABLE |
| Security implementation | Real for what exists (hashed passwords, JWT, input validation, tenant scoping); anything beyond that (SSO/SAML, pen test, SOC 2) is listed as `PROPOSED` in [SECURITY.md](SECURITY.md) | PARTIAL / REAL |
| UX states (empty/loading/error/success) | Implemented in the frontend for the core flows | REAL |
| Automated tests | Minimal real tests added for auth and the vendors API; full coverage is `TODO` | PARTIAL |
| Deployment | Docker Compose provided and runnable locally; no live/hosted deployment exists | REAL (local), NOT DEPLOYED (hosted) |

## What is real vs. simulated in this repository

- **Real**: the Next.js frontend, the NestJS API, the Prisma schema and Postgres integration,
  JWT authentication, the Docker Compose stack, the CI workflow, and any data you create yourself
  by using the running app.
- **Simulated / demo data**: the KPI numbers, sample vendors, sample compliance documents, and
  chart data seeded via `api/prisma/seed.ts` for demoing the UI without manual data entry. These
  are clearly seed fixtures, not production or customer data.
- **Not implemented**: billing/payments, SSO/SAML, email delivery, file storage for real uploaded
  documents (the demo stores a filename/metadata only, not an actual file), and any AI/ML feature.
  These are listed under [ROADMAP.md](ROADMAP.md) as future work, not silently assumed to exist.

See [LIMITATIONS.md](LIMITATIONS.md) and [DEMO.md](DEMO.md) for the authoritative, up-to-date
statement of what is real versus mocked.
