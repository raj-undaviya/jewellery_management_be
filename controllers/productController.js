const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, categoryId, price, weight, metalType, purity, description, stock, images } = req.body;

        // Create product
        const product = new Product({
            name, categoryId, price, weight, metalType, purity, description, stock
        });
        await product.save();

        // Create related images
        if (images && images.length > 0) {
            const productImages = images.map(imgUrl => ({
                productId: product._id,
                imageUrl: imgUrl
            }));
            await ProductImage.insertMany(productImages);
        }

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all products based on query parameters
exports.getProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice, metalType } = req.query;
        let queryObj = {};

        if (keyword) {
            queryObj.name = { $regex: keyword, $options: 'i' };
        }
        if (category) {
            queryObj.categoryId = category;
        }
        if (minPrice || maxPrice) {
            queryObj.price = {};
            if (minPrice) queryObj.price.$gte = Number(minPrice);
            if (maxPrice) queryObj.price.$lte = Number(maxPrice);
        }
        if (metalType) {
            const metals = metalType.split(',');
            queryObj.metalType = { $in: metals.map(m => new RegExp(m, 'i')) };
        }

        const products = await Product.find(queryObj).populate('categoryId', 'name');

        // Fetch images for all products
        const productsWithImages = await Promise.all(products.map(async (product) => {
            const images = await ProductImage.find({ productId: product._id });
            return { ...product._doc, images: images.map(img => img.imageUrl) };
        }));

        res.json(productsWithImages);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get product details (including images)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const images = await ProductImage.find({ productId: product._id });
        res.json({ ...product._doc, images: images.map(img => img.imageUrl) });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Delete associated images
        await ProductImage.deleteMany({ productId: req.params.id });

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
