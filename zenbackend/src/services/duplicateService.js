import prisma from '../config/prisma.js';

/**
 * Radius (in degrees) to consider two complaints geographically close.
 * ~0.005 degrees ≈ roughly 500 m at Indian latitudes.
 */
const PROXIMITY_THRESHOLD = 0.005;

/**
 * Find an existing complaint that matches the same category within a
 * geographic proximity window and is still unresolved.
 *
 * Phase 3.3 fix: added `isDuplicate: false` to prevent a duplicate
 * complaint from being matched as the "original" — which caused
 * validation count to increment on the wrong (already-flagged) record.
 *
 * @param {{ category: string, latitude: number, longitude: number }}
 * @returns {Promise<object|null>}  The original complaint, or null.
 */
async function findDuplicate({ category, latitude, longitude }) {
    try {
        const duplicate = await prisma.complaint.findFirst({
            where: {
                category,
                isDuplicate: false,                              // Phase 3.3 fix
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
            orderBy: { createdAt: 'asc' }, // return the earliest original
        });

        return duplicate || null;
    } catch (error) {
        console.error('Duplicate detection error:', error);
        return null; // fail open — let the complaint go through
    }
}

export default { findDuplicate };
