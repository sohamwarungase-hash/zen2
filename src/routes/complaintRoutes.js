const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const upload = require('../middleware/upload');
const validate = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');
const { complaintSchema } = require('../models/schemas/complaintSchema');

/**
 * @route   POST /api/complaints
 * @desc    Accepts multipart/form-data for citizen complaint intake
 * @access  Protected — requires a valid Neon Auth JWT
 */
router.post(
    '/',
    authMiddleware,               // Verify JWT via Neon Auth JWKS
    upload.single('photo'),       // processes multipart/form-data with 'photo' field
    validate(complaintSchema),    // validates body fields
    complaintController.createComplaint
);

module.exports = router;
