const { z } = require('zod');

/**
 * Zod Schema for Complaint Intake
 * Validates fields from multipart/form-data
 */
const complaintSchema = z.object({
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
    category: z.string().min(1),
    latitude: z.string().transform((val) => parseFloat(val)), // Multi-part sends strings
    longitude: z.string().transform((val) => parseFloat(val)),
    user_id: z.string().uuid('user_id must be a valid UUID')
});

module.exports = {
    complaintSchema
};
