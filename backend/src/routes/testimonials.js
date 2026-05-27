const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Public
router.get('/', testimonialController.getTestimonials);

// Protected (Admin/Sub-Admin)
router.post('/', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), testimonialController.createTestimonial);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), testimonialController.updateTestimonial);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), testimonialController.deleteTestimonial);

module.exports = router;
