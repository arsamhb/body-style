# Client — Next.js 16 (public site + admin panel)

React 19, App Router, next-intl, TanStack Query, Formik + Yup, Tailwind 4 (+ DaisyUI for the panel).

## Routes

```
src/app/[locale]/
├─ layout.tsx                 <html lang dir> + fonts + providers (root layout)
├─ (public)/                  server components; content from the API (publicFetch + cache tags)
│  ├─ page.tsx                landing            /            (fa)   /en
│  ├─ about/ contact/         sections pages
│  ├─ catalog/                types index → [typeSlug] listing+filters → [typeSlug]/[itemSlug]
│  └─ [...rest]/ not-found    locale-aware 404
├─ (admin)/admin/             client components behind AuthProvider, noindex
│  ├─ (auth)/login
│  └─ (panel)/                dashboard, tickets, pages/[pageKey], catalog/{types,categories,items}, media, settings/*, users, account
├─ api/revalidate/route.ts    called by the API after content writes
├─ sitemap.ts  robots.ts
src/proxy.ts                  next-intl locale routing (default locale unprefixed)
```

## Where things live

| Folder | Content |
| --- | --- |
| `src/i18n/` | `routing.ts` (**SUPPORTED_LOCALES**, `localePrefix: 'as-needed'`, no browser detection), `navigation.ts` (`Link`, `useRouter`, … always use these) |
| `messages/{fa,en}.json` | static UI strings (`next-intl`); dots in keys mean nesting |
| `src/lib/` | `axiosInstance` (`api.get/post/…` helpers + refresh interceptor), `server/publicApi.ts` (server-side fetch with cache tags), `auth/permissions.ts` (mirror of the server list), `i18n/`, `seo.ts`, `fonts.ts` |
| `src/app/_service/<module>/` | data layer per server module — see `_service/README.md` |
| `src/features/sections/` | `types.ts` (section union), `fieldSpecs.ts` (editor spec), `registry.tsx` (type → public renderer), `public/*.tsx`, `admin/SectionPropsForm.tsx` |
| `src/features/catalog/` | `CatalogCard` (developer-designed card), filters, grid, gallery, spec table, formatting |
| `src/features/site/` | site chrome types + fetchers (`getPublicSite`, `getPublicPage`) |
| `src/features/tickets/` | the public request form |
| `src/features/admin/` | shell (sidebar, topbar), `Can`/`RequirePermission`, `LocalesContext`, field kit (`LocalizedTextInput`, `ImageField`, `IconPicker`, `SortableList`), screens per area |
| `src/shared/UI/` | `IconByName` (icon whitelist), `Container`, `SectionShell`, `SmartImage`, `Cta`, `Paragraphs`, form inputs |
| `src/shared/layout/public/` | `SiteHeader`, `SiteFooter`, `NavLinks`, `MobileNav`, `LocaleSwitcher`, `ThemeToggle` |

## Design system (`src/globals.css`)

1. **Primitives** (`:root`): `--gray-*`, `--brand-*`, status hues. **Re-skin = edit this block.**
2. **Semantic tokens** (`@theme`): `canvas`, `surface`, `ink`, `line`, `brand`, `ring`, `success/warning/danger`
   → utilities `bg-canvas`, `text-ink-muted`, `border-line`, `bg-brand`, …; dark mode remaps them under `[data-theme='dark']`.
3. **Scale**: fluid type (`text-display`, `text-h1…h4`, `text-lead`, `text-body`, `text-small`, `text-caption`), radii, shadows, motion, section rhythm (`section-py*`), containers (`container-content|wide|tv`), breakpoints `xs`, `3xl` (1920), `4xl` (2560).
4. **DaisyUI themes** `light`/`dark` are mapped onto the same tokens, so the panel follows the palette.
5. **Utilities**: `bg-pattern-dots|grid`, `bg-gradient-subtle`, `card-hover`, `icon-hover`, `icon-tile`, `link-underline`, `prose-plain`, `skip-link`.

RTL: use logical utilities only (`ms-`, `pe-`, `start-`, `text-start`); directional icons get `rtl:-scale-x-100` (the `Cta` component does this).

## Adding a section type

1. Server: add the type to `SECTION_TYPES`, its Yup schema in `sections.registry.ts`, and allow it per page in `ALLOWED_ON_PAGE`.
2. Client: add it to `SectionPropsByType` + `SECTION_TYPES` (`features/sections/types.ts`), write `public/<Type>.tsx`,
   register it in `registry.tsx`, describe its editor in `fieldSpecs.ts`, add labels in `messages/*.json` (`admin.sections.*`).

## Adding a language

Add the code to `SUPPORTED_LOCALES` (client `i18n/routing.ts` and server `core/i18n/types.ts`), add
`messages/<code>.json`, add its metadata in `lib/i18n/locales.ts` (direction, font), then enable it in
the panel under Settings → Languages.

## Environment

`NEXT_PUBLIC_BASE_URL` (browser → API), `API_INTERNAL_URL` (Next server → API, Docker hostname),
`NEXT_PUBLIC_SITE_URL` (canonical URL for metadata/sitemap), `NEXT_PUBLIC_DEFAULT_LOCALE`,
`REVALIDATE_SECRET` (shared with the API). `NEXT_PUBLIC_*` and `API_INTERNAL_URL` are inlined at build time.

```bash
npm run dev      # http://localhost:3000 (from the repo root: `make dev-web` runs it on the slot's ports)
npm run lint && npm run build
```
