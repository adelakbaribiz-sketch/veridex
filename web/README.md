# Veridex Web

Next.js frontend for Veridex. See the [repo root README](../README.md) for the full project
overview and [../docs/](../docs/) for architecture and user-flow docs.

## Setup

```bash
npm install
npm run dev   # http://localhost:3000 — requires the api service running, see ../docs/DEMO.md
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (type-checked) |
| `npm run lint` | ESLint |

## Structure

```
src/
├── app/
│   ├── (auth)/     # login, register — public
│   ├── (app)/      # dashboard, vendors, team, settings — authenticated, server-checked
│   └── api/        # auth + proxy Route Handlers (the BFF layer — see ../docs/ARCHITECTURE.md)
├── components/
│   ├── ui/          # Button, Card, Badge, Dialog, Input, EmptyState, Skeleton
│   ├── shell/        # Sidebar, Topbar, PageHeader
│   ├── vendors/       # status badges, tables, create/add-document dialogs
│   └── dashboard/     # KPI cards, risk distribution chart
└── lib/
    ├── api-server.ts  # Server Component data fetching (reads the session cookie)
    ├── api-client.ts  # Client Component mutations (via /api/proxy/*)
    ├── session.ts     # httpOnly cookie helpers
    └── types.ts        # Shared domain types matching the API's Prisma models
```

## Design system

Navy/copper "governance" visual identity — Source Serif 4 for headings, Inter for UI/body text.
Tokens are defined as CSS custom properties in `src/app/globals.css` with a `prefers-color-scheme`
dark-mode variant.
