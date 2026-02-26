import express from 'express';
import { auth } from '../middleware/auth.js';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { getProfile } from '../controllers/userController.js';
import { validateLoginBody, validateRegisterBody } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateRegisterBody, register);
router.post('/login', validateLoginBody, login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);
router.get('/profile', auth, getProfile);

export default router;
