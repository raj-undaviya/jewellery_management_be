const Cart = require('../models/Cart');

// Get user cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) {
            cart = await Cart.create({ userId: req.user.id, items: [] });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [{ productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
            if (itemIndex > -1) {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            } else {
                cart.items.push({ productId, quantity });
            }
        }
        await cart.save();
        cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        return res.status(201).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        let cart = await Cart.findOne({ userId: req.user.id });
        if (cart) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await cart.save();
            cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
            return res.json(cart);
        }
        res.status(404).json({ message: 'Cart not found' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update item quantity
exports.updateItemQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (cart) {
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
            if (itemIndex > -1) {
                if (quantity <= 0) {
                    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
                } else {
                    cart.items[itemIndex].quantity = quantity;
                }
                await cart.save();
                cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
                return res.json(cart);
            }
            return res.status(404).json({ message: 'Item not in cart' });
        }
        res.status(404).json({ message: 'Cart not found' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
