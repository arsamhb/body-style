# Adoption report — mern-boilerplate

Slot: 5   Units: `server`, `web`   DB: mongo   infra version: 2

Adopted on 2026-09-30 following `ADOPT.md` from the infra repo (`~/Desktop/dev/infra`).
Nothing was shipped or deployed: adoption ends with a local build and this report.

## Contract checklist

```
[x] 1  Makefile includes infra/common.mk; make help works; infra/ untouched
[x] 2  PROJECT_SLOT in .env(.example); no hardcoded host ports; make doctor passes
[x] 3  /health + /health/ready on every API; /api/health on Next apps
[x] 4  Dockerfile per unit: multi-stage, non-root, .dockerignore; ARGS_<unit> declared
[x] 5  deploy/compose.prod.yml + Caddyfile + .env.prod.example present and standalone
[x] 6  no migration in CMD/entrypoint; MIGRATE set; CI round-trips migrations
       (MongoDB: there are no migrations. MIGRATE is empty on purpose; nothing seeds on start.)
[x] 7  cron → ofelia labels; workers → services; no in-process schedulers
       (The app has no periodic jobs and no workers. Expiry is done by MongoDB TTL indexes.)
[x] 8  dev flags default safe; CORS explicit; errors logged in prod; hardening block kept in compose.prod.yml
[x] 9  ci.yml + release.yml copied; lint/test blocking; VERSION_FILES set
[x] 10 make build VERSION=test succeeds locally
```

Verified locally:

- `make doctor && make up && make migrate && make seed && make test && make lint && make build VERSION=test && make down` — all passed.
- Native dev servers on the slot ports (`make dev-db`, `make dev-api`, `make dev-web`) — API, docs, web and CORS work on 8500 / 3500.
- `deploy/compose.prod.yml` was started locally from the built images under a throwaway project name, behind a Caddy container using `deploy/Caddyfile` and the platform Caddyfile. Checked: all three services report healthy with the hardening block; seed runs inside the production image; login and an image upload through Caddy; the uploaded file is served from the web hostname; CORS allows the listed origin only; `/docs` returns 404; MongoDB refuses unauthenticated reads; the exact `mongodump` command from `platform/backup.sh` produces an archive; server → web revalidation returns 200.

Not verified (needs a real server): `make ship`, `make deploy`, the GitHub workflows, the nightly backup upload, and anything in the Arvan panel.

## Changes made

1. **Vendor** — `infra/` copied verbatim from `infra/vendor` (v2).
2. **Makefile** — new. `APP=mern-boilerplate`, `UNITS=server web`, `DB_KIND=mongo`, `MIGRATE` empty. App targets below the include: `dev-db`, `dev-api`, `dev-web`, `dev-seed`, `seed-prod`, `app-secrets`.
3. **Port slot** — `PROJECT_SLOT=5` in `.env.example` and the local `.env`. `docker-compose.yml` publishes `${HOST_API_PORT}`, `${HOST_WEB_COMPOSE_PORT}`, `${HOST_MONGO_PORT}`; the public URLs baked into the dev web image follow the slot. The OpenAPI `servers` entry is now relative instead of `localhost:4000`.
4. **Health** — `GET /health/ready` (MongoDB ping, 503 when down) next to `/health`; `GET /api/health` in the Next app; healthchecks wired in both compose files. Health routes were removed from the OpenAPI document (contract §3).
5. **Dockerfiles** — client: `npm ci --ignore-scripts`, and `HOSTNAME=0.0.0.0` in the runtime stage (without it the standalone server binds to the container hostname, so the healthcheck and one of the two networks cannot reach it). Server: `uploads` added to `.dockerignore`.
6. **`deploy/`** — `compose.prod.yml` (standalone; only `server` loads `.env`; web gets `API_INTERNAL_URL` and `REVALIDATE_SECRET`; MongoDB with a root user), `Caddyfile` (`api.<domain>` → server, `<domain>` and `www` → web), `.env.prod.example`.
7. **Migrations and background work** — nothing to move. The seed was already manual and stays manual (`make seed` / `make seed-prod`).
8. **Safe defaults**
   - Logging: dev-only `morgan` replaced by `pino` + `pino-http`, always on, JSON on stdout (pretty in development). Request lines carry no headers, so tokens are never logged. Unhandled errors, unhandled rejections and failed revalidation calls are now logged in production (they were silent).
   - `/docs` is off in production unless `DOCS_ENABLED=true`. The dev compose stack switches it on.
   - `CORS_ORIGIN` is required in production; `*` is refused.
   - Seed accounts: the demo credentials (`developer@example.com` / `developer123`, …) are development-only defaults now. In production the seed refuses to create accounts until the four `*_SEED_*` variables are set.
   - `TRUST_PROXY_HOPS` (default 1, the previous hardcoded value) — see Risks.
