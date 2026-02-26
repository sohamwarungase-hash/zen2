import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
    logger.error('Global error handler:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Never leak raw stack traces in the HTTP response
    res.status(status).json({ error: message });
}
