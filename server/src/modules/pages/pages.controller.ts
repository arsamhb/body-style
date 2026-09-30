import { RequestHandler } from 'express';
import { ApiError } from '../../core/errors/ApiError';
import { localeFromRequest } from '../../core/locale';
import * as pagesService from './pages.service';
import {
  pageModel2PageAdminReadResponse,
  pageModel2PageAdminSummaryResponse,
  pageModel2PagePublicReadResponse,
} from './adapter.modelToResponse';
import { isPageKey, PageKey } from './sections.types';
import { getHighlightItems } from '../catalog/catalog.service';
import { catalogItemModel2CatalogItemCardResponse } from '../catalog/adapter.modelToResponse';

const pageKey = (raw: unknown): PageKey => {
  if (!isPageKey(raw)) throw ApiError.notFound('Page not found');
  return raw;
};

export const list: RequestHandler = async (_req, res) => {
  const pages = await pagesService.listPages();
  res.json(pages.map(pageModel2PageAdminSummaryResponse));
};

export const read: RequestHandler = async (req, res) => {
  res.json(
    pageModel2PageAdminReadResponse(
      await pagesService.getPage(pageKey(req.params.key)),
    ),
  );
};

export const updateSeo: RequestHandler = async (req, res) => {
  res.json(
    pageModel2PageAdminReadResponse(
      await pagesService.updateSeo(pageKey(req.params.key), req.body),
    ),
  );
};

export const setEnabled: RequestHandler = async (req, res) => {
  res.json(
    pageModel2PageAdminReadResponse(
      await pagesService.setEnabled(pageKey(req.params.key), req.body),
    ),
  );
};

export const addSection: RequestHandler = async (req, res) => {
  const { page, sectionId } = await pagesService.addSection(
    pageKey(req.params.key),
    req.body,
  );
  res.status(201).json({
    ...pageModel2PageAdminReadResponse(page),
    createdSectionId: sectionId,
  });
};

export const updateSection: RequestHandler = async (req, res) => {
  res.json(
    pageModel2PageAdminReadResponse(
      await pagesService.updateSection(
        pageKey(req.params.key),
        String(req.params.sectionId),
        req.body,
      ),
    ),
  );
};

export const reorderSections: RequestHandler = async (req, res) => {
  res.json(
    pageModel2PageAdminReadResponse(
      await pagesService.reorderSections(pageKey(req.params.key), req.body),
    ),
  );
};

export const removeSection: RequestHandler = async (req, res) => {
  res.json(
    pageModel2PageAdminReadResponse(
      await pagesService.removeSection(
        pageKey(req.params.key),
        String(req.params.sectionId),
      ),
    ),
  );
};

export const readPublic: RequestHandler = async (req, res) => {
  const locale = localeFromRequest(req);
  const page = await pagesService.getPublishedPage(pageKey(req.params.key));
  const body = pageModel2PagePublicReadResponse(page, locale);
  // Hydrate catalog highlight sections with real published items (card shape).
  for (const section of body.sections) {
    if (section.type !== 'catalogHighlights') continue;
    const result = await getHighlightItems(
      section.props as Parameters<typeof getHighlightItems>[0],
    );
    section.props.items = result
      ? result.items.map((i) =>
          catalogItemModel2CatalogItemCardResponse(
            i,
            result.type,
            result.categories,
            locale,
          ),
        )
      : [];
    section.props.cardDesign = result ? result.type.cardDesign : undefined;
    section.props.typeHref = result
      ? `/catalog/${result.type.slug}`
      : '/catalog';
  }
  res.setHeader(
    'Cache-Control',
    'public, max-age=60, stale-while-revalidate=300',
  );
  res.json(body);
};
