const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Public
router.get('/', categoryController.getCategories);

// Protected (Admin/Sub-Admin)
router.post('/', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), categoryController.createCategory);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), categoryController.updateCategory);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN'), categoryController.deleteCategory);

module.exports = router;
