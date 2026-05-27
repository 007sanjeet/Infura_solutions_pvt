const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const upload = require('../middleware/upload');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Public banner list
router.get('/', bannerController.getBanners);

// Protected administration
router.post('/', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), upload.single('banner'), bannerController.createBanner);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), upload.single('banner'), bannerController.updateBanner);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), bannerController.deleteBanner);

module.exports = router;
