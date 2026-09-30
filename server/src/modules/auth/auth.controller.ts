import { Request, RequestHandler } from 'express';
import { ApiError, ErrorCode } from '../../core/errors/ApiError';
import * as authService from './auth.service';
import { adminModel2AdminMeResponse } from './adapter.modelToResponse';
import {
  ChangePasswordPayload,
  LoginPayload,
  LogoutPayload,
  RefreshPayload,
  SessionMeta,
} from './interface.payload';

const sessionMeta = (req: Request): SessionMeta => ({
  ip: req.ip ?? '',
  userAgent: String(req.headers['user-agent'] ?? ''),
});

const requireAdmin = (req: Request) => {
  if (!req.admin)
    throw ApiError.unauthorized(
      'Authentication required',
      ErrorCode.NOT_AUTHENTICATED,
    );
  return req.admin;
};

export const login: RequestHandler = async (req, res) => {
  const tokens = await authService.login(
    req.body as LoginPayload,
    sessionMeta(req),
  );
  res.json(tokens);
};

export const refresh: RequestHandler = async (req, res) => {
  const tokens = await authService.refresh(
    req.body as RefreshPayload,
    sessionMeta(req),
  );
  res.json(tokens);
};

export const logout: RequestHandler = async (req, res) => {
  await authService.logout(req.body as LogoutPayload);
  res.json({ success: true });
};

export const me: RequestHandler = async (req, res) => {
  const admin = await authService.getAdminById(requireAdmin(req).id);
  res.json(adminModel2AdminMeResponse(admin));
};

export const changePassword: RequestHandler = async (req, res) => {
  await authService.changePassword(
    requireAdmin(req).id,
    req.body as ChangePasswordPayload,
  );
  res.json({ success: true });
};
