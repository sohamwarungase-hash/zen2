import prisma from '../config/prisma.js';
import cloudinary from '../config/cloudinary.js';
import geminiService from '../services/geminiService.js';
import duplicateService from '../services/duplicateService.js';
import geoService from '../services/geoService.js';
import { getIO } from '../config/socket.js';
import logger from '../utils/logger.js';

const CATEGORY_MAP = {
    road: 'ROAD',
    roads: 'ROAD',
    water: 'WATER',
    electricity: 'OTHER',   // no ELECTRICITY enum in schema
    sanitation: 'SANITATION',
    garbage: 'GARBAGE',
    streetlight: 'STREETLIGHT',
    other: 'OTHER',
};

// SLA deadline calculator.
function calcSlaDeadline(priority) {
    const hours =
        priority >= 9 ? 6 :
            priority >= 7 ? 24 :
                priority >= 4 ? 48 : 72;
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}

// Ensure a Supabase-authed user has a matching Prisma User record.
async function syncUser(req) {
    await prisma.user.upsert({
        where: { id: req.user.id },
        create: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name || req.user.email,
            role: req.user.role ?? 'CITIZEN',
        },
        update: {},
    });
}

/**
 * POST /api/complaints — Submit a complaint
 */
export const createComplaint = async (req, res, next) => {
    try {
        logger.info('Creating complaint', { userId: req.user.id });

        const { title, description, latitude, longitude, address } = req.body;

        const lat = parseFloat(latitude) || 0;
        const lng = parseFloat(longitude) || 0;

        // ── Step 5: Upload image to Cloudinary if one was attached ────────
        let imageUrl = null;
        if (req.file) {
            const uploadResult = await cloudinary.uploadBuffer(
                req.file.buffer,
                req.file.mimetype
            );
            imageUrl = uploadResult.secure_url;
        }

        // ── Step 6: Classify with Gemini ──────────────────────────────────
        const geminiResult = await geminiService.classifyComplaint({
            description,
            imageUrl,
            latitude: lat,
            longitude: lng,
        });

        const category = CATEGORY_MAP[String(geminiResult.category).toLowerCase()] ?? 'OTHER';

        // ── Step 7: Duplicate detection ───────────────────────────────────
        const duplicate = await duplicateService.findDuplicate({
            category,
            latitude: lat,
            longitude: lng,
        });

        if (duplicate) {
            await prisma.complaint.update({
                where: { id: duplicate.id },
                data: { validationCount: { increment: 1 } },
            });

            await prisma.user.update({
                where: { id: req.user.id },
                data: { points: { increment: 5 } },
            });

            return res.status(200).json({ isDuplicate: true, complaint: duplicate });
        }

        // ── Step 8: Geo risk bonus ────────────────────────────────────────
        const geoBonus = await geoService.calculateGeoRisk(lat, lng);

        // ── Step 9: Final priority (capped at 10) ─────────────────────────
        const finalPriority = Math.min(10, geminiResult.priority + geoBonus);

        // ── Step 10: SLA deadline ─────────────────────────────────────────
        const slaDeadline = calcSlaDeadline(finalPriority);

        // ── Step 11: Persist ──────────────────────────────────────────────
        await syncUser(req);

        const complaint = await prisma.complaint.create({
            data: {
                title,
                description,
                category,
                priority: finalPriority,
                latitude: lat,
                longitude: lng,
                address: address ?? null,
                imageUrl,
                department: geminiResult.department,
                slaDeadline,
                isDuplicate: false,
                validationCount: 0,
                userId: req.user.id,
            },
        });

        // ── Step 12: Real-time notify ─────────────────────────────────────
        const socketIO = getIO();
        if (socketIO) {
            socketIO.to('admin-room').emit('new-complaint', complaint);
            socketIO.to(`dept-${complaint.department}`).emit('new-assignment', complaint);
        }

        return res.status(201).json({
            ...complaint,
            aiReasoning: geminiResult.reasoning,
        });
    } catch (err) {
        logger.error('POST /complaints error:', { error: err.message, stack: err.stack });
        next(err);
    }
};

/**
 * GET /api/complaints — Fetch complaints
 */
export const getComplaints = async (req, res, next) => {
    try {
        const { status, department, minPriority, maxPriority, search } = req.query;
        const isStaff = req.user.role === 'ADMIN' || req.user.role === 'DEPT_OFFICER';
        const where = {};

        if (isStaff) {
            if (status) where.status = status;
            if (department) where.department = department;
            if (minPriority || maxPriority) {
                where.priority = {};
                if (minPriority) where.priority.gte = Number(minPriority);
                if (maxPriority) where.priority.lte = Number(maxPriority);
            }
            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ];
            }
        } else {
            where.userId = req.user.id;
        }

        const complaints = await prisma.complaint.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        res.json(complaints);
    } catch (err) {
        logger.error('GET /complaints error:', { error: err.message, stack: err.stack });
        next(err);
    }
};

/**
 * GET /api/complaints/my
 */
export const getMyComplaints = async (req, res, next) => {
    try {
        const complaints = await prisma.complaint.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(complaints);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/complaints/:id
 */
export const getComplaintById = async (req, res, next) => {
    try {
        const complaint = await prisma.complaint.findUnique({
            where: { id: req.params.id },
            include: { user: { select: { name: true, email: true } } },
        });

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json(complaint);
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/complaints/:id/status
 */
export const updateComplaintStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const updated = await prisma.complaint.update({
            where: { id },
            data: { status },
        });

        const socketIO = getIO();
        if (socketIO) {
            socketIO.to(`complaint-${id}`).emit('complaint-updated', updated);
            socketIO.to('admin-room').emit('complaint-updated', updated);
        }

        res.json(updated);
    } catch (err) {
        logger.error('PATCH /complaints/:id/status error:', { error: err.message, stack: err.stack });
        next(err);
    }
};

/**
 * POST /api/complaints/:id/validate
 */
export const validateComplaint = async (req, res, next) => {
    try {
        const { id } = req.params;

        const complaint = await prisma.complaint.update({
            where: { id },
            data: { validationCount: { increment: 1 } },
        });

        await prisma.user.update({
            where: { id: req.user.id },
            data: { points: { increment: 5 } },
        });

        res.json({ complaint, pointsAwarded: 5 });
    } catch (err) {
        next(err);
    }
};
