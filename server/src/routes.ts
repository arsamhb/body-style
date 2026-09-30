import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import mediaRoutes from './modules/media/media.routes';
import {
  settingsAdminRoutes,
  sitePublicRoutes,
} from './modules/settings/settings.routes';
import {
  pagesAdminRoutes,
  pagesPublicRoutes,
} from './modules/pages/pages.routes';
import { setEnabledPagesProvider } from './modules/settings/settings.controller';
import { listEnabledPageKeys } from './modules/pages/pages.service';
import {
  catalogAdminRoutes,
  catalogPublicRoutes,
} from './modules/catalog/catalog.routes';
import {
  dashboardRoutes,
  ticketsAdminRoutes,
  ticketsPublicRoutes,
} from './modules/tickets/tickets.routes';
import sitemapRoutes from './modules/sitemap/sitemap.routes';

/**
 * URL layout:
 *   /auth/*      login, refresh, logout, me, password
 *   /admin/*     back-office resources: requireAuth + role/permission checks inside each router
 *   /public/*    read-only, locale-resolved (`?locale=`), published content only (no auth)
 *   /uploads/*   static media (mounted in app.ts)
 *   /health      liveness (no I/O) · /health/ready  readiness (MongoDB ping) — compose healthcheck
 */
const router = Router();

// The public site payload lists which pages exist so the navbar can hide disabled ones.
setEnabledPagesProvider(listEnabledPageKeys);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/health/ready', async (_req, res) => {
  try {
    const { db } = mongoose.connection;
    if (!db) throw new Error('not connected');
    await db.admin().ping();
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'db-unavailable' });
  }
});

router.use('/auth', authRoutes);
router.use('/admin/users', usersRoutes);
router.use('/admin/media', mediaRoutes);
router.use('/admin/settings', settingsAdminRoutes);
router.use('/admin/pages', pagesAdminRoutes);
router.use('/public/site', sitePublicRoutes);
router.use('/public/pages', pagesPublicRoutes);
router.use('/admin/catalog', catalogAdminRoutes);
router.use('/public/catalog', catalogPublicRoutes);
router.use('/admin/tickets', ticketsAdminRoutes);
router.use('/admin/dashboard', dashboardRoutes);
router.use('/public/tickets', ticketsPublicRoutes);
router.use('/public/sitemap', sitemapRoutes);

export default router;
