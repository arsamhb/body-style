# Promotional Website Boilerplate

A starter for shipping promotional / brochure websites fast: a bilingual (Farsi-first, RTL/LTR)
public site whose every section is content-managed, plus a two-tier back office where the
**developer** shapes the site and decides what the client's **admin** account may edit.

```
.
├─ client/            # Next.js 16 (App Router) — public site + admin panel   → client/README.md
├─ server/            # Express 5 + MongoDB API                                → server/README.md
├─ Makefile           # the one interface: dev, release, deploy (`make help`)
├─ infra/             # vendored from the infra repo — never edit here
├─ deploy/            # production: compose.prod.yml, Caddyfile, .env.prod.example
├─ docker-compose.yml # dev stack: mongo + server + web
├─ .env.example       # port slot + secrets for the dev stack (copy to .env)
├─ CODEBASE_MINDMAP.md# where everything lives, flows, gotchas — read this first
└─ .nvmrc             # Node 24
```

## What you get

| Area | Included |
| --- | --- |
| Public pages | Landing, About, Contact, Catalog (types → listing with filters → item page), 404 |
| Sections (17) | hero, intro, features, catalog highlights, samples, stats, testimonials, partners, CTA banner, FAQ, request form, about hero, mission & vision, achievements, contact hero, contact info, map — each toggleable, orderable, editable |
| Catalog | Developer-defined *types* with typed **specs** (text, number, boolean, select, multiselect, price, url), card design with live preview, category + spec filters, sorting, item detail with request form |
| Requests (tickets) | Public form on any page/item, records its origin, honeypot + signed single-use token + rate limits, admin inbox with triage |
| Back office | Roles `developer` / `admin`, per-account permission matrix, users, media library (uploads re-encoded to WebP), site settings (branding, navigation, contact ways, SEO, languages) |
| i18n | `fa` (default, RTL) and `en` (LTR) out of the box; every text field is stored per locale; add a locale in two files |
| SEO | Server-rendered pages, per-page metadata, hreflang/canonical, Organization + Product JSON-LD, sitemap.xml, robots.txt, `next/image` |
| Design system | Grayscale tokens in `client/src/globals.css`; re-skinning = editing the primitives block |

## Run with Docker

```bash
cp .env.example .env            # set PROJECT_SLOT, fill the secrets: openssl rand -hex 32
make up                         # build + start mongo, server, web
make seed                       # accounts + demo content (idempotent)
make logs S=server              # or: make ps · make sh S=server · make down
```

Host ports come from `PROJECT_SLOT` in `.env`, never from a hardcoded number, so several projects
can run side by side. This repo is slot 9; **a project cloned from it takes the next free slot**
(`make ports` lists the taken ones, `make up` refuses a slot another repo already uses).

| | Formula | Slot 9 |
| --- | --- | --- |
| API (+ `/docs`) | 8000 + N×100 | http://localhost:8900 |
| Web in Docker (`make up`) — panel at `/admin` | 3010 + N×100 | http://localhost:3910 |
| Web native (`make dev-web`) | 3000 + N×100 | http://localhost:3900 |
| MongoDB | 27018 + N | localhost:27027 |

## Run locally (native dev servers)

```bash
cd server && cp .env.example .env && npm install && cd ..
cd client && cp .env.example .env.local && npm install && cd ..
make dev-db                     # MongoDB only
make dev-seed                   # once
make dev-api                    # tsx watch on the slot's API port
make dev-web                    # next dev on the slot's web port (second terminal)
```

`make dev-api` / `make dev-web` pass the slot's ports and URLs to the dev servers, so the two
package `.env` files keep their defaults.

## The `make` vocabulary

The same words work in every project built on the infra template (`make help` lists them all).

| Local | Production |
| --- | --- |
| `make up` / `down` / `nuke` / `ps` | `make ship VERSION=…` — build images, copy them to the VPS |
| `make logs S=server` / `sh S=server` / `restart S=server` | `make deploy VERSION=… [AT="YYYY-MM-DD HH:MM"]` — switch (or schedule) |
| `make seed` / `test` / `lint` | `make deploy-status` / `deploy-cancel` / `releases` |
| `make doctor` / `ports` | `make logs-prod S=server` / `ps-prod` / `sh-prod S=server` |
| `make build VERSION=…` | `make backup-now` · `make seed-prod` (once, after the first deploy) |
| `make release VERSION=vX.Y.Z` | rollback: `make deploy VERSION=<older>` |

## Deployment

One Arvan VPS, Docker Compose, images built off the server and shipped over SSH, Caddy in front,
releases are git tags. The convention lives in the infra repo (`~/Desktop/dev/infra/README.md`);
this repo's part is the `Makefile`, `deploy/` and `.github/workflows/`. Before the first release,
resolve the `TODO(human)` items in `ADOPTION_REPORT.md`.

## Seed accounts

| Role | Email | Password | Access |
| --- | --- | --- | --- |
| developer | `developer@example.com` | `developer123` | everything |
| admin | `admin@example.com` | `changeme123` | catalog items & categories, requests, media, landing page |

Change them through the panel (Users) or the `*_SEED_*` env vars before the first seed. These demo
credentials exist in development only: in production the seed refuses to run until all four
`*_SEED_*` variables are set.

## Where to start

- `CODEBASE_MINDMAP.md` — architecture, flows (revalidation, permissions, ticket token, filter whitelist), gotchas.
- `client/README.md` — design tokens, i18n, adding a section, admin panel structure.
- `server/README.md` — modules, URL layout, permissions, env, adding a module.
