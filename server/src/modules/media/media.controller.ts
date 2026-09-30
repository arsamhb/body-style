import { RequestHandler } from 'express';
import { ApiError } from '../../core/errors/ApiError';
import { buildPaginatedResponse, parsePagination } from '../../core/pagination';
import * as mediaService from './media.service';
import { mediaModel2MediaReadResponse } from './adapter.modelToResponse';
import { mediaAltValidationSchema } from './media.validation';

export const list: RequestHandler = async (req, res) => {
  const params = parsePagination(req.query);
  const { items, total } = await mediaService.listMediaPaginated(params);
  res.json(
    buildPaginatedResponse(
      items.map(mediaModel2MediaReadResponse),
      total,
      params,
    ),
  );
};

export const read: RequestHandler = async (req, res) => {
  const media = await mediaService.getMedia(String(req.params.id));
  res.json(mediaModel2MediaReadResponse(media));
};

const parseAlt = async (raw: unknown) => {
  let parsed: unknown = {};
  if (typeof raw === 'string' && raw.trim()) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw ApiError.validation([
        { field: 'alt', code: 'json', message: 'alt must be a JSON object' },
      ]);
    }
  }
  const { alt } = await mediaAltValidationSchema.validate(
    { alt: parsed },
    { abortEarly: false, stripUnknown: true },
  );
  return alt;
};

export const upload: RequestHandler = async (req, res) => {
  if (!req.file) {
    throw ApiError.validation([
      { field: 'file', code: 'required', message: 'An image file is required' },
    ]);
  }
  const alt = await parseAlt(req.body?.alt);
  const media = await mediaService.uploadImage({
    buffer: req.file.buffer,
    originalName: req.file.originalname,
    alt,
    uploadedBy: req.admin?.id,
  });
  res.status(201).json(mediaModel2MediaReadResponse(media));
};

export const updateAlt: RequestHandler = async (req, res) => {
  const media = await mediaService.updateMediaAlt(
    String(req.params.id),
    req.body.alt ?? {},
  );
  res.json(mediaModel2MediaReadResponse(media));
};

export const remove: RequestHandler = async (req, res) => {
  await mediaService.deleteMedia(String(req.params.id));
  res.json({ success: true });
};
