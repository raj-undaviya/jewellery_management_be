const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/products (Admin Only)
router.post('/', protect, adminOnly, productController.createProduct);

// GET /api/products
router.get('/', productController.getProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// PUT /api/products/:id (Admin Only)
router.put('/:id', protect, adminOnly, productController.updateProduct);

// DELETE /api/products/:id (Admin Only)
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

module.exports = router;
