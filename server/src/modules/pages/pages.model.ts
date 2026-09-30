import { Schema, model, Document } from 'mongoose';
import { localizedStringSchema } from '../../core/i18n/localized';
import {
  PAGE_KEYS,
  PageKey,
  SECTION_TYPES,
  SectionBase,
} from './sections.types';

export interface PageDocument extends Document {
  key: PageKey;
  enabled: boolean;
  seo: {
    title: Map<string, string>;
    description: Map<string, string>;
    ogImageUrl: string;
  };
  sections: SectionBase[];
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<SectionBase>(
  {
    id: { type: String, required: true },
    key: { type: String, required: true },
    type: { type: String, enum: SECTION_TYPES, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    // Shape depends on `type`; validated by sections.registry before every write.
    props: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false, minimize: false },
);

const pageSchema = new Schema<PageDocument>(
  {
    key: { type: String, enum: PAGE_KEYS, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    seo: {
      title: localizedStringSchema(),
      description: localizedStringSchema(),
      ogImageUrl: { type: String, default: '' },
    },
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true, minimize: false },
);

export const Page = model<PageDocument>('Page', pageSchema);
