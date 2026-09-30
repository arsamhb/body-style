import { Schema, model, Document, Types } from 'mongoose';
import { localizedStringSchema } from '../../core/i18n/localized';
import { ITEM_STATUSES, ItemStatus, SpecValues } from './catalog.types';

export interface CatalogItemDocument extends Document {
  typeId: Types.ObjectId;
  slug: string;
  title: Map<string, string>;
  summary: Map<string, string>;
  description: Map<string, string>;
  coverImage: string;
  images: string[];
  categoryIds: Types.ObjectId[];
  specs: SpecValues;
  featured: boolean;
  order: number;
  status: ItemStatus;
  seo: { title: Map<string, string>; description: Map<string, string> };
  createdAt: Date;
  updatedAt: Date;
}

const catalogItemSchema = new Schema<CatalogItemDocument>(
  {
    typeId: { type: Schema.Types.ObjectId, ref: 'CatalogType', required: true },
    slug: { type: String, required: true },
    title: localizedStringSchema(),
    summary: localizedStringSchema(),
    description: localizedStringSchema(),
    coverImage: { type: String, default: '' },
    images: { type: [String], default: [] },
    categoryIds: {
      type: [Schema.Types.ObjectId],
      ref: 'CatalogCategory',
      default: [],
    },
    // Keys/values are validated against the type's spec definitions before every write.
    specs: { type: Schema.Types.Mixed, default: {} },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ITEM_STATUSES, default: 'draft' },
    seo: {
      title: localizedStringSchema(),
      description: localizedStringSchema(),
    },
  },
  { timestamps: true, minimize: false },
);

catalogItemSchema.index({ typeId: 1, slug: 1 }, { unique: true });
catalogItemSchema.index({ typeId: 1, status: 1, featured: -1, order: 1 });
catalogItemSchema.index({ typeId: 1, categoryIds: 1 });
catalogItemSchema.index({ 'specs.$**': 1 });

export const CatalogItem = model<CatalogItemDocument>(
  'CatalogItem',
  catalogItemSchema,
);
