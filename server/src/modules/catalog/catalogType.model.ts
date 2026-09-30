import { Schema, model, Document } from 'mongoose';
import { localizedStringSchema } from '../../core/i18n/localized';
import {
  CARD_VARIANTS,
  CardDesign,
  FilterConfig,
  IMAGE_RATIOS,
  SPEC_TYPES,
  SpecDefinition,
} from './catalog.types';

export interface CatalogTypeDocument extends Document {
  slug: string;
  name: Map<string, string>;
  description: Map<string, string>;
  specDefinitions: SpecDefinition[];
  cardDesign: CardDesign;
  filterConfig: FilterConfig;
  seo: { title: Map<string, string>; description: Map<string, string> };
  enabled: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const specOptionSchema = new Schema(
  { value: { type: String, required: true }, label: localizedStringSchema() },
  { _id: false },
);

// Untyped on purpose: localized fields are Maps in storage but plain objects in `SpecDefinition`.
const specDefinitionSchema = new Schema(
  {
    key: { type: String, required: true },
    label: localizedStringSchema(),
    type: { type: String, enum: SPEC_TYPES, required: true },
    unit: localizedStringSchema(),
    currency: { type: String, default: '' },
    options: { type: [specOptionSchema], default: [] },
    filterable: { type: Boolean, default: false },
    showOnCard: { type: Boolean, default: false },
    showOnDetail: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const catalogTypeSchema = new Schema<CatalogTypeDocument>(
  {
    slug: { type: String, required: true, unique: true },
    name: localizedStringSchema(),
    description: localizedStringSchema(),
    specDefinitions: { type: [specDefinitionSchema], default: [] },
    cardDesign: {
      variant: { type: String, enum: CARD_VARIANTS, default: 'imageTop' },
      imageRatio: { type: String, enum: IMAGE_RATIOS, default: '4:3' },
      showSummary: { type: Boolean, default: true },
      cardSpecKeys: { type: [String], default: [] },
      badgeSpecKey: { type: String, default: '' },
      priceSpecKey: { type: String, default: '' },
    },
    filterConfig: {
      categoriesEnabled: { type: Boolean, default: true },
      searchEnabled: { type: Boolean, default: true },
      enabledFilterKeys: { type: [String], default: [] },
      sortKeys: { type: [String], default: [] },
    },
    seo: {
      title: localizedStringSchema(),
      description: localizedStringSchema(),
    },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const CatalogType = model<CatalogTypeDocument>(
  'CatalogType',
  catalogTypeSchema,
);
