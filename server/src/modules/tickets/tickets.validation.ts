import * as Yup from 'yup';
import { SUPPORTED_LOCALES } from '../../core/i18n/types';
import { TICKET_SOURCE_PAGES, TICKET_STATUSES } from './tickets.model';

export const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

export const ticketCreateValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name is too short')
    .max(80)
    .required('Name is required'),
  phone: Yup.string()
    .trim()
    .matches(PHONE_REGEX, 'Invalid phone number')
    .required('Phone is required'),
  message: Yup.string().trim().max(1000, 'Message is too long').default(''),
  locale: Yup.string()
    .oneOf([...SUPPORTED_LOCALES])
    .default('fa'),
  token: Yup.string().max(256).required('Form token is required'),
  website: Yup.string().max(200).default(''),
  source: Yup.object({
    page: Yup.string()
      .oneOf([...TICKET_SOURCE_PAGES])
      .required(),
    section: Yup.string()
      .max(60)
      .matches(/^[a-z0-9-]*$/, 'Invalid section')
      .default(''),
    itemId: Yup.string()
      .matches(/^([a-f\d]{24})?$/i, 'Invalid item')
      .default(''),
    itemSlug: Yup.string().max(80).default(''),
    path: Yup.string()
      .max(200)
      .matches(/^(\/[^\s]*)?$/, 'Invalid path')
      .default(''),
  })
    .noUnknown(true, 'Unknown fields are not allowed')
    .required(),
}).noUnknown(true, 'Unknown fields are not allowed');

export const ticketUpdateValidationSchema = Yup.object({
  status: Yup.string().oneOf([...TICKET_STATUSES]),
  adminNote: Yup.string().max(2000),
}).noUnknown(true, 'Unknown fields are not allowed');
