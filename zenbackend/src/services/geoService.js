import prisma from '../config/prisma.js';

/**
 * Radius (in degrees) to scan for nearby complaints.
 * ~0.01 degrees ≈ roughly 1 km.
 */
const SCAN_RADIUS = 0.01;

/**
 * Calculate a geo-risk bonus based on complaint density in the area.
 *
 * Logic:
 *   - Count unresolved complaints within ~1 km of the given coordinates.
 *   - More nearby complaints → higher geo-risk bonus (hot zone).
 *
 * Bonus mapping:
 *   0-1 nearby  → 0 bonus
 *   2-4 nearby  → +1
 *   5-9 nearby  → +2
 *   10+ nearby  → +3
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<number>}  Bonus points to add to AI priority.
 */
async function calculateGeoRisk(latitude, longitude) {
    try {
        const nearbyCount = await prisma.complaint.count({
            where: {
                status: { notIn: ['RESOLVED'] },
                latitude: {
                    gte: latitude - SCAN_RADIUS,
                    lte: latitude + SCAN_RADIUS,
                },
                longitude: {
                    gte: longitude - SCAN_RADIUS,
                    lte: longitude + SCAN_RADIUS,
                },
            },
        });

        if (nearbyCount >= 10) return 3;
        if (nearbyCount >= 5) return 2;
        if (nearbyCount >= 2) return 1;
        return 0;
    } catch (error) {
        console.error('Geo risk calculation error:', error);
        return 0; // fail safe — no bonus
    }
}

export default { calculateGeoRisk };
