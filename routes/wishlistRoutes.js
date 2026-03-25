const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/wishlist
router.get('/', protect, wishlistController.getWishlist);

// @route   POST /api/wishlist
router.post('/', protect, wishlistController.addToWishlist);

// @route   DELETE /api/wishlist/:productId
router.delete('/:productId', protect, wishlistController.removeFromWishlist);

module.exports = router;
