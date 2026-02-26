import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { getOverview, getDepartments, getHeatmap, getTrends } from '../controllers/analyticsController.js';

const router = express.Router();
const protect = [auth, requireRole('ADMIN')];

router.get('/overview', ...protect, getOverview);
router.get('/departments', ...protect, getDepartments);
router.get('/heatmap', ...protect, getHeatmap);
router.get('/trends', ...protect, getTrends);

export default router;
