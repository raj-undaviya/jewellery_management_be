const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');

// Place new order
exports.createOrder = async (req, res) => {
    try {
        // 1. Get user cart
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // 2. Calculate total amount
        let subtotal = 0;
        cart.items.forEach(item => {
            subtotal += item.productId.price * item.quantity;
        });
        const tax = subtotal * 0.08;
        const totalAmount = subtotal + tax;

        const { shippingAddress } = req.body;

        // 3. Create Order record
        const order = new Order({
            userId: req.user.id,
            shippingAddress,
            totalAmount
        });
        await order.save();

        // 4. Create OrderItems records
        const orderItems = cart.items.map(item => ({
            orderId: order._id,
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price
        }));
        await OrderItem.insertMany(orderItems);

        // 5. Clear cart after order is placed
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get user orders (Order History)
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        // Note: To get full details we could also fetch associated OrderItems
        // For MVP we just return the order headers
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
