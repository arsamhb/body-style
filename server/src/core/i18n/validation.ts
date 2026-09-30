import * as Yup from 'yup';
import { defaultLocale } from './localized';
import { SUPPORTED_LOCALES } from './types';

interface LocalizedOptions {
  /** The default locale must be non-empty. */
  required?: boolean;
  max?: number;
  /**
   * No default value: a missing field stays `undefined` so partial PATCH payloads never overwrite
   * stored text with an empty map. Section schemas keep the `{}` default (they are cast whole).
   */
  optional?: boolean;
}

/**
 * Yup schema for a LocalizedString: an object keyed by supported locale codes only.
 * Other locales are rejected (noUnknown) so a typo never silently stores a dead translation.
 */
export const localizedString = ({
  required = false,
  max = 2000,
  optional = false,
}: LocalizedOptions = {}) => {
  const shape = Object.fromEntries(
    SUPPORTED_LOCALES.map((code) => [
      code,
      Yup.string().max(max, `Max ${max} characters`),
    ]),
  );
  let schema = optional
    ? Yup.object(shape)
        .noUnknown(true, 'Unsupported locale key')
        .default(undefined)
    : Yup.object(shape)
        .noUnknown(true, 'Unsupported locale key')
        .default(() => ({}));
  if (required) {
    schema = schema.test(
      'default-locale-required',
      `Text in the default locale (${defaultLocale()}) is required`,
      (value) =>
        // An absent optional field is "not provided", which a PATCH may leave untouched.
        (value === undefined && optional) ||
        Boolean(
          value &&
          typeof value[defaultLocale()] === 'string' &&
          value[defaultLocale()]!.trim(),
        ),
    );
  }
  return schema;
};

/** `href` for CMS links: a site-relative path or an absolute http(s) URL. Never `javascript:`. */
export const hrefSchema = Yup.string()
  .max(2048)
  .matches(
    /^(\/[^\s]*|https?:\/\/[^\s]+)$/,
    // Optional links are stored as ''; `.required()` guards the mandatory ones.
    {
      message: 'Must be a relative path (/about) or an http(s) URL',
      excludeEmptyString: true,
    },
  );

/** Path of an uploaded image (served from /uploads) or an absolute http(s) URL. */
export const imageUrlSchema = Yup.string()
  .max(2048)
  .matches(/^(\/(uploads|img)\/[^\s]+|https?:\/\/[^\s]+)$/, {
    message: 'Must be an uploaded image or an http(s) URL',
    excludeEmptyString: true,
  });

/** Icon names come from the client whitelist; keep the storage format tight. */
export const iconNameSchema = Yup.string()
  .max(40)
  .matches(/^[a-z0-9-]+$/, {
    message: 'Invalid icon name',
    excludeEmptyString: true,
  });

/** Stable client-side ids for list items (uuid or short random). */
export const itemIdSchema = Yup.string()
  .max(64)
  .matches(/^[A-Za-z0-9_-]+$/);
