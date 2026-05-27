const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/applicationController');
const upload = require('../middleware/upload');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/auth');

// ---------------- PUBLIC ROUTE ---------------- //

// Apply for job (upload resume)
router.post(
  '/apply',
  upload.single('resume'),
  applicationController.apply
);

// ---------------- ADMIN ROUTES ---------------- //

// Get all applications
router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'SUB_ADMIN'),
  applicationController.getApplications
);

// Update application status
router.put(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN', 'SUB_ADMIN'),
  applicationController.updateApplicationStatus
);

// Download resume
router.get(
  '/:id/download-resume',
  applicationController.downloadResume
);

module.exports = router;