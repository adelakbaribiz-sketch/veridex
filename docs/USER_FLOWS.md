# User Flows

## 1. Sign up (new organization)

```
Visit / → "Create a free organization" → /register
  → fill organization name, name, email, password
  → submit → POST /api/auth/register (Next.js Route Handler → NestJS)
  → NestJS creates Tenant + ADMIN User, returns JWT
  → Route Handler sets httpOnly session cookie
  → redirect to /dashboard
```

Validation: client-side (Zod, inline field errors) and server-side (class-validator on the
NestJS DTO — the client validation is a UX convenience, not the security boundary). A duplicate
email returns a 409, shown inline as "An account with this email already exists."

## 2. Sign in

```
Visit / → "Sign in" → /login → submit → POST /api/auth/login
  → wrong credentials: 401, shown inline as "Invalid email or password"
  → correct credentials: session cookie set, redirect to /dashboard
```

## 3. View dashboard

```
/dashboard loads (Server Component)
  → (app) layout checks session, redirects to /login if absent
  → parallel fetch: dashboard summary + vendor list
  → KPI cards render real counts
  → risk distribution bar chart renders (empty state if zero vendors)
  → "Needs attention" panel lists documents that are EXPIRING_SOON or EXPIRED,
    soonest first; empty state if none
```

## 4. Add a vendor

```
/vendors → "Add vendor" → dialog opens
  → fill name, category, contact email, optional risk score
  → submit → POST /api/proxy/vendors → NestJS creates vendor, writes audit log
  → dialog closes, list refreshes (router.refresh()), new vendor visible immediately
```

Failure path: if the API rejects the request (validation error, network issue), the dialog stays
open and shows the error inline — no silent failure, no fake success state.

## 5. Search and filter vendors

```
/vendors → type in search box → list filters client-side by name/category
         → click a status chip (Active / At risk / Offboarded) → list filters by status
         → both filters combine
         → no matches → "No matching vendors" empty state (distinct from "no vendors at all")
```

## 6. View a vendor and add a compliance document

```
/vendors → click a vendor row → /vendors/[id]
  → overview card (category, contact, status, risk score)
  → documents list, soonest-expiring first, each with a computed status badge
  → "Add document" → dialog → choose type, file name, issued/expires dates
  → submit → POST /api/proxy/vendors/:id/documents
  → dialog closes, page refreshes, new document appears with correct computed status
```

Note: no actual file is uploaded — see [LIMITATIONS.md](LIMITATIONS.md).

## 7. View team

```
/team → lists every user in the organization with name, email, role, join date
      → "Invite member" button is visibly present but disabled with a tooltip explaining
        invitations aren't implemented — not hidden, not faked
```

## 8. Sign out

```
Any authenticated page → "Sign out" (top right) → POST /api/auth/logout
  → clears the session cookie → redirect to /login
```
