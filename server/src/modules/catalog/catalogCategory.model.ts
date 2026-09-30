import { Schema, model, Document, Types } from 'mongoose';
import { localizedStringSchema } from '../../core/i18n/localized';

export interface CatalogCategoryDocument extends Document {
  typeId: Types.ObjectId;
  slug: string;
  name: Map<string, string>;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const catalogCategorySchema = new Schema<CatalogCategoryDocument>(
  {
    typeId: { type: Schema.Types.ObjectId, ref: 'CatalogType', required: true },
    slug: { type: String, required: true },
    name: localizedStringSchema(),
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

catalogCategorySchema.index({ typeId: 1, slug: 1 }, { unique: true });

export const CatalogCategory = model<CatalogCategoryDocument>(
  'CatalogCategory',
  catalogCategorySchema,
);
