# Deployment

## Local / self-hosted (Docker Compose)

`docker-compose.yml` at the repo root defines three services: `postgres`, `api`, `web`.

```bash
docker compose up -d --build
```

- `postgres`: Postgres 16, persisted to a named volume, with a healthcheck the `api` service
  waits on before starting.
- `api`: built from `api/Dockerfile` (multi-stage — installs, generates the Prisma client, builds
  to `dist/`, then a slim runtime image with production-only dependencies). Listens on 4000.
- `web`: built from `web/Dockerfile` using Next.js's `output: "standalone"` build. Listens on
  3000.

After the stack is up, run migrations once (they are not run automatically on container start,
deliberately — see below):

```bash
docker compose exec api npm run db:deploy
docker compose exec api npm run db:seed   # optional, loads demo data
```

## Why migrations aren't run automatically on boot

Running `prisma migrate deploy` as part of container startup is a common pattern but means a
container restart can trigger a migration attempt with no operator in the loop. For this project
size, an explicit, deliberate migration step is safer and more honest about what's happening than
a magic auto-migrate hidden in an entrypoint script.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | api | Postgres connection string |
| `JWT_SECRET` | api | Signs auth tokens — **must** be a long random value in any real deployment; there is no safe default (the app fails to start without it) |
| `JWT_EXPIRES_IN_SECONDS` | api | Token lifetime, defaults to 86400 (1 day) |
| `CORS_ORIGIN` | api | Must match the deployed frontend's origin exactly |
| `PORT` | api | Defaults to 4000 |
| `API_URL` | web (server-side only) | Where the Next.js server reaches the NestJS API — internal/container network address, never exposed to the browser |

See `api/.env.example` for the full list with example values. No real secret is committed
anywhere in this repository.

## What's not set up

- No CI/CD pipeline deploys anywhere automatically — `.github/workflows/ci.yml` runs lint/build/
  test on push and PR, but does not deploy.
- No managed hosting target (Fly.io, Railway, a Kubernetes cluster, etc.) is configured. The
  Docker images are portable to any of them; none was chosen because there is no real traffic to
  size for.
- No TLS termination is configured in `docker-compose.yml` — that's expected to sit in front of
  it (a reverse proxy or a platform's built-in HTTPS), not something this repo reimplements.
