# Server — Express 5 + MongoDB API

TypeScript, Express 5, Mongoose 9, Yup, JWT. Serves the content the Next.js app renders and the
back-office API the panel uses. Interactive docs at **`/docs`** on the API port (8500 for slot 5 —
see the root README); off in production unless `DOCS_ENABLED=true`.

## URL layout

| Prefix | Auth | Purpose |
| --- | --- | --- |
| `/auth/*` | – / bearer | login, refresh (rotating), logout, me, password |
| `/admin/*` | bearer + role/permission | back office: users, settings, pages, catalog, media, tickets, dashboard |
| `/public/*` | – | locale-resolved, published content only (`?locale=fa`) |
| `/uploads/*` | – | static media written by the media module |
| `/docs` | – | Swagger UI, `/docs/openapi.json` (development; `DOCS_ENABLED` in production) |
| `/health`, `/health/ready` | – | liveness (no I/O) and readiness (MongoDB ping, `503` when down) — used by the compose healthcheck |

## Modules (`src/modules/<name>/`)

| Module | What it owns |
| --- | --- |
| `auth` | `Admin` accounts (roles `developer`/`admin`, `permissions[]`), `RefreshToken` store, rotation + reuse detection |
| `users` | Developer-only account management (cannot delete self / last developer) |
| `settings` | Singleton site settings: branding, navbar/footer, contact ways, SEO, enabled locales |
| `pages` | One document per page (`landing/about/contact/catalog`) with typed sections; `sections.registry.ts` = Yup schema per section type |
| `catalog` | `CatalogType` (spec definitions, card design, filter config) → `CatalogCategory` → `CatalogItem` (`specs` validated per type) |
| `media` | multer (memory) → sharp → WebP + thumb via `core/storage` driver |
| `tickets` | Public request form (token + honeypot + limits), admin inbox, `/admin/dashboard` counts |
| `sitemap` | `/public/sitemap` payload for `sitemap.xml` |

File convention inside a module: `<name>.model.ts`, `interface.payload.ts`, `interface.response.ts`,
`adapter.modelToResponse.ts`, `<name>.validation.ts`, `<name>.service.ts`, `<name>.controller.ts`,
`<name>.routes.ts`. Docs live in `src/docs/paths/<name>.ts` and are merged by `src/docs/openapi.ts`.

## Cross-cutting pieces (`src/core`)

- `auth/permissions.ts` — `PERMISSIONS` list, `hasPermission` (developer bypasses everything).
- `middleware/` — `requireAuth`, `requireRole`, `requirePermission(key | req => key)`, `rateLimit`, `validate`, `errorHandler`.
- `i18n/` — `LocalizedString` (Mongoose `Map`), `resolveLocalized`, Yup `localizedString({ required, optional })`, safe `href`/image/icon patterns.
- `revalidate/` — `triggerRevalidate(tags)` → `POST {REVALIDATE_URL}/api/revalidate` after every content write (fire-and-forget).
- `storage/` — `StorageDriver` interface; `localDiskDriver` is the default (swap for S3 in one file).
- `pagination/` — `?limit=&offset=` → `{ data, total, limit, offset, total_pages }`.

## Security notes

- Passwords: bcrypt, policy min length + letter + digit. Login limited to 10 / 15 min per IP.
- Refresh tokens are stored hashed, rotated on every refresh; reuse of a consumed token revokes the account's sessions.
- Permission changes take effect on the next access-token refresh (≤ `JWT_ACCESS_EXPIRES_IN`).
- Uploads: mimetype whitelist + sharp re-encode (no original bytes stored), size cap, server-generated keys, `dotfiles: deny`.
- Public catalog filters iterate only over developer-enabled spec definitions, never over query keys.
- Tickets: HMAC token (3 s – 1 h, single-use via TTL collection), honeypot answered with a fake 201, 5 submissions / 15 min per IP, IPs stored as salted hashes only.
- Helmet, CORS allow-list, 1 MB JSON limit, `trust proxy` = `TRUST_PROXY_HOPS` (default 1).
- Production refuses weak secrets, a missing or `*` `CORS_ORIGIN`, and seeding accounts without explicit `*_SEED_*` values.
- Logging: pino, always on, JSON on stdout (pretty-printed in development). One line per request without headers; unhandled errors are always logged.

## Environment

See `.env.example`. Notable: `REVALIDATE_URL`/`REVALIDATE_SECRET` (web app), `UPLOADS_DIR`, `MAX_UPLOAD_MB`,
`DEFAULT_LOCALE`, `PASSWORD_MIN_LENGTH`, `TICKET_TOKEN_SECRET`, `IP_HASH_SALT`, `*_SEED_*` accounts,
`LOG_LEVEL`, `DOCS_ENABLED`, `TRUST_PROXY_HOPS`. Production values: `deploy/.env.prod.example`.

## Scripts

```bash
npm run dev        # tsx watch (from the repo root: `make dev-api` runs it on the slot's ports)
npm run seed       # idempotent: accounts, settings, pages, catalog, tickets
npm run typecheck && npm run lint && npm run build
```

## Adding a resource

1. Copy the `tickets` module layout, mount the router in `src/routes.ts` under `/admin/...` and/or `/public/...`.
2. Guard admin routes with `requireAuth` + `requireRole('developer')` or `requirePermission('<key>')`
   (add the key to `core/auth/permissions.ts` **and** `client/src/lib/auth/permissions.ts`).
3. Localized text: `localizedStringSchema()` in the model, `localizedString()` in Yup, `mapToObject`/`resolveLocalized` in adapters.
4. Call `triggerRevalidate([...tags])` after writes and use the same tags in the client's `publicFetch`.
5. Document it in `src/docs/paths/<name>.ts`; seed it in `src/db/seed/`.
