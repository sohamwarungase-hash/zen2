import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import usersRouter from '../src/routes/users.js';

// Mock Dependencies
vi.mock('../src/config/prisma.js', () => ({
    default: {
        user: {
            upsert: vi.fn(),
        },
    },
}));

vi.mock('../src/middleware/auth.js', () => ({
    auth: (req, res, next) => {
        req.user = { id: 'test-user-id', email: 'test@example.com', role: 'CITIZEN' };
        next();
    },
}));

describe('Users Route', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/users', usersRouter);
        vi.clearAllMocks();
    });

    it('GET /api/users/profile should return user data', async () => {
        const mockUser = {
            id: 'test-user-id',
            email: 'test@example.com',
            name: 'test',
            role: 'CITIZEN',
            points: 10,
        };

        const prisma = (await import('../src/config/prisma.js')).default;
        prisma.user.upsert.mockResolvedValue(mockUser);

        const res = await request(app).get('/api/users/profile');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUser);
        expect(prisma.user.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 'test-user-id' }
        }));
    });

    it('GET /api/users/profile should handle errors', async () => {
        const prisma = (await import('../src/config/prisma.js')).default;
        prisma.user.upsert.mockRejectedValue(new Error('DB Error'));

        const res = await request(app).get('/api/users/profile');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Failed to fetch profile' });
    });
});
