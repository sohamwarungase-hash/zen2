import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { getOverview, getDepartments, getHeatmap, getTrends } from '../controllers/analyticsController.js';

const router = express.Router();

// All analytics routes require authentication + staff access
const protect = [auth, requireRole('ADMIN', 'DEPT_OFFICER')];

/**
 * GET /api/analytics/overview
 */
router.get('/overview', ...protect, getOverview);

/**
 * GET /api/analytics/departments
 */
router.get('/departments', ...protect, getDepartments);

/**
 * GET /api/analytics/heatmap
 */
router.get('/heatmap', ...protect, getHeatmap);

/**
 * GET /api/analytics/trends
 */
router.get('/trends', ...protect, getTrends);

export default router;
