const Wishlist = require('../models/Wishlist');

// Get User Wishlist
exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.user.id }).populate('productId');
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlistItem = await Wishlist.findOne({ userId: req.user.id, productId });

        if (wishlistItem) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        wishlistItem = new Wishlist({ userId: req.user.id, productId });
        await wishlistItem.save();

        res.status(201).json(wishlistItem);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        await Wishlist.findOneAndDelete({ userId: req.user.id, productId });
        res.json({ message: 'Product removed from wishlist' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
