const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);

// Admin account management (only ADMIN role can create, update, delete admins)
router.get('/admins', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), authController.getAdmins);
router.post('/admins', authenticate, authorizeRoles('ADMIN'), authController.createAdmin);
router.put('/admins/:id/role', authenticate, authorizeRoles('ADMIN'), authController.updateAdminRole);
router.delete('/admins/:id', authenticate, authorizeRoles('ADMIN'), authController.deleteAdmin);

module.exports = router;
