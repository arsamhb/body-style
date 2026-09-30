import * as Yup from 'yup';

/** Mirrors the server rules. Messages are `ticket.*` message keys (translated in the form). */
export const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

export const ticketCreateValidationSchema = Yup.object({
  name: Yup.string().trim().min(2, 'nameTooShort').max(80, 'nameTooShort').required('nameTooShort'),
  phone: Yup.string().trim().matches(PHONE_REGEX, 'phoneInvalid').required('phoneRequired'),
  message: Yup.string().trim().max(1000, 'messageTooLong'),
  website: Yup.string().max(0),
});

export const ticketTriageValidationSchema = Yup.object({
  status: Yup.string().oneOf(['new', 'inProgress', 'closed']).required(),
  adminNote: Yup.string().max(2000, 'validation.tooLong'),
});
