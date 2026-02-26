import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import logger from './utils/logger.js';

import complaintsRouter from './routes/complaints.js';
import authRouter from './routes/auth.js';
import analyticsRouter from './routes/analytics.js';
import { errorHandler } from './middleware/errorHandler.js';
import usersRouter from './routes/users.js';

const app = express();

// ─── Security Hardening ──────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : true,
    credentials: true
}));

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Swagger Documentation ────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

/**
 * @openapi
 * /health:
 *   get:
 *     description: Health check endpoint
 *     responses:
 *       200:
 *         description: Returns status ok
 */
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/complaint', complaintsRouter);   // backward-compat alias
app.use('/api/analytics', analyticsRouter);
app.use('/api/users', usersRouter);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    logger.warn(`[404] ${req.method} ${req.url}`);
    res.status(404).json({ error: `Path ${req.url} not found` });
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
