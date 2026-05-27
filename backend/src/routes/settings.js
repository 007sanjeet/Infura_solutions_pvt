const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const upload = require('../middleware/upload');
const {
  authenticate,
  authorizeRoles,
} = require('../middleware/auth');

// Public route
router.get('/', settingsController.getSettings);

// Admin/Sub Admin update
router.put(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'SUB_ADMIN'),
  upload.single('logo'),
  settingsController.updateSettings
);

module.exports = router;