# Promotional Website Boilerplate — Codebase Mind Map

> Working map for navigating this repo. Snapshot as of 2026-09-30 (end of the "promotional website" build, plus the infra-template adoption).
> Both packages lint clean, typecheck clean and build. No automated tests exist; verification is the
> curl/Puppeteer checklist at the bottom.

```
MERN-BOILERPLATE (monorepo, no root package.json, Node 24 — .nvmrc, Dockerfiles, engines)
│
├── ROOT = dev + deploy tooling (infra template, adopted 2026-09-30 — see ADOPTION_REPORT.md)
│   ├── Makefile ── APP=ghahremani-bodystyle, UNITS=server web (one per image), ARGS_web (NEXT_PUBLIC_* build args), DB_KIND=mongo,
│   │     MIGRATE empty; then `include infra/common.mk`. App targets below the include: dev-db, dev-api, dev-web, dev-seed, seed-prod, app-secrets
│   ├── infra/ ── VENDORED from ~/Desktop/dev/infra/vendor (common.mk = every make target, deploy.sh = host-side switch). Never edit here.
│   ├── docker-compose.yml ── DEV stack: mongo → server → web, healthchecks on all three. Host ports from PROJECT_SLOT (.env):
│   │     API 8000+N×100 → :4000 · web 3010+N×100 → :3000 · mongo 27018+N → :27017   (slot 5: 8500 / 3510 / 27023; native web 3500)
│   │     server: MONGODB_URI, JWT_*, REVALIDATE_URL=http://web:3000, REVALIDATE_SECRET, UPLOADS_DIR=/app/uploads (volume uploads-data), DOCS_ENABLED=true
│   │     web (BUILD ARGS, inlined): NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_DEFAULT_LOCALE, API_INTERNAL_URL=http://server:4000
│   ├── deploy/ ── PRODUCTION, standalone (not an overlay on the dev file)
│   │     compose.prod.yml: images ghahremani-bodystyle-{server,web}:${APP_VERSION}, no ports/build, networks default+edge, hardening block,
│   │       only `server` loads .env; web gets API_INTERNAL_URL + REVALIDATE_SECRET; mongo with root auth, volumes mongo-data + uploads-data
│   │     Caddyfile: http://api.<domain> → server:4000 · http://<domain>, www → web:3000 (TLS at Arvan CDN)
│   │     .env.prod.example: template for /opt/ghahremani-bodystyle/.env on the VPS (placeholders = `change-me`, deploy.sh refuses them)
│   ├── .github/workflows/ ── ci.yml (make lint, test, build) · release.yml (tag vX.Y.Z → make ship + make deploy)
│   ├── .env.example ── PROJECT_SLOT + dev-stack secrets (JWT_*, REVALIDATE_SECRET, TICKET_TOKEN_SECRET, IP_HASH_SALT)
│   └── README.md ── features, run instructions, make vocabulary, slot rule, seed accounts
│
├── server/  ── Express 5 + Mongoose 9 + Yup + JWT + bcryptjs + multer + sharp + express-rate-limit, TS 6 (nodenext → CJS)
│   ├── scripts: dev (tsx watch) · build (tsc→dist) · start · seed (src/db/seed/index.ts) · typecheck · lint
│   ├── app.ts (order matters): trust proxy (TRUST_PROXY_HOPS) → helmet (CSP relaxed for Swagger, CORP cross-origin) → cors(allow-list)
│   │     → json(1mb) → compression → pino-http (always on) → static /uploads (dotfiles deny, no index, immutable 30d)
│   │     → swagger /docs (only if config.docsEnabled) → routes → notFound → errorHandler
│   ├── routes.ts ── /health · /health/ready (Mongo ping, 503) · /auth · /admin/{users,media,settings,pages,catalog,tickets,dashboard} · /public/{site,pages,catalog,tickets,sitemap}
│   ├── config/env.ts ── Yup-validated env; prod refuses weak secrets and a missing/`*` CORS_ORIGIN; seed accounts have dev-only defaults;
│   │                    `config` = {logLevel, docsEnabled (default !prod), trustProxyHops, jwt, passwordMinLength, ticketTokenSecret,
│   │                    ipHashSalt, revalidate{url,secret}, uploads{dir,maxBytes}, defaultLocale, seedDeveloper, seedAdmin}
│   ├── core/
│   │   ├── auth/permissions.ts ── ADMIN_ROLES developer|admin · PERMISSIONS (13 keys) · hasPermission (developer = all;
│   │   │                          tickets.write ⇒ tickets.read) · normalizePermissions   ← MIRRORED in client/src/lib/auth/permissions.ts
│   │   ├── errors/ApiError.ts ── codes: VALIDATION_ERROR BAD_REQUEST NOT_AUTHENTICATED EXPIRED_TOKEN INVALID_CREDENTIALS FORBIDDEN
│   │   │                         NOT_FOUND CONFLICT PAYLOAD_TOO_LARGE RATE_LIMITED INTERNAL_ERROR (+ TOKEN_* from tickets)
│   │   ├── middleware/ requireAuth (claims sub/email/role/permissions → req.admin) · requireRole('developer') ·
│   │   │              requirePermission(key | req=>key) · rateLimit (login 10, refresh 60, ticket 5, token 30 per 15 min) ·
│   │   │              validate(schema,'body'|'params') (stripUnknown; NOT for req.query) · errorHandler (ApiError, 11000→409,
│   │   │              body-parser 400/413, multer 400, http-errors status passthrough, mongoose 400) · notFound · asyncHandler
│   │   ├── i18n/ types (SUPPORTED_LOCALES fa|en ← mirrored in client i18n/routing.ts) · localized (Map schema helper,
│   │   │         mapToObject, resolveLocalized, cleanLocalized, defaultLocale) · validation (localizedString({required,max,optional}),
│   │   │         hrefSchema, imageUrlSchema, iconNameSchema — empty strings allowed for optionals)
│   │   ├── locale.ts ── localeFromRequest(?locale=)
│   │   ├── logger.ts ── pino `logger` + `httpLogger` (pino-http; no headers logged, /health* skipped; pino-pretty in dev only)
│   │   ├── revalidate/ ── triggerRevalidate(tags) → POST {REVALIDATE_URL}/api/revalidate (bearer secret, 2s, fire-and-forget)
│   │   ├── storage/ ── StorageDriver {put, remove}; localDiskDriver (UPLOADS_DIR, safe-key regex, no traversal)
│   │   └── pagination/ ── DEFAULT 50 / MAX 100 · hasPaginationParams · parsePagination · buildPaginatedResponse
│   ├── docs/ common.ts (helpers, shared schemas/responses) · paths/{auth,users,settings,pages,catalog,media,tickets}.ts (health probes are not documented) · openapi.ts (merge)
│   ├── db/seed/ index → accounts (developer + limited admin; migrates superadmin→developer) → settings → pages (3 pages, 20 sections, fa+en)
│   │            → catalog ("products" type: 7 specs, 3 categories, 10 items, 1 draft) → tickets (6, mixed sources). Idempotent per collection.
│   └── modules/<name>/  (model · interface.payload · interface.response · adapter.modelToResponse · validation · service · controller · routes)
│       ├── auth/      Admin {email, passwordHash, displayName, role, permissions[], isActive}; RefreshToken {tokenHash, jti, expiresAt TTL, revokedAt, replacedByJti}
│       │              POST /auth/login [loginLimiter] · /auth/refresh (rotate; reuse ⇒ revoke all) · /auth/logout · GET /auth/me (DB) · POST /auth/password
│       ├── users/     /admin/users CRUD — developer only; guards: not self, keep one active developer; password change revokes sessions
│       ├── settings/  singleton {siteName L, slogan L, logos, enabledLocales, navbar[], footer{quickLinks[], text L, copyright L}, contactWays[], seo}
│       │              GET /admin/settings · PATCH /admin/settings/{branding,navigation,contact,seo} [settings.*] · /locales [developer]
│       │              GET /public/site?locale (resolved + enabledPages) — in-memory cache, revalidates tag `settings`
│       ├── pages/     Page {key landing|about|contact|catalog, enabled, seo, sections[{id,key,type,enabled,order,props Mixed}]}
│       │              sections.types.ts (SECTION_TYPES ×17, ALLOWED_ON_PAGE) · sections.registry.ts (Yup props schema per type, defaultSectionProps)
│       │              GET /admin/pages · GET/PATCH /admin/pages/:key [pages.<key>] · PATCH :key/enabled, POST :key/sections, DELETE …/:sectionId [developer]
│       │              PATCH …/sections/:id (enabled, props) · PATCH …/sections/reorder · GET /public/pages/:key?locale (404 if disabled;
│       │              props deep-resolved; catalogHighlights hydrated with card items + cardDesign) — tag `page:<key>`
│       ├── catalog/   CatalogType {slug, name L, specDefinitions[{key,label L,type,unit L,currency,options[],filterable,showOnCard,showOnDetail,required}],
│       │              cardDesign{variant,imageRatio,showSummary,cardSpecKeys≤4,badgeSpecKey,priceSpecKey}, filterConfig{categoriesEnabled,searchEnabled,enabledFilterKeys,sortKeys}}
│       │              CatalogCategory {typeId, slug, name L} · CatalogItem {typeId, slug, title/summary/description L, coverImage, images[], categoryIds[], specs, featured, status, seo}
│       │              catalog.specs.ts: slugify (unicode) · validateSpecs (coerce by def.type, required) · buildSpecFilter (WHITELIST) · buildSort · buildSearch
│       │              /admin/catalog/types [developer] · /categories [catalog.categories] · /items [catalog.items] (+ /items/:id/status)
│       │              /public/catalog/types · /types/:slug (categories, filters, sortSpecs, cardDesign) · /types/:slug/items?category&q&sort&spec.<k>[.min|.max]
│       │              · /types/:slug/items/:itemSlug — tags catalog:types, catalog:type:<slug>, catalog:items, catalog:item:<slug>
│       ├── media/     Media {key,url,thumbKey,thumbUrl,mime,width,height,size,alt L}; POST /admin/media (multer memory → sharp meta check →
│       │              ≤2400px webp q82 + 480px thumb) [media] · GET list (any session) · PATCH alt · DELETE [media]
│       ├── tickets/   Ticket {name, phone(normalized), message, locale, status new|inProgress|closed, adminNote, source{page,section,itemId,itemSlug,itemTitle,path}, meta{ipHash,userAgent}}
│       │              TicketNonce {nonce unique, expiresAt TTL} · tickets.token.ts issueToken/consumeToken (HMAC, 3s–1h, single-use)
│       │              GET /public/tickets/token [tokenLimiter] · POST /public/tickets [ticketLimiter] (honeypot `website` ⇒ fake 201)
│       │              /admin/tickets [tickets.read | tickets.write] · GET /admin/dashboard (counts)
│       └── sitemap/   GET /public/sitemap → {enabledLocales, pages, types, items}
│
├── client/  ── Next.js 16 App Router + React 19 + next-intl 4 + TanStack Query 5 + axios + Formik/Yup + Tailwind 4 + DaisyUI 5 + lucide-react
│   ├── proxy.ts ── next-intl createMiddleware(routing); matcher skips api/_next/files
│   ├── next.config.ts ── createNextIntlPlugin · rewrites /uploads/* → API_INTERNAL_URL (same-origin images) · security headers · standalone
│   ├── i18n/ routing.ts (SUPPORTED_LOCALES, DEFAULT_LOCALE from NEXT_PUBLIC_DEFAULT_LOCALE, as-needed, localeDetection:false) · request.ts · navigation.ts
│   ├── messages/{fa,en}.json ── static UI strings (common, nav, theme, locale, footer, ticket, catalog, sections, validation, admin.*)
│   ├── globals.css ── DESIGN SYSTEM: :root primitives (--gray-*, --brand-*) → @theme semantic tokens (canvas/surface/ink/line/brand/ring/status)
│   │                  → fluid type scale, radius/shadow/motion, section rhythm, containers, breakpoints xs/3xl/4xl → [data-theme=dark] remap
│   │                  → DaisyUI light/dark themes mapped to tokens → utilities (bg-pattern-*, card-hover, icon-hover, icon-tile, link-underline, prose-plain, skip-link)
│   ├── app/
│   │   ├── [locale]/layout.tsx ── ROOT layout: validates locale, <html lang dir>, local fonts (Vazirmatn/Inter), theme init script,
│   │   │                          NextIntlClientProvider > QueryProvider > NotificationProvider; generateMetadata from /public/site; force-dynamic
│   │   ├── [locale]/(public)/ layout (SiteHeader/SiteFooter from getPublicSite; disabled locale ⇒ 404; Organization JSON-LD) ·
│   │   │        page (landing) · about · contact (all = getPublicPage → SectionRenderer; metadata + hreflang via lib/seo) ·
│   │   │        catalog/ (types index, redirect if one) · catalog/[typeSlug] (filters + grid + pagination from searchParams) ·
│   │   │        catalog/[typeSlug]/[itemSlug] (gallery, spec table, Product JSON-LD, TicketForm source=catalogItem) · [...rest] + not-found
│   │   ├── [locale]/(admin)/admin/ layout (metadata noindex + AdminProviders/AuthProvider) · (auth)/login · (panel)/layout (AdminShell guard)
│   │   │        (panel)/: page (dashboard counts) · tickets, tickets/[id] · pages, pages/[pageKey] · catalog/{types, types/[id], categories, items, items/[id]}
│   │   │        · media · settings/{branding,navigation,contact,seo,locales} · users · account
│   │   ├── api/revalidate/route.ts ── bearer REVALIDATE_SECRET → revalidateTag(tag, { expire: 0 })
│   │   ├── api/health/route.ts ── liveness for the compose healthcheck
│   │   ├── sitemap.ts (force-dynamic, from /public/sitemap, hreflang alternates) · robots.ts (disallow /admin, /*/admin, /api)
│   │   └── _service/<module>/ ── DATA LAYER per server module (auth, users, settings, pages, catalog, media, tickets) — see _service/README.md
│   ├── lib/ axiosInstance (api.get/post/patch/put/delete/postFormData; 401 → refresh once, except login/refresh) · api/{errors,handleApiError,applyFormikValidationErrors}
│   │        · server/publicApi.ts (server-only publicFetch with tags/revalidate, 404 → notFound) · auth/{authService,permissions} · i18n/{locales,types,params}
│   │        · seo.ts (SITE_URL, localizedPath, alternatesFor) · fonts.ts · notification · pagination · QueryProvider
│   ├── context/AuthContext.tsx ── token state (localStorage), silent refresh, cross-tab sync, `me` (GET /auth/me), can(), isDeveloper, logout → POST /auth/logout
│   ├── features/
│   │   ├── site/ types (PublicSite, PageKey, ContactWayType) · getPublicSite (fallback chrome if API down) · getPublicPage · contactWays (safe hrefs) · navigation (hide disabled pages)
│   │   ├── sections/ types.ts (SectionPropsByType<T> generic over string|LocalizedString, SECTION_TYPES) · registry.tsx (PUBLIC_SECTION_COMPONENTS, SectionRenderer)
│   │   │             · public/*.tsx (17 renderers) · fieldSpecs.ts (declarative editor spec per type) · admin/SectionPropsForm.tsx (renders any spec)
│   │   ├── catalog/ types · formatSpec (Intl, units, yes/no) · getPublicCatalog (tags) · CatalogCard (4 variants, hook-free) · CatalogGrid · CatalogFilters (URL state)
│   │   │            · CatalogPagination · ItemGallery · SpecTable · CatalogHighlightsGrid
│   │   ├── tickets/TicketForm.tsx ── token on mount, min-age wait, honeypot, one transparent retry on TOKEN_* errors
│   │   └── admin/ AdminShell/Sidebar/Topbar · adminNav.ts (permission-filtered) · Can/RequirePermission · LocalesContext · LoginForm · AdminDashboard · AccountScreen
│   │              · ui/ (PageHeader, Drawer, ConfirmDialog, fields.tsx FormText/TextArea/Select/Toggle, StatusBadge, EmptyState)
│   │              · fields/ (LocalizedTextInput tabs, IconPicker, ImageField + MediaPickerModal, SortableList)
│   │              · users/ (UsersScreen, UserForm, PermissionMatrix) · settings/ (tabs + 5 forms) · pages/ (PagesScreen, PageEditorScreen)
│   │              · catalog/ (TypesScreen, TypeEditorScreen w/ live card preview, CategoriesScreen, ItemsScreen, ItemEditorScreen, DynamicSpecField) · media/ · tickets/
│   └── shared/ UI (IconByName whitelist, Container, SectionShell, SmartImage, Cta, Paragraphs, Button, Card, Loading, ModalWrapper, Pagination, FormInputs)
│              · layout/public (SiteHeader, SiteFooter, SiteLogo, NavLinks, MobileNav, LocaleSwitcher, ThemeToggle) · hooks (useTheme, usePagination, …)
│
└── THE CONTRACT (server ⇄ client must agree)
    ├── Errors: { error: { code, message, details?: [{field, code, message}] } } + real HTTP status; details[].field == Formik path (props.* prefix stripped in section editor)
    ├── Auth: access JWT {sub,email,role,permissions} + rotating refresh JWT; 401 EXPIRED_TOKEN|NOT_AUTHENTICATED ⇒ refresh-or-logout (never on /auth/login)
    ├── Locales: SUPPORTED_LOCALES identical in both packages; default locale = server DEFAULT_LOCALE == client NEXT_PUBLIC_DEFAULT_LOCALE
    ├── LocalizedString: admin ⇄ full maps; public ⇒ resolved strings (?locale=); empty map == not translated
    ├── Section types / props: sections.types.ts + sections.registry.ts (server) == features/sections/types.ts + fieldSpecs.ts (client)
    ├── Permissions: core/auth/permissions.ts == lib/auth/permissions.ts; server enforces, client only hides
    ├── Cache tags: settings · page:<key> · catalog:types · catalog:type:<slug> · catalog:items · catalog:item:<slug> (server triggers, publicFetch consumes)
    ├── Pagination: ?limit=&offset= → { data, total, limit, offset, total_pages }
    └── IDs: Mongo ObjectId as string `id`; media/image URLs are `/uploads/...` (web app proxies them) or `/img/...` (Next public) or https://
```

