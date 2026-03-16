import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    }
},
    {
        timestamps: true
    }
)

export const category = mongoose.model("Category", categorySchema);

const subCategorySchema = new mongoose.Schema({
    subCategory_name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
},
    {
        timestamps: true
    }
)

export const subCategory = mongoose.model("Sub_Category", subCategorySchema)