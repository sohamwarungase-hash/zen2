import prisma from '../config/prisma.js';

export const getOverview = async (req, res, next) => {
    try {
        const [total, open, inProgress, resolved, escalated] = await Promise.all([
            prisma.complaint.count(),
            prisma.complaint.count({ where: { status: 'SUBMITTED' } }),
            prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.complaint.count({ where: { status: 'RESOLVED' } }),
            prisma.complaint.count({ where: { status: 'ESCALATED' } }),
        ]);

        res.json({ total, open, inProgress, resolved, escalated });
    } catch (err) {
        next(err);
    }
};

export const getDepartments = async (req, res, next) => {
    try {
        const groups = await prisma.complaint.groupBy({
            by: ['department', 'status'],
            _count: { _all: true },
        });

        const result = {};
        for (const row of groups) {
            const dept = row.department;
            if (!result[dept]) {
                result[dept] = { total: 0, resolved: 0, pending: 0 };
            }
            result[dept].total += row._count._all;
            if (row.status === 'RESOLVED') {
                result[dept].resolved += row._count._all;
            } else {
                result[dept].pending += row._count._all;
            }
        }

        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const getHeatmap = async (req, res, next) => {
    try {
        const complaints = await prisma.complaint.findMany({
            select: {
                id: true,
                latitude: true,
                longitude: true,
                priority: true,
                category: true,
                status: true,
            },
        });

        res.json(complaints);
    } catch (err) {
        next(err);
    }
};

export const getTrends = async (req, res, next) => {
    try {
        const since = new Date();
        since.setDate(since.getDate() - 30);

        const complaints = await prisma.complaint.findMany({
            where: { createdAt: { gte: since } },
            select: { createdAt: true, category: true },
        });

        const result = {};
        for (const c of complaints) {
            const dateStr = c.createdAt.toISOString().slice(0, 10);
            const key = `${dateStr}__${c.category}`;
            result[key] = (result[key] ?? 0) + 1;
        }

        res.json(result);
    } catch (err) {
        next(err);
    }
};