---

## Key flows

**Public page render** — `(public)/page.tsx` → `getPublicPage('landing', locale)` → `publicFetch` (`API_INTERNAL_URL/public/pages/landing?locale=fa`, tags `page:landing`,`settings`, revalidate 300) → `SectionRenderer` maps `section.type` → `PUBLIC_SECTION_COMPONENTS` (server components) → `SectionShell`/tokens. `getPublicSite` feeds header/footer/metadata; if the API is down it falls back to a minimal chrome instead of crashing.

**Content write → live site** — admin mutation → `PATCH /admin/...` → service saves → `triggerRevalidate(['page:landing', …])` → `POST web/api/revalidate` (bearer) → `revalidateTag(tag, { expire: 0 })` → next request re-fetches. Without the secret/URL the pages still expire on their own (`revalidate`).

**Permission check** — `requireAuth` decodes the access token → `requirePermission('catalog.items')` or `requirePermission(req => \`pages.${req.params.key}\`)`; developers bypass. Client: `AuthContext.can()` (from `/auth/me`, token claims while loading) → `Sidebar`/`Can`/`RequirePermission` hide or show. Changing an account's permissions applies after its next token refresh (≤15 min).

**Ticket submission** — form mounts → `GET /public/tickets/token` → user fills → client waits until `issuedAt + minDelayMs` → `POST /public/tickets` {…, token, website:'' , source{page,section,itemId,path}} → server: rate limit → Yup → honeypot? fake 201 → `consumeToken` (HMAC, age 3s–1h, nonce insert; dup ⇒ TOKEN_USED) → item title snapshot → save with `ipHash`. A TOKEN_* error triggers one silent token refresh + retry.

