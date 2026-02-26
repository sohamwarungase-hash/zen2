import { z } from 'zod';

const VALID_STATUSES = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED'];

const complaintBodySchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    latitude: z
        .string()
        .refine((v) => !isNaN(parseFloat(v)), { message: 'latitude must be a valid number' }),
    longitude: z
        .string()
        .refine((v) => !isNaN(parseFloat(v)), { message: 'longitude must be a valid number' }),
    address: z.string().optional(),
    source: z.enum(['MOBILE', 'WEB']).optional(),
});

const statusUpdateSchema = z.object({
    status: z.enum(VALID_STATUSES, {
        errorMap: () => ({
            message: `status must be one of: ${VALID_STATUSES.join(', ')}`,
        }),
    }),
    note: z.string().max(500).optional(),
});

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const details = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] || 'unknown';
                details[field] = details[field] ?? [];
                details[field].push(issue.message);
            }
            return res.status(400).json({ error: 'Validation failed', details });
        }

        req.body = result.data;
        next();
    };
}

export const validateComplaintBody = validateBody(complaintBodySchema);
export const validateStatusUpdate = validateBody(statusUpdateSchema);
export const validateRegisterBody = validateBody(registerSchema);
export const validateLoginBody = validateBody(loginSchema);
