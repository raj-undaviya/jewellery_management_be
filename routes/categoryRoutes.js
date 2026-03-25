const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   POST /api/categories
router.post('/', protect, adminOnly, categoryController.createCategory);

// @route   GET /api/categories
router.get('/', categoryController.getCategories);

// @route   PUT /api/categories/:id
router.put('/:id', protect, adminOnly, categoryController.updateCategory);

// @route   DELETE /api/categories/:id
router.delete('/:id', protect, adminOnly, categoryController.deleteCategory);

module.exports = router;