**Catalog listing** — `/catalog/[typeSlug]?category=pumps&spec.brand=siemens,abb&spec.price.min=1e6&sort=price:desc&q=…` → `pickListingParams` forwards only listing keys → API `buildSpecFilter` walks **spec definitions** (filterable ∧ enabledFilterKeys) and coerces by type; unknown/injected keys are ignored; `sort` ⊆ built-ins + sortKeys. Cards are shaped by `cardDesign` (server picks badge/price/cardSpecs; client `CatalogCard` lays them out).

**Section editing** — `PageEditorScreen` → Drawer → `SectionPropsForm` renders `SECTION_FIELD_SPECS[type]` (localized/text/number/boolean/image/icon/select/cta/group/list) → `PATCH /admin/pages/:key/sections/:id {props}` → server validates against `SECTION_PROPS_SCHEMAS[type]` → details `props.items[0].title` mapped back to the form.

---

## Recipes

- **New section type:** server `sections.types.ts` (+ALLOWED_ON_PAGE) & `sections.registry.ts`; client `features/sections/types.ts`, `public/<Type>.tsx`, `registry.tsx`, `fieldSpecs.ts`, `messages/*.json` (`admin.sections.types|descriptions|fields`).
- **New spec type:** server `catalog.types.ts` SPEC_TYPES + `validateSpecs`/`buildSpecFilter`; client `features/catalog/types.ts`, `formatSpec.ts`, `CatalogFilters` renderer, `DynamicSpecField`.
- **New permission:** both `permissions.ts` files + `messages admin.permissionLabels` (dots → underscores) + guard routes + `adminNav`/`Can`.
- **New locale:** `SUPPORTED_LOCALES` (both), `messages/<code>.json`, `lib/i18n/locales.ts` meta (dir, font, bcp47), enable in Settings → Languages.
- **Re-skin:** edit the primitives block in `globals.css` (`--brand-*`, `--gray-*`); everything else derives.
- **New admin resource:** copy `server/src/modules/tickets` + `client/src/app/_service/tickets` + a screen in `features/admin/<area>` + `adminNav` entry.

