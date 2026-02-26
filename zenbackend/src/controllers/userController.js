import prisma from "../config/prisma.js";

/**
 * Fetch current user profile (including points)
 */
export const getProfile = async (req, res) => {
    try {
        // Sync user (upsert) to ensure record exists in Prisma
        const user = await prisma.user.upsert({
            where: { id: req.user.id },
            create: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.email.split("@")[0], // default name
                role: req.user.role ?? "CITIZEN",
            },
            update: {},
        });

        res.json(user);
    } catch (err) {
        console.error("GET /api/users/profile error:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};
