import prisma from '../config/prisma.js';

const PROXIMITY_THRESHOLD = 0.005;

async function findDuplicate({ category, latitude, longitude }) {
    try {
        const duplicate = await prisma.complaint.findFirst({
            where: {
                category,
                status: { notIn: ['RESOLVED', 'ESCALATED'] },
                latitude: {
                    gte: latitude - PROXIMITY_THRESHOLD,
                    lte: latitude + PROXIMITY_THRESHOLD,
                },
                longitude: {
                    gte: longitude - PROXIMITY_THRESHOLD,
                    lte: longitude + PROXIMITY_THRESHOLD,
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return duplicate || null;
    } catch (_error) {
        return null;
    }
}

export default { findDuplicate };
