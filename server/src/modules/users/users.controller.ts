import { RequestHandler } from 'express';
import {
  buildPaginatedResponse,
  hasPaginationParams,
  parsePagination,
} from '../../core/pagination';
import * as usersService from './users.service';
import { userModel2UserReadResponse } from './adapter.modelToResponse';
import { UserCreatePayload, UserUpdatePayload } from './interface.payload';

export const list: RequestHandler = async (req, res) => {
  if (hasPaginationParams(req.query)) {
    const params = parsePagination(req.query);
    const { items, total } = await usersService.listUsersPaginated(params);
    res.json(
      buildPaginatedResponse(
        items.map(userModel2UserReadResponse),
        total,
        params,
      ),
    );
    return;
  }
  const items = await usersService.listUsers();
  res.json(items.map(userModel2UserReadResponse));
};

export const read: RequestHandler = async (req, res) => {
  const user = await usersService.getUser(String(req.params.id));
  res.json(userModel2UserReadResponse(user));
};

export const create: RequestHandler = async (req, res) => {
  const user = await usersService.createUser(req.body as UserCreatePayload);
  res.status(201).json(userModel2UserReadResponse(user));
};

export const update: RequestHandler = async (req, res) => {
  const user = await usersService.updateUser(
    String(req.params.id),
    req.body as UserUpdatePayload,
    req.admin!.id,
  );
  res.json(userModel2UserReadResponse(user));
};

export const remove: RequestHandler = async (req, res) => {
  await usersService.deleteUser(String(req.params.id), req.admin!.id);
  res.json({ success: true });
};
