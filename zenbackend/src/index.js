import 'dotenv/config';
import { createServer } from 'http';
import app from './app.js';
import logger from './utils/logger.js';
import { initSocket } from './config/socket.js';
import { startSlaMonitor } from './jobs/slaMonitor.js';

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initSocket(httpServer);
startSlaMonitor();

const server = httpServer.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on all interfaces at port ${PORT}`);
});

const shutdown = (signal) => {
    logger.info(`${signal} signal received: closing HTTP server`);
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });

    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
