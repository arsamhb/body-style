import { Router } from 'express';
import { asyncHandler } from '../../core/middleware/asyncHandler';
import { CatalogItem } from '../catalog/catalogItem.model';
import { CatalogType } from '../catalog/catalogType.model';
import { Page } from '../pages/pages.model';
import { PAGE_KEYS, PageKey } from '../pages/sections.types';
import { getSettings } from '../settings/settings.service';
import { enabledLocalesOf } from '../settings/adapter.modelToResponse';

const PAGE_PATHS: Record<PageKey, string> = {
  landing: '/',
  about: '/about',
  contact: '/contact',
  catalog: '/catalog',
};

/** GET /public/sitemap — everything the web app should list in sitemap.xml. */
const router = Router();
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [settings, pages, types, items] = await Promise.all([
      getSettings(),
      Page.find().select('key enabled updatedAt').lean(),
      CatalogType.find({ enabled: true }).select('slug updatedAt').lean(),
      CatalogItem.find({ status: 'published' })
        .select('slug typeId updatedAt')
        .lean(),
    ]);
    const disabled = new Set(pages.filter((p) => !p.enabled).map((p) => p.key));
    const pageUpdated = new Map(pages.map((p) => [p.key, p.updatedAt]));
    const typeSlug = new Map(types.map((t) => [String(t._id), t.slug]));
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json({
      enabledLocales: enabledLocalesOf(settings),
      pages: PAGE_KEYS.filter((k) => !disabled.has(k)).map((k) => ({
        key: k,
        path: PAGE_PATHS[k],
        updatedAt: (pageUpdated.get(k) ?? settings.updatedAt).toISOString(),
      })),
      types: types.map((t) => ({
        slug: t.slug,
        updatedAt: t.updatedAt.toISOString(),
      })),
      items: items
        .filter((i) => typeSlug.has(String(i.typeId)))
        .map((i) => ({
          typeSlug: typeSlug.get(String(i.typeId)),
          slug: i.slug,
          updatedAt: i.updatedAt.toISOString(),
        })),
    });
  }),
);

export default router;
