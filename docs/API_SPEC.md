# API Reference

The live, generated source of truth is Swagger/OpenAPI at **`{API_URL}/api/docs`** once the API
is running (`http://localhost:4000/api/docs` in local dev). This document is a quick-reference
summary for readers who aren't running the server.

All endpoints below are prefixed with `/api`. All endpoints except `auth/register` and
`auth/login` require `Authorization: Bearer <token>` and are scoped to the caller's tenant —
there is no way to pass a different tenant ID and see another organization's data.

## Auth

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/auth/register` | `{ organizationName, name, email, password }` | `{ accessToken }` — creates a new Tenant + ADMIN User |
| POST | `/auth/login` | `{ email, password }` | `{ accessToken }` |

## Users

| Method | Path | Returns |
|---|---|---|
| GET | `/users/me` | Current user profile + organization |
| GET | `/users` | All users in the caller's tenant (for the Team page) |

## Vendors

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/vendors` | — | All vendors in the caller's tenant, with documents |
| GET | `/vendors/:id` | — | 404 if the vendor belongs to another tenant |
| POST | `/vendors` | `{ name, category, contactEmail, riskScore? }` | |
| PATCH | `/vendors/:id` | Partial of the above | |
| DELETE | `/vendors/:id` | — | |
| POST | `/vendors/:id/documents` | `{ type, fileName, issuedAt, expiresAt }` | Adds a compliance document; does not accept a file upload (metadata only) |

## Dashboard

| Method | Path | Returns |
|---|---|---|
| GET | `/dashboard/summary` | Computed KPIs: vendor counts by status, risk distribution, documents expiring soon/expired — see [DATA_MODEL.md](DATA_MODEL.md) |

## Health

| Method | Path | Returns |
|---|---|---|
| GET | `/health` | `{ status, database, timestamp }` — `database` reflects a real `SELECT 1` query, not a hardcoded value |

## Error shape

Validation and auth errors follow NestJS's default shape:

```json
{ "statusCode": 400, "message": ["email must be an email"], "error": "Bad Request" }
```

The frontend's `extractApiErrorMessage` helper normalizes both string and string-array `message`
values for display.
