# Data Model

Source of truth: [`api/prisma/schema.prisma`](../api/prisma/schema.prisma). This document is a
human-readable companion to it, not a duplicate to keep in sync by hand for every field — if the
two disagree, the schema file is correct.

## Entities

### Tenant

One row per organization ("Acme Procurement"). Every other tenant-scoped table carries a
`tenantId` foreign key to this table.

| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | |
| name | string | Organization display name |
| slug | string | Unique, generated from `name` + random suffix at registration |
| createdAt | datetime | |

### User

| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | |
| tenantId | string | FK → Tenant |
| email | string | Globally unique — login is by email only, no org selector |
| passwordHash | string | bcrypt, 12 rounds |
| name | string | |
| role | enum: ADMIN, MANAGER, MEMBER, VIEWER | Set to ADMIN for the user who registers the org; role-based UI gating is not implemented beyond storing the value |
| createdAt | datetime | |

### Vendor

| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | |
| tenantId | string | FK → Tenant |
| name | string | |
| category | string | Free text (e.g. "Logistics"), not a controlled vocabulary |
| contactEmail | string | |
| riskScore | int | 0–100, set manually on create/update — there is no automated risk scoring model |
| status | enum: ACTIVE, AT_RISK, OFFBOARDED | Set manually; not auto-derived from riskScore or document status |
| createdAt / updatedAt | datetime | |

### ComplianceDocument

| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | |
| tenantId | string | Denormalized from the parent vendor, for direct tenant-scoped queries |
| vendorId | string | FK → Vendor |
| type | enum: INSURANCE_CERT, SOC2_REPORT, ISO27001, CONTRACT, OTHER | |
| fileName | string | **Metadata only.** No file is actually uploaded or stored — see LIMITATIONS.md |
| issuedAt / expiresAt | datetime | |
| status | enum: VALID, EXPIRING_SOON, EXPIRED | Stored for query convenience, but the API always **recomputes** this from `expiresAt` before returning it to the client — see `document-status.util.ts` |

### AuditLog

| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | |
| tenantId | string | FK → Tenant |
| userId | string? | FK → User, nullable so a user can be deleted without losing history |
| action | string | e.g. `vendor.created`, `document.uploaded` |
| entityType / entityId | string | |
| metadata | json? | |
| createdAt | datetime | |

## Relationships

```
Tenant 1───* User
Tenant 1───* Vendor
Tenant 1───* AuditLog
Vendor 1───* ComplianceDocument
User   1───* AuditLog (as actor, nullable)
```

## Deliberate simplifications

- **Email is globally unique**, not unique-per-tenant. A person cannot belong to two Veridex
  organizations with the same email in this demo. This matches how most small SaaS products
  actually work (one account, one org) and avoids building an org-switcher for a scenario that
  doesn't exist yet.
- **`riskScore` and `status` are both manual fields set by the user**, not computed from the
  compliance documents. A real product would likely derive risk from document status and
  category; this is flagged as `PROPOSED` in [ROADMAP.md](ROADMAP.md), not silently assumed.
- **No historical/time-series table.** The dashboard's risk chart shows the *current* distribution
  of vendors by risk band, not a trend over time, because there is no snapshot table to compute a
  trend from — and a trend line built from a single point-in-time query would be fabricated data.
