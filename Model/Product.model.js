import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subCategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory"
    },
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number
    },
    quntity: {
        type: Number
    },
    product_image_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_images"
    },
    payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment"
    }
}, {
    timestamps: true
})

export const Product = mongoose.model("Product", productSchema);



