import rateLimit from 'express-rate-limit';

/**
 * complaintLimiter — 10 requests per minute per IP.
 * Applied to POST /api/complaints to prevent Gemini quota exhaustion.
 */
export const complaintLimiter = rateLimit({
    windowMs: 60 * 1000,        // 1 minute
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many complaint submissions. Please wait a minute and try again.',
    },
});

/**
 * generalLimiter — 100 requests per minute per IP.
 * Can be applied globally or to high-traffic routes.
 */
export const generalLimiter = rateLimit({
    windowMs: 60 * 1000,        // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests. Please slow down.',
    },
});
