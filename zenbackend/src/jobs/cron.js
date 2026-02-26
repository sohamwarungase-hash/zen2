import cron from 'node-cron';
import prisma from '../config/prisma.js';
import axios from 'axios';
import { getIO } from '../config/socket.js';
import logger from '../utils/logger.js';

/**
 * SLA Escalation Job
 * Checks for complaints that have passed their deadline and are still not resolved.
 * Runs every 15 minutes.
 */
const startSlaCheck = () => {
    cron.schedule('*/15 * * * *', async () => {
        logger.info('Running SLA Escalation Check...');
        try {
            const now = new Date();

            // Find breached complaints BEFORE updating so we have their IDs
            const breached = await prisma.complaint.findMany({
                where: {
                    status: { notIn: ['RESOLVED', 'ESCALATED'] },
                    slaDeadline: { lt: now },
                },
            });

            if (breached.length === 0) {
                logger.debug('No complaints to escalate.');
                return;
            }

            // Bulk-update their status to ESCALATED
            const escalated = await prisma.complaint.updateMany({
                where: {
                    id: { in: breached.map((c) => c.id) },
                },
                data: {
                    status: 'ESCALATED',
                },
            });

            logger.info(`Successfully escalated ${escalated.count} complaints.`);

            // Emit sla-breach event to admin-room for each breached complaint
            const socketIO = getIO();
            if (socketIO) {
                for (const complaint of breached) {
                    socketIO.to('admin-room').emit('sla-breach', {
                        ...complaint,
                        status: 'ESCALATED',
                    });
                }
            }
        } catch (error) {
            logger.error('SLA Escalation Check Error:', { error: error.message, stack: error.stack });
        }
    });
};

/**
 * Render Keep-Alive Job
 * Self-pings the server every 14 minutes to prevent it from sleeping on Render's free tier.
 */
const startKeepAlive = () => {
    const APP_URL = process.env.RENDER_EXTERNAL_URL;

    if (!APP_URL) {
        logger.warn('Keep-alive disabled: RENDER_EXTERNAL_URL not set.');
        return;
    }

    cron.schedule('*/14 * * * *', async () => {
        try {
            logger.debug(`Self-pinging to keep alive: ${APP_URL}/health`);
            await axios.get(`${APP_URL}/health`);
        } catch (error) {
            logger.error('Keep-alive ping failed:', { error: error.message });
        }
    });
};

export const initJobs = () => {
    startSlaCheck();
    startKeepAlive();
    console.log('Background jobs initialized.');
};
