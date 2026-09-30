import { randomUUID } from 'node:crypto';
import * as Yup from 'yup';
import { ApiError } from '../../core/errors/ApiError';
import { cleanLocalized } from '../../core/i18n/localized';
import { triggerRevalidate } from '../../core/revalidate';
import {
  PageEnabledUpdatePayload,
  PageSeoUpdatePayload,
  SectionCreatePayload,
  SectionUpdatePayload,
  SectionsReorderPayload,
} from './interface.payload';
import { Page, PageDocument } from './pages.model';
import { defaultSectionProps, validateSectionProps } from './sections.registry';
import {
  ALLOWED_ON_PAGE,
  PAGE_KEYS,
  PageKey,
  SectionBase,
} from './sections.types';

const getOrCreate = async (key: PageKey): Promise<PageDocument> =>
  Page.findOneAndUpdate(
    { key },
    { $setOnInsert: { key, enabled: true, sections: [] } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

const persist = async (page: PageDocument): Promise<PageDocument> => {
  page.markModified('sections');
  await page.save();
  triggerRevalidate([`page:${page.key}`, 'settings']);
  return page;
};

const findSection = (page: PageDocument, id: string): SectionBase => {
  const section = page.sections.find((s) => s.id === id);
  if (!section) throw ApiError.notFound('Section not found');
  return section;
};

/** Turns a Yup error on `props` into the API envelope with `props.<path>` field names. */
const validateProps = async (type: SectionBase['type'], props: unknown) => {
  try {
    return await validateSectionProps(type, props);
  } catch (e) {
    if (e instanceof Yup.ValidationError) {
      const source = e.inner.length ? e.inner : [e];
      throw ApiError.validation(
        source.map((err) => ({
          field: err.path ? `props.${err.path}` : 'props',
          code: err.type ?? 'invalid',
          message: err.message,
        })),
      );
    }
    throw e;
  }
};

export const listPages = async (): Promise<PageDocument[]> => {
  const pages = await Promise.all(PAGE_KEYS.map(getOrCreate));
  return pages;
};

export const listEnabledPageKeys = async (): Promise<string[]> => {
  const pages = await Page.find({ enabled: true }).select('key').lean();
  const keys = new Set(pages.map((p) => p.key));
  // Pages that were never created yet count as enabled.
  const existing = new Set(
    (await Page.find().select('key').lean()).map((p) => p.key),
  );
  return PAGE_KEYS.filter((k) => keys.has(k) || !existing.has(k));
};

export const getPage = (key: PageKey) => getOrCreate(key);

export const getPublishedPage = async (key: PageKey): Promise<PageDocument> => {
  const page = await getOrCreate(key);
  if (!page.enabled) throw ApiError.notFound('Page is disabled');
  return page;
};

export const updateSeo = async (
  key: PageKey,
  payload: PageSeoUpdatePayload,
) => {
  const page = await getOrCreate(key);
  if (payload.title !== undefined)
    page.seo.title = new Map(Object.entries(cleanLocalized(payload.title)));
  if (payload.description !== undefined)
    page.seo.description = new Map(
      Object.entries(cleanLocalized(payload.description)),
    );
  if (payload.ogImageUrl !== undefined)
    page.seo.ogImageUrl = payload.ogImageUrl;
  page.markModified('seo');
  return persist(page);
};

export const setEnabled = async (
  key: PageKey,
  { enabled }: PageEnabledUpdatePayload,
) => {
  const page = await getOrCreate(key);
  page.enabled = enabled;
  return persist(page);
};

export const addSection = async (
  key: PageKey,
  payload: SectionCreatePayload,
) => {
  const page = await getOrCreate(key);
  if (!ALLOWED_ON_PAGE[key].includes(payload.type)) {
    throw ApiError.validation([
      {
        field: 'type',
        code: 'not-allowed',
        message: `Section "${payload.type}" is not allowed on "${key}"`,
      },
    ]);
  }
  // A freshly added section starts empty (the editor asks for required text on the first save);
  // when props are supplied they are validated in full.
  const props = payload.props
    ? await validateProps(payload.type, {
        ...defaultSectionProps(payload.type),
        ...payload.props,
      })
    : defaultSectionProps(payload.type);
  const id = randomUUID();
  const sectionKey =
    payload.key ?? `${key}-${payload.type.toLowerCase()}-${id.slice(0, 4)}`;
  if (page.sections.some((s) => s.key === sectionKey))
    throw ApiError.conflict('Section key already exists on this page');
  page.sections.push({
    id,
    key: sectionKey,
    type: payload.type,
    enabled: true,
    order: page.sections.length,
    props: props as Record<string, unknown>,
  });
  await persist(page);
  return { page, sectionId: id };
};

export const updateSection = async (
  key: PageKey,
  sectionId: string,
  payload: SectionUpdatePayload,
) => {
  const page = await getOrCreate(key);
  const section = findSection(page, sectionId);
  if (payload.enabled !== undefined) section.enabled = payload.enabled;
  if (payload.key !== undefined) {
    if (
      page.sections.some((s) => s.id !== sectionId && s.key === payload.key)
    ) {
      throw ApiError.conflict('Section key already exists on this page');
    }
    section.key = payload.key;
  }
  if (payload.props !== undefined) {
    section.props = (await validateProps(
      section.type,
      payload.props,
    )) as Record<string, unknown>;
  }
  return persist(page);
};

export const reorderSections = async (
  key: PageKey,
  { orderedIds }: SectionsReorderPayload,
) => {
  const page = await getOrCreate(key);
  const ids = new Set(page.sections.map((s) => s.id));
  if (
    orderedIds.length !== ids.size ||
    !orderedIds.every((id) => ids.has(id))
  ) {
    throw ApiError.validation([
      {
        field: 'orderedIds',
        code: 'mismatch',
        message: 'orderedIds must contain every section id exactly once',
      },
    ]);
  }
  page.sections.forEach((s) => {
    s.order = orderedIds.indexOf(s.id);
  });
  return persist(page);
};

export const removeSection = async (key: PageKey, sectionId: string) => {
  const page = await getOrCreate(key);
  findSection(page, sectionId);
  page.sections = page.sections.filter((s) => s.id !== sectionId);
  page.sections
    .sort((a, b) => a.order - b.order)
    .forEach((s, i) => {
      s.order = i;
    });
  return persist(page);
};
