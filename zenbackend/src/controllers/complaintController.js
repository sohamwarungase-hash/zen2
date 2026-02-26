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
    electricity: 'OTHER',
    sanitation: 'SANITATION',
    garbage: 'GARBAGE',
    streetlight: 'STREETLIGHT',
    other: 'OTHER',
};

function calcSlaDeadline(priority) {
    const hours = priority >= 9 ? 6 : priority >= 7 ? 24 : priority >= 4 ? 48 : 72;
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}

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

export const createComplaint = async (req, res, next) => {
    try {
        const { title, description, latitude, longitude, address, source } = req.body;
        const lat = parseFloat(latitude) || 0;
        const lng = parseFloat(longitude) || 0;

        let photoUrl = null;
        if (req.file) {
            const uploadResult = await cloudinary.uploadBuffer(req.file.buffer, req.file.mimetype);
            photoUrl = uploadResult.secure_url;
        }

        const geminiResult = await geminiService.classifyComplaint({
            description,
            imageUrl: photoUrl,
            latitude: lat,
            longitude: lng,
        });

        const category = CATEGORY_MAP[String(geminiResult.category).toLowerCase()] ?? 'OTHER';

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

        const geoRiskBonus = await geoService.calculateGeoRisk(lat, lng);
        const finalPriority = Math.min(10, geminiResult.priority + geoRiskBonus);
        const slaDeadline = calcSlaDeadline(finalPriority);

        await syncUser(req);

        const complaint = await prisma.complaint.create({
            data: {
                title,
                description,
                category,
                priority: geminiResult.priority,
                geoRiskBonus,
                finalPriority,
                latitude: lat,
                longitude: lng,
                address: address ?? null,
                photoUrl,
                department: geminiResult.department,
                slaDeadline,
                aiReasoning: geminiResult.reasoning,
                source: source ?? 'MOBILE',
                citizenId: req.user.id,
            },
            include: { statusHistory: true },
        });

        await prisma.statusHistory.create({
            data: {
                complaintId: complaint.id,
                status: complaint.status,
                changedBy: req.user.id,
                note: 'Complaint submitted',
            },
        });

        const socketIO = getIO();
        if (socketIO) {
            socketIO.to('admin-room').emit('new-complaint', complaint);
            socketIO.to(`dept-${complaint.department}`).emit('new-complaint', complaint);
        }

        return res.status(201).json(complaint);
    } catch (err) {
        logger.error('POST /complaints error:', { error: err.message, stack: err.stack });
        next(err);
    }
};

export const getComplaints = async (req, res, next) => {
    try {
        const { status, category, department, priority, from, to } = req.query;
        const isStaff = req.user.role === 'ADMIN' || req.user.role === 'DEPT_OFFICER';
        const where = {};

        if (isStaff) {
            if (status) where.status = status;
            if (category) where.category = category;
            if (department) where.department = department;
            if (priority) where.finalPriority = Number(priority);
            if (from || to) {
                where.createdAt = {};
                if (from) where.createdAt.gte = new Date(from);
                if (to) where.createdAt.lte = new Date(to);
            }
        } else {
            where.citizenId = req.user.id;
        }

        const complaints = await prisma.complaint.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        res.json(complaints);
    } catch (err) {
        next(err);
    }
};

export const getMyComplaints = async (req, res, next) => {
    try {
        const complaints = await prisma.complaint.findMany({
            where: { citizenId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(complaints);
    } catch (err) {
        next(err);
    }
};

export const getComplaintById = async (req, res, next) => {
    try {
        const complaint = await prisma.complaint.findUnique({
            where: { id: req.params.id },
            include: {
                citizen: { select: { name: true, email: true } },
                statusHistory: { orderBy: { createdAt: 'asc' } },
            },
        });

        if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
        res.json(complaint);
    } catch (err) {
        next(err);
    }
};

export const updateComplaintStatus = async (req, res, next) => {
    try {
        const { status, note } = req.body;
        const { id } = req.params;

        const updated = await prisma.complaint.update({
            where: { id },
            data: {
                status,
                ...(status === 'ESCALATED' ? { slaBreach: true } : {}),
            },
        });

        await prisma.statusHistory.create({
            data: {
                complaintId: id,
                status,
                changedBy: req.user.id,
                note: note ?? null,
            },
        });

        const socketIO = getIO();
        if (socketIO) {
            socketIO.to(`complaint-${id}`).emit('complaint-updated', updated);
            if (status === 'ASSIGNED') {
                socketIO.to(`dept-${updated.department}`).emit('new-assignment', updated);
            }
        }

        res.json(updated);
    } catch (err) {
        next(err);
    }
};

export const validateComplaint = async (req, res, next) => {
    try {
        const complaintId = req.params.id;

        await prisma.validation.create({
            data: {
                complaintId,
                citizenId: req.user.id,
            },
        });

        const complaint = await prisma.complaint.update({
            where: { id: complaintId },
            data: { validationCount: { increment: 1 } },
        });

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { points: { increment: 5 } },
            select: { points: true },
        });

        res.json({ complaint, pointsAwarded: 5, points: user.points });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'You have already validated this complaint' });
        }
        next(err);
    }
};
