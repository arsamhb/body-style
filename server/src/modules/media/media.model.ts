import { Schema, model, Document, Types } from 'mongoose';
import { localizedStringSchema } from '../../core/i18n/localized';

export interface MediaDocument extends Document {
  key: string;
  url: string;
  thumbKey: string;
  thumbUrl: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  alt: Map<string, string>;
  originalName: string;
  uploadedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<MediaDocument>(
  {
    key: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    thumbKey: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    mime: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    size: { type: Number, required: true },
    alt: localizedStringSchema(),
    originalName: { type: String, default: '', maxlength: 255 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true },
);

export const Media = model<MediaDocument>('Media', mediaSchema);
