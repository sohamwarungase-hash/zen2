import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import upload from '../middleware/upload.js';
import { complaintLimiter } from '../middleware/rateLimiter.js';
import { validateComplaintBody, validateStatusUpdate } from '../middleware/validate.js';
import {
    createComplaint,
    getComplaints,
    getMyComplaints,
    getComplaintById,
    updateComplaintStatus,
    validateComplaint
} from '../controllers/complaintController.js';

const router = express.Router();

/**
 * @openapi
 * /api/complaints/test:
 *   get:
 *     description: Test probe
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/test', (_req, res) => {
    res.json({ message: 'Complaints router is alive!' });
});

/**
 * POST /api/complaints — Submit a complaint (CITIZEN only)
 */
router.post(
    '/',
    auth,
    requireRole('CITIZEN'),
    complaintLimiter,
    upload.single('image'),
    validateComplaintBody,
    createComplaint
);

/**
 * GET /api/complaints — Fetch complaints (role-aware)
 */
router.get('/', auth, getComplaints);

/**
 * GET /api/complaints/my — Own complaints (CITIZEN only)
 */
router.get('/my', auth, requireRole('CITIZEN'), getMyComplaints);

/**
 * GET /api/complaints/:id — Single complaint
 */
router.get('/:id', auth, getComplaintById);

/**
 * PATCH /api/complaints/:id/status — Update status (ADMIN / DEPT_OFFICER)
 */
router.patch(
    '/:id/status',
    auth,
    requireRole('ADMIN', 'DEPT_OFFICER'),
    validateStatusUpdate,
    updateComplaintStatus
);

/**
 * POST /api/complaints/:id/validate — Community validation (CITIZEN only)
 */
router.post('/:id/validate', auth, requireRole('CITIZEN'), validateComplaint);

export default router;
