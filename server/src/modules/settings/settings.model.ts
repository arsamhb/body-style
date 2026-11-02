import { Schema, model, Document } from 'mongoose';
import { localizedStringSchema } from '../../core/i18n/localized';

export const CONTACT_WAY_TYPES = [
  'phone',
  'email',
  'link',
  'address',
  'whatsapp',
  'telegram',
  'instagram',
  'hours',
] as const;
export type ContactWayType = (typeof CONTACT_WAY_TYPES)[number];

export interface NavItemSub {
  id: string;
  label: Map<string, string>;
  href: string;
  order: number;
  enabled: boolean;
}

export interface ContactWaySub {
  id: string;
  type: ContactWayType;
  icon: string;
  label: Map<string, string>;
  value: string;
  description: Map<string, string>;
  showInFooter: boolean;
  order: number;
}

export interface SettingsDocument extends Document {
  key: 'site';
  siteName: Map<string, string>;
  slogan: Map<string, string>;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  enabledLocales: string[];
  navbar: NavItemSub[];
  footer: {
    quickLinks: NavItemSub[];
    text: Map<string, string>;
    copyright: Map<string, string>;
  };
  contactWays: ContactWaySub[];
  seo: {
    titleTemplate: Map<string, string>;
    description: Map<string, string>;
    ogImageUrl: string;
  };
  updatedAt: Date;
}

const navItemSchema = new Schema<NavItemSub>(
  {
    id: { type: String, required: true },
    label: localizedStringSchema(),
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false },
);

const contactWaySchema = new Schema<ContactWaySub>(
  {
    id: { type: String, required: true },
    type: { type: String, enum: CONTACT_WAY_TYPES, required: true },
    icon: { type: String, default: '' },
    label: localizedStringSchema(),
    value: { type: String, required: true },
    description: localizedStringSchema(),
    showInFooter: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

/** Singleton: exactly one document with `key: 'site'`. */
const settingsSchema = new Schema<SettingsDocument>(
  {
    key: { type: String, default: 'site', unique: true },
    siteName: localizedStringSchema(),
    slogan: localizedStringSchema(),
    logoUrl: { type: String, default: '' },
    logoDarkUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    enabledLocales: { type: [String], default: ['fa'] },
    navbar: { type: [navItemSchema], default: [] },
    footer: {
      quickLinks: { type: [navItemSchema], default: [] },
      text: localizedStringSchema(),
      copyright: localizedStringSchema(),
    },
    contactWays: { type: [contactWaySchema], default: [] },
    seo: {
      titleTemplate: localizedStringSchema(),
      description: localizedStringSchema(),
      ogImageUrl: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

export const Settings = model<SettingsDocument>('Settings', settingsSchema);
