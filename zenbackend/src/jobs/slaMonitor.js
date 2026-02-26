import cron from 'node-cron';
import prisma from '../config/prisma.js';
import { getIO } from '../config/socket.js';
import logger from '../utils/logger.js';

export function startSlaMonitor() {
    cron.schedule('*/15 * * * *', async () => {
        try {
            const breached = await prisma.complaint.findMany({
                where: {
                    status: { notIn: ['RESOLVED'] },
                    slaDeadline: { lt: new Date() },
                    slaBreach: false,
                },
            });

            if (!breached.length) return;

            const io = getIO();
            for (const complaint of breached) {
                const updated = await prisma.complaint.update({
                    where: { id: complaint.id },
                    data: {
                        status: 'ESCALATED',
                        slaBreach: true,
                    },
                });

                await prisma.statusHistory.create({
                    data: {
                        complaintId: complaint.id,
                        status: 'ESCALATED',
                        changedBy: 'system-cron',
                        note: 'SLA breach auto escalation',
                    },
                });

                io?.to('admin-room').emit('sla-breach', updated);
            }
        } catch (error) {
            logger.error('SLA monitor failed', { message: error.message });
        }
    });
}
