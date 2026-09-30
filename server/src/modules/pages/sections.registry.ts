import * as Yup from 'yup';
import {
  hrefSchema,
  iconNameSchema,
  imageUrlSchema,
  localizedString,
} from '../../core/i18n/validation';
import { SectionType } from './sections.types';

const L = localizedString;
const noUnknown = <T extends Yup.AnyObject>(s: Yup.ObjectSchema<T>) =>
  s.noUnknown(true, 'Unknown fields are not allowed');

const cta = () =>
  noUnknown(
    Yup.object({
      label: L({ required: true, max: 60 }),
      href: hrefSchema.required('href is required'),
    }),
  )
    .default(undefined)
    .nullable();

const image = () =>
  imageUrlSchema
    .nullable()
    .transform((v) => (v === null ? '' : v))
    .default('');

/**
 * One Yup schema per section type. `PATCH …/sections/:id` validates `props` against the schema of
 * the section's stored `type`, so a section can never hold props of another type.
 */
export const SECTION_PROPS_SCHEMAS: Record<
  SectionType,
  Yup.ObjectSchema<Yup.AnyObject>
> = {
  hero: noUnknown(
    Yup.object({
      eyebrow: L({ max: 80 }),
      title: L({ required: true, max: 120 }),
      subtitle: L({ max: 300 }),
      primaryCta: cta(),
      secondaryCta: cta(),
      backgroundImage: image(),
      pattern: Yup.string()
        .oneOf(['dots', 'grid', 'gradient', 'none'])
        .default('dots'),
    }),
  ),
  intro: noUnknown(
    Yup.object({
      heading: L({ required: true, max: 120 }),
      body: L({ max: 4000 }),
      image: image(),
      imagePosition: Yup.string().oneOf(['start', 'end']).default('end'),
      cta: cta(),
    }),
  ),
  features: noUnknown(
    Yup.object({
      eyebrow: L({ max: 80 }),
      heading: L({ required: true, max: 120 }),
      text: L({ max: 300 }),
      items: Yup.array()
        .of(
          noUnknown(
            Yup.object({
              icon: iconNameSchema.default('sparkles'),
              title: L({ required: true, max: 80 }),
              text: L({ max: 300 }),
              href: hrefSchema
                .nullable()
                .transform((v) => (v === null ? '' : v))
                .default(''),
            }),
          ),
        )
        .max(12)
        .default([]),
    }),
  ),
  catalogHighlights: noUnknown(
    Yup.object({
      heading: L({ required: true, max: 120 }),
      text: L({ max: 300 }),
      typeSlug: Yup.string().max(80).default(''),
      mode: Yup.string().oneOf(['featured', 'manual']).default('featured'),
      itemIds: Yup.array()
        .of(Yup.string().max(64).required())
        .max(12)
        .default([]),
      limit: Yup.number().integer().min(1).max(12).default(4),
    }),
  ),
  samples: noUnknown(
    Yup.object({
      heading: L({ required: true, max: 120 }),
      text: L({ max: 300 }),
      items: Yup.array()
        .of(
          noUnknown(
            Yup.object({
              image: image(),
              title: L({ required: true, max: 80 }),
              text: L({ max: 300 }),
              href: hrefSchema
                .nullable()
                .transform((v) => (v === null ? '' : v))
                .default(''),
            }),
          ),
        )
        .max(12)
        .default([]),
    }),
  ),
  stats: noUnknown(
    Yup.object({
      items: Yup.array()
        .of(
          noUnknown(
            Yup.object({
              value: Yup.number().required().min(0).max(1e12),
              suffix: Yup.string().max(8).default(''),
              label: L({ required: true, max: 60 }),
              icon: iconNameSchema.default(''),
            }),
          ),
        )
        .max(8)
        .default([]),
    }),
  ),
  testimonials: noUnknown(
    Yup.object({
      heading: L({ required: true, max: 120 }),
      items: Yup.array()
        .of(
          noUnknown(
            Yup.object({
              quote: L({ required: true, max: 500 }),
              author: L({ required: true, max: 80 }),
              role: L({ max: 80 }),
              avatar: image(),
            }),
          ),
        )
        .max(12)
        .default([]),
    }),
  ),
  partners: noUnknown(
    Yup.object({
      heading: L({ max: 120 }),
      logos: Yup.array()
        .of(
          noUnknown(
            Yup.object({
              image: imageUrlSchema.required('image is required'),
              name: Yup.string().max(80).default(''),
              href: hrefSchema
                .nullable()
                .transform((v) => (v === null ? '' : v))
                .default(''),
            }),
          ),
        )
        .max(24)
        .default([]),
    }),
  ),
  ctaBanner: noUnknown(
    Yup.object({
      heading: L({ required: true, max: 120 }),
      text: L({ max: 300 }),
      cta: noUnknown(
        Yup.object({
          label: L({ required: true, max: 60 }),
          href: hrefSchema.required(),
        }),
      ),
    }),
  ),
  faq: noUnknown(
    Yup.object({
      heading: L({ required: true, max: 120 }),
      text: L({ max: 300 }),
      items: Yup.array()
        .of(
          noUnknown(
            Yup.object({
              question: L({ required: true, max: 200 }),
              answer: L({ required: true, max: 2000 }),
            }),
          ),
        )
        .max(30)
        .default([]),
    }),
  ),
  ticketForm: noUnknown(
    Yup.object({
      heading: L({ required: true, max: 120 }),
      text: L({ max: 400 }),
    }),
  ),
  aboutHero: noUnknown(
    Yup.object({
      image: image(),
      title: L({ required: true, max: 120 }),
      subtitle: L({ max: 300 }),
    }),
  ),
  missionVision: noUnknown(
    Yup.object({
      mission: noUnknown(
        Yup.object({
          title: L({ required: true, max: 80 }),
          text: L({ max: 1000 }),
        }),
      ),
      vision: noUnknown(
        Yup.object({
          title: L({ required: true, max: 80 }),
          text: L({ max: 1000 }),
        }),
      ),
      image: image(),
    }),
  ),
  achievements: noUnknown(
    Yup.object({
      heading: L({ required: true, max: 120 }),
      text: L({ max: 300 }),
      items: Yup.array()
        .of(
          noUnknown(
            Yup.object({
              title: L({ required: true, max: 120 }),
              text: L({ max: 300 }),
              year: Yup.number()
                .integer()
                .min(1900)
                .max(2200)
                .nullable()
                .default(null),
              image: image(),
              icon: iconNameSchema.default(''),
            }),
          ),
        )
        .max(24)
        .default([]),
    }),
  ),
  contactHero: noUnknown(
    Yup.object({
      image: image(),
      title: L({ required: true, max: 120 }),
      text: L({ max: 600 }),
    }),
  ),
  contactInfo: noUnknown(
    Yup.object({
      heading: L({ required: true, max: 120 }),
      text: L({ max: 300 }),
    }),
  ),
  map: noUnknown(
    Yup.object({
      embedUrl: Yup.string()
        .max(2048)
        .matches(
          /^(https:\/\/www\.google\.com\/maps\/embed[^\s]*)?$/,
          'Only Google Maps embed URLs are allowed',
        )
        .default(''),
      address: L({ max: 300 }),
    }),
  ),
};

/** Starting props for a freshly added section (empty text, sensible enums). */
export const defaultSectionProps = (
  type: SectionType,
): Record<string, unknown> =>
  SECTION_PROPS_SCHEMAS[type].cast(
    {},
    { stripUnknown: true, assert: false },
  ) as Record<string, unknown>;

export const validateSectionProps = (type: SectionType, props: unknown) =>
  SECTION_PROPS_SCHEMAS[type].validate(props ?? {}, {
    abortEarly: false,
    stripUnknown: true,
  });
