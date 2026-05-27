const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Public endpoints
router.post('/message', contactController.submitContactMessage);
router.post('/subscribe', contactController.subscribeNewsletter);

// Protected endpoints (Admin/Sub-Admin)
router.get('/messages', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), contactController.getContactMessages);
router.put('/messages/:id/resolve', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), contactController.resolveMessage);
router.get('/subscribers', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), contactController.getSubscribers);

module.exports = router;
