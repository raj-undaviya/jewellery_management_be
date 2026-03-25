const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addItemToCart);
router.put('/update', protect, cartController.updateItemQuantity);
router.delete('/remove/:productId', protect, cartController.removeItemFromCart);

module.exports = router;
