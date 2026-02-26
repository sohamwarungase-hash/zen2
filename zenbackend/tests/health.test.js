import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Health Check API', () => {
    it('should return 200 OK and status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });

    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/unknown');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
    });
});
