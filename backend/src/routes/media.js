const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const upload = require('../middleware/upload');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Protected routes (Admin/Sub-Admin)
router.get('/', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), mediaController.getMediaFiles);
router.post('/upload', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), upload.single('media'), mediaController.uploadMedia);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), mediaController.deleteMedia);

module.exports = router;
