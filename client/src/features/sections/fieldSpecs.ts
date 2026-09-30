import type { SectionType } from './types';

/**
 * Declarative description of each section's editable props. `SectionPropsForm` renders any
 * section from this alone, so adding a section type = server schema + public renderer + a spec
 * here. Field labels come from `admin.sections.fields.<name>`; select option labels from
 * `admin.sections.options.<name>.<value>`.
 */
export type FieldSpec =
  | { kind: 'localized'; name: string; required?: boolean; multiline?: boolean; rows?: number }
  | { kind: 'text'; name: string; required?: boolean; dir?: 'ltr'; placeholder?: string }
  | { kind: 'number'; name: string; min?: number; max?: number }
  | { kind: 'boolean'; name: string }
  | { kind: 'image'; name: string; aspect?: string; required?: boolean }
  | { kind: 'icon'; name: string }
  | { kind: 'select'; name: string; options: string[] }
  | { kind: 'cta'; name: string; required?: boolean }
  | { kind: 'group'; name: string; fields: FieldSpec[] }
  | {
      kind: 'list';
      name: string;
      fields: FieldSpec[];
      newItem: () => Record<string, unknown>;
      titleField?: string;
      max?: number;
    };

const L = (name: string, required = false): FieldSpec => ({ kind: 'localized', name, required });
const LM = (name: string, rows = 4, required = false): FieldSpec => ({
  kind: 'localized',
  name,
  multiline: true,
  rows,
  required,
});
const img = (name: string, aspect = 'aspect-video', required = false): FieldSpec => ({
  kind: 'image',
  name,
  aspect,
  required,
});
const href = (name = 'href'): FieldSpec => ({
  kind: 'text',
  name,
  dir: 'ltr',
  placeholder: '/about',
});

export const SECTION_FIELD_SPECS: Record<SectionType, FieldSpec[]> = {
  hero: [
    L('eyebrow'),
    L('title', true),
    LM('subtitle', 2),
    { kind: 'cta', name: 'primaryCta' },
    { kind: 'cta', name: 'secondaryCta' },
    img('backgroundImage', 'aspect-[16/7]'),
    { kind: 'select', name: 'pattern', options: ['dots', 'grid', 'gradient', 'none'] },
  ],
  intro: [
    L('heading', true),
    LM('body', 6),
    img('image', 'aspect-[4/3]'),
    { kind: 'select', name: 'imagePosition', options: ['end', 'start'] },
    { kind: 'cta', name: 'cta' },
  ],
  features: [
    L('eyebrow'),
    L('heading', true),
    LM('text', 2),
    {
      kind: 'list',
      name: 'items',
      titleField: 'title',
      max: 12,
      newItem: () => ({ icon: 'sparkles', title: {}, text: {}, href: '' }),
      fields: [{ kind: 'icon', name: 'icon' }, L('title', true), LM('text', 3), href()],
    },
  ],
  catalogHighlights: [
    L('heading', true),
    LM('text', 2),
    { kind: 'text', name: 'typeSlug', dir: 'ltr', placeholder: 'products' },
    { kind: 'select', name: 'mode', options: ['featured', 'manual'] },
    { kind: 'number', name: 'limit', min: 1, max: 12 },
  ],
  samples: [
    L('heading', true),
    LM('text', 2),
    {
      kind: 'list',
      name: 'items',
      titleField: 'title',
      max: 12,
      newItem: () => ({ image: '', title: {}, text: {}, href: '' }),
      fields: [img('image', 'aspect-[4/3]'), L('title', true), LM('text', 2), href()],
    },
  ],
  stats: [
    {
      kind: 'list',
      name: 'items',
      titleField: 'label',
      max: 8,
      newItem: () => ({ value: 0, suffix: '', label: {}, icon: '' }),
      fields: [
        { kind: 'number', name: 'value', min: 0 },
        { kind: 'text', name: 'suffix', dir: 'ltr', placeholder: '+' },
        L('label', true),
        { kind: 'icon', name: 'icon' },
      ],
    },
  ],
  testimonials: [
    L('heading', true),
    {
      kind: 'list',
      name: 'items',
      titleField: 'author',
      max: 12,
      newItem: () => ({ quote: {}, author: {}, role: {}, avatar: '' }),
      fields: [LM('quote', 3, true), L('author', true), L('role'), img('avatar', 'aspect-square')],
    },
  ],
  partners: [
    L('heading'),
    {
      kind: 'list',
      name: 'logos',
      titleField: 'name',
      max: 24,
      newItem: () => ({ image: '', name: '', href: '' }),
      fields: [img('image', 'aspect-[5/2]', true), { kind: 'text', name: 'name' }, href()],
    },
  ],
  ctaBanner: [L('heading', true), LM('text', 2), { kind: 'cta', name: 'cta', required: true }],
  faq: [
    L('heading', true),
    LM('text', 2),
    {
      kind: 'list',
      name: 'items',
      titleField: 'question',
      max: 30,
      newItem: () => ({ question: {}, answer: {} }),
      fields: [L('question', true), LM('answer', 4, true)],
    },
  ],
  ticketForm: [L('heading', true), LM('text', 2)],
  aboutHero: [img('image', 'aspect-[21/9]'), L('title', true), LM('subtitle', 2)],
  missionVision: [
    { kind: 'group', name: 'mission', fields: [L('title', true), LM('text', 4)] },
    { kind: 'group', name: 'vision', fields: [L('title', true), LM('text', 4)] },
    img('image', 'aspect-square'),
  ],
  achievements: [
    L('heading', true),
    LM('text', 2),
    {
      kind: 'list',
      name: 'items',
      titleField: 'title',
      max: 24,
      newItem: () => ({ title: {}, text: {}, year: null, image: '', icon: 'award' }),
      fields: [
        L('title', true),
        LM('text', 2),
        { kind: 'number', name: 'year', min: 1900, max: 2200 },
        img('image', 'aspect-[4/3]'),
        { kind: 'icon', name: 'icon' },
      ],
    },
  ],
  contactHero: [img('image', 'aspect-[4/3]'), L('title', true), LM('text', 3)],
  contactInfo: [L('heading', true), LM('text', 2)],
  map: [
    {
      kind: 'text',
      name: 'embedUrl',
      dir: 'ltr',
      placeholder: 'https://www.google.com/maps/embed?…',
    },
    LM('address', 2),
  ],
};

/** Preview text for a section card in the editor: first localized field that has content. */
export const SECTION_PREVIEW_FIELD: Partial<Record<SectionType, string>> = {
  hero: 'title',
  intro: 'heading',
  features: 'heading',
  catalogHighlights: 'heading',
  samples: 'heading',
  testimonials: 'heading',
  partners: 'heading',
  ctaBanner: 'heading',
  faq: 'heading',
  ticketForm: 'heading',
  aboutHero: 'title',
  missionVision: 'mission.title',
  achievements: 'heading',
  contactHero: 'title',
  contactInfo: 'heading',
  map: 'address',
};

export const SECTION_ICON: Record<SectionType, string> = {
  hero: 'sparkles',
  intro: 'file-text',
  features: 'layout-grid',
  catalogHighlights: 'package',
  samples: 'image',
  stats: 'chart-bar',
  testimonials: 'quote',
  partners: 'handshake',
  ctaBanner: 'zap',
  faq: 'circle-help',
  ticketForm: 'ticket',
  aboutHero: 'image',
  missionVision: 'target',
  achievements: 'award',
  contactHero: 'image',
  contactInfo: 'phone',
  map: 'map-pin',
};
