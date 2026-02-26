import prisma from '../config/prisma.js';

export const getOverview = async (_req, res, next) => {
    try {
        const [total, open, inProgress, resolved, slaBreach] = await Promise.all([
            prisma.complaint.count(),
            prisma.complaint.count({ where: { status: { in: ['SUBMITTED', 'ASSIGNED'] } } }),
            prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.complaint.count({ where: { status: 'RESOLVED' } }),
            prisma.complaint.count({ where: { slaBreach: true } }),
        ]);

        res.json({ total, open, inProgress, resolved, slaBreach });
    } catch (err) {
        next(err);
    }
};

export const getDepartments = async (_req, res, next) => {
    try {
        const groups = await prisma.complaint.groupBy({
            by: ['department'],
            _count: { _all: true },
            where: {},
        });

        const output = await Promise.all(groups.map(async (g) => {
            const [resolved, pending, avgTimeResolvedMs, slaTotal, slaMet] = await Promise.all([
                prisma.complaint.count({ where: { department: g.department, status: 'RESOLVED' } }),
                prisma.complaint.count({ where: { department: g.department, status: { not: 'RESOLVED' } } }),
                prisma.$queryRaw`SELECT AVG(EXTRACT(EPOCH FROM ("updatedAt" - "createdAt"))) * 1000 as ms FROM "Complaint" WHERE department = ${g.department}::"Department" AND status = 'RESOLVED'`,
                prisma.complaint.count({ where: { department: g.department } }),
                prisma.complaint.count({ where: { department: g.department, slaBreach: false } }),
            ]);

            const avgTime = Number(avgTimeResolvedMs?.[0]?.ms || 0);
            const slaPercent = slaTotal ? Math.round((slaMet / slaTotal) * 100) : 0;
            return { department: g.department, resolved, pending, avgTime, slaPercent };
        }));

        res.json(output);
    } catch (err) {
        next(err);
    }
};

export const getHeatmap = async (_req, res, next) => {
    try {
        const complaints = await prisma.complaint.findMany({
            select: {
                latitude: true,
                longitude: true,
                finalPriority: true,
                category: true,
            },
        });

        res.json(complaints.map((c) => ({
            lat: c.latitude,
            lng: c.longitude,
            priority: c.finalPriority,
            category: c.category,
        })));
    } catch (err) {
        next(err);
    }
};

export const getTrends = async (_req, res, next) => {
    try {
        const since = new Date();
        since.setDate(since.getDate() - 30);

        const complaints = await prisma.complaint.findMany({
            where: { createdAt: { gte: since } },
            select: { createdAt: true, category: true },
            orderBy: { createdAt: 'asc' },
        });

        const result = {};
        for (const c of complaints) {
            const date = c.createdAt.toISOString().slice(0, 10);
            if (!result[date]) result[date] = {};
            result[date][c.category] = (result[date][c.category] || 0) + 1;
        }

        res.json(result);
    } catch (err) {
        next(err);
    }
};
