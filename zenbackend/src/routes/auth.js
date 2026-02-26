/**
 * src/routes/auth.js
 *
 * Auth routes — mounted at /api/auth in index.js.
 *
 * Endpoints:
 *   POST /register  — Create Supabase auth user + Prisma User record
 *   POST /login     — Sign in, return session with access_token
 *   GET  /me        — Return the logged-in user (protected)
 *   POST /logout    — Invalidate Supabase session (protected)
 *   GET  /profile   — Alias for /me kept for backward compat
 */
import express from 'express';
import { auth } from '../middleware/auth.js';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { getProfile } from '../controllers/userController.js';

const router = express.Router();

/**
 * POST /api/auth/register
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 */
router.get('/me', auth, getMe);

/**
 * POST /api/auth/logout
 */
router.post('/logout', auth, logout);

/**
 * GET /api/auth/profile — Backward compat alias for /me, using userController for consistency
 */
router.get('/profile', auth, getProfile);

export default router;
