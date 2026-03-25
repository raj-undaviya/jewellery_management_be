const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   POST /api/orders
router.post('/', protect, orderController.createOrder);

// @route   GET /api/orders/myorders
router.get('/myorders', protect, orderController.getUserOrders);

// @route   GET /api/orders (Admin Only)
router.get('/', protect, adminOnly, orderController.getAllOrders);

// @route   PUT /api/orders/:id/status (Admin Only)
router.put('/:id/status', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
