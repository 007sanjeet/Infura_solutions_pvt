const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.get('/:id/similar', jobController.getSimilarJobs);

// Protected routes (Admin/Sub-Admin)
router.post('/', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), jobController.createJob);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), jobController.updateJob);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), jobController.deleteJob);

module.exports = router;