---

## Gotchas (verified 2026-09-30)

- **Mongoose Map:** localized fields serialize to `{}` with `JSON.stringify` — always go through `mapToObject`/`resolveLocalized`. Section `props` are `Mixed` → call `markModified('sections')` (services do).
- **Yup object defaults:** a nested `Yup.object()` builds itself from field defaults, so PATCH schemas use `localizedString({ optional: true })` and `.default(undefined)` on nested objects; otherwise a partial update wipes untouched fields. `Yup.object()` with no shape + `stripUnknown` strips *everything* — section `props` is `Yup.mixed()` at the route level.
- **`matches` rejects `''`:** optional URL/icon patterns use `excludeEmptyString: true`.
- **Next 16:** middleware is `src/proxy.ts`; `revalidateTag` needs a profile — use `{ expire: 0 }` ('max' serves stale once). Routes under `[locale]` are dynamic (no `generateStaticParams`); `sitemap.ts` is `force-dynamic` because the API is unreachable at build time. `NEXT_PUBLIC_*` and `API_INTERNAL_URL` (rewrites) are baked at build.
- **next-intl:** dots in message keys nest — permission labels are stored as `catalog_items`. `localeDetection: false` — the URL is the only source of locale. Only `Link`/`useRouter`/`usePathname` from `i18n/navigation`.
- **Data Cache staleness:** after changing an API response shape, invalidate tags (`POST /api/revalidate`) or restart `next start`; cached entries survive API restarts.
- **Rate limiters are in-memory per process** (login 10, tickets 5 / 15 min per IP): restarting the API resets them; multi-instance deployments need a shared store.
- **Tailwind 4 transforms:** `translate-x-*` sets the `translate` property, not `transform` (matters for tests/measurements). `dark:` is a custom variant on `[data-theme='dark']`.
- **DaisyUI tokens:** never define `--color-primary/accent/neutral/base-*` in `@theme`; the two DaisyUI themes are mapped onto our semantic tokens.
- **Formik checkbox:** `useField({ type: 'checkbox' })` exposes the boolean as `checked`, not `value`.
- **Media URLs** are relative `/uploads/...`; the web app rewrites them to the API (`API_INTERNAL_URL`) so `next/image` and CSP stay same-origin. Deleting a media row does not clear references in content (pages/items show a placeholder).
- **Legacy:** old `superadmin` accounts are migrated to `developer` by the seed. The `dummy` sample module is gone; `tickets` is the reference module.
- **Docker:** web image builds without the API (`force-dynamic`), needs `NEXT_PUBLIC_*` build args (`ARGS_web` in the Makefile for prod — one image per domain); `npm ci --ignore-scripts` (husky `prepare` needs `.git`); runtime sets `HOSTNAME=0.0.0.0` or the standalone server binds to the container hostname only. Server image creates `/app/uploads` (mount `uploads-data`).
- **Ports:** nothing listens on 4000/3000/27017 on the host any more — they are container ports. Host ports come from `PROJECT_SLOT`; use `make dev-api` / `make dev-web` for native servers.
- **Deploy:** `make build` is safe, `make ship` changes the VPS image store, `make deploy` changes production — never without the user's explicit go. Seeding is manual (`make seed-prod`), nothing seeds or migrates on container start. Uploads live in the `uploads-data` volume and are NOT in the nightly backup (Mongo only). Behind the CDN the API sees CDN edge IPs until `trusted_proxies` (deploy/Caddyfile) + `TRUST_PROXY_HOPS=2` are set — rate limits are per IP.
- **Hardening still open (documented, not done):** tokens in localStorage (not httpOnly cookies); access-token claims are trusted for their lifetime (deactivation is enforced at refresh); no CSRF needed (bearer auth); no automated tests.

---

## Verification checklist (what was run)

```bash
# server & client
npm run lint && npm run typecheck && npm run build     # server
npm run lint && npm run build                          # client
# infra: make doctor && make up && make seed && make test && make lint && make build VERSION=test && make down
#   + deploy/compose.prod.yml rehearsed locally behind Caddy (health, seed, login, upload, CORS, mongo auth, mongodump)
# API (curl): login/refresh rotation + reuse revoke, 429 on login, 403 by role/permission, partial PATCHes keep data,
#   uploads (real png → webp, fake png → 400, /uploads/../ → 403/404), section add/toggle/reorder/delete, filter whitelist
#   (`spec.hack`, `sort=passwordHash` ignored), drafts hidden, ticket token too-early/used/invalid, honeypot fake 201, 5/15min limit
# Browser (Puppeteer): / fa RTL, /en LTR, /de → 404, admin login, sidebar per role, users/settings/pages/catalog/tickets screens,
#   section toggle → public page updates immediately, catalog filter chips, item page, public ticket → inbox
# SEO: robots.txt, sitemap.xml (locales × pages/types/items), hreflang + canonical, Organization/Product JSON-LD
```
