const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Public
router.get('/', contentController.getAllContent);
router.get('/:key', contentController.getContentByKey);

// Protected (Admin/Sub-Admin)
router.put('/:key', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), contentController.updateContentByKey);

module.exports = router;
