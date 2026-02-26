import express from "express";
import { auth } from "../middleware/auth.js";

import { getProfile } from "../controllers/userController.js";

const router = express.Router();

/**
 * GET /api/users/profile — Fetch current user profile (including points)
 */
/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     summary: Fetch current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", auth, getProfile);

export default router;
