import 'dotenv/config';
import { createServer } from 'http';
import app from './app.js';
import logger from './utils/logger.js';
import { initJobs } from './jobs/cron.js';
import { initSocket } from './config/socket.js';

const PORT = process.env.PORT || 5000;

// ─── HTTP Server + Socket.IO ─────────────────────────────────────────────────
const httpServer = createServer(app);
initSocket(httpServer);   // sets up io in config/socket.js

// ─── Background Jobs ─────────────────────────────────────────────────────────
initJobs();

// ─── Start ────────────────────────────────────────────────────────────────────
const server = httpServer.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on all interfaces at port ${PORT}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = (signal) => {
    logger.info(`${signal} signal received: closing HTTP server`);
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });

    // Forced shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