9. **CI** — `ci.yml` (Node from `.nvmrc`, `npm ci` in both packages, then `make lint`, `make test`, `make build`) and `release.yml` (verbatim). There were no old workflows.
10. **Docs** — root README (make vocabulary, slot rule, deployment pointer), package READMEs, `.env.example` files, `CODEBASE_MINDMAP.md`.

## Removed

- `server/src/docs/paths/health.ts` and the `HealthResponse` schema — health probes are excluded from the API docs.
- `morgan`, `@types/morgan` — replaced by pino.
- No deploy artefacts existed to delete (no overlays, no other-platform configs).

## TODO(human)

1. **Domain.** `example.ir` is a placeholder in three places that must agree: `ARGS_web` in the `Makefile`, `deploy/Caddyfile`, and `CORS_ORIGIN` in the server's `.env`. The layout assumes two hostnames: `<domain>` (+ `www`) for the site and `api.<domain>` for the API.
2. **`DEPLOY_HOST`** in the `Makefile` (`deploy@TODO`) once the VPS exists; GitHub secrets `DEPLOY_HOST` and `DEPLOY_SSH_KEY` for tag deploys.
3. **Git remote.** `origin` of this repo points at `VerveDevLab/BOXOPEN-MONOREPO.git`. `make release` pushes commits and tags to `origin` — confirm or fix the remote before the first release. Nothing was pushed during adoption.
4. **Secrets.** Create `/opt/mern-boilerplate/.env` from `deploy/.env.prod.example`; `make app-secrets` prints values for every `change-me`. (`make secrets` from the template prints Postgres-oriented names; `app-secrets` covers this app.)
5. **Visitor IPs behind the CDN** — see the first risk. Needs Arvan's CDN ranges.
6. **Uploads backup** — see the second risk. Decide before real content is uploaded.
7. **First deploy.** After `make deploy`, run `make seed-prod` once. It creates the two accounts and the demo content (pages, catalog, sample tickets); remove the demo content you do not want through the panel.
8. **This is a boilerplate.** A project cloned from it must change `APP` (Makefile) and `name:` (compose.prod.yml) together, take the next free `PROJECT_SLOT`, and get its own VPS.

## Risks / deviations

- **Rate limits would be shared by all visitors behind one CDN edge.** Login (10 / 15 min) and request-form (5 / 15 min) limits are per client IP. Tested locally: Caddy replaces `X-Forwarded-For` with the address that connected to it, which in production is an Arvan edge server, not the visitor. Left as is, a handful of visitors could lock everyone out of the login and the request form. The fix is two settings that must go together: list the CDN ranges in `trusted_proxies` in `deploy/Caddyfile` (the line is there, commented) and set `TRUST_PROXY_HOPS=2` in the server `.env`. With only one of the two, behaviour stays as it is today. A cleaner home for the ranges would be the platform Caddyfile in the infra repo, so every app gets it.
- **Uploaded media is not backed up.** Files live in the `uploads-data` Docker volume on the VPS. `platform/backup.sh` dumps databases only, so losing the disk loses every uploaded image while the database still references them. Options: add the volume to the platform backup, or write an S3 `StorageDriver` for Arvan Object Storage (the interface exists in `server/src/core/storage`).
- **This repo is not in the slot registry.** It lives at `~/Desktop/dev/VerveDevLab/MERN-BOILERPLATE`, one level deeper than `slots.sh` scans (`~/Desktop/dev/*/.env`). `make doctor` still catches a clash with repos that are listed, but `make ports` does not show this repo and other repos cannot see that slot 5 is taken.
- **Slot table vs. reality.** `ADOPT.md` assigns slot 1 to `boxopen` and slot 2 to `havale`; on this machine `make ports` shows `open-box-monorepo` (1), `soroosh-monorepo` (2), `handele-monorepo` (3). No clash with slot 5.
- **`infra/` observations (not edited here).** `infra/VERSION` says 2 while `common.mk` has `INFRA_VERSION := 1`, so `make help` prints "infra v1". `make migrate` with an empty `MIGRATE` prints "nothing to do" and then still runs an empty `exec` (harmless). `deploy.sh` only blocks `OTP_*` dev flags, so `DOCS_ENABLED=true` in a production `.env` would not be refused.
- **Tests.** There is no test suite. `make test` type-checks the server; the client is type-checked by `next build` inside `make build`.
- **Service names.** The units are `server` and `web` (the existing compose names), not `api`/`web` as in the template examples, so it is `make logs S=server`.
- **Single process assumptions.** Rate limiters and the public-site cache are in memory. Correct at one replica, which is what the template runs.
- **One image per domain.** `NEXT_PUBLIC_*` values are baked into the web image at build time (accepted by the contract).
- **Local side effects of adoption.** The local `.env` gained `PROJECT_SLOT=5` and lost the two `PUBLIC_*_URL` lines that pinned ports 3000/4000. The dev MongoDB container now listens on 27023 instead of 27017 (same data volume); `server/.env` still says 27017, which is why native dev goes through `make dev-api`.
