import { category } from "../Model/Category.model.js";
import { ApiError } from "../utils/apiError.js";

const createCategory = async (data) => {
    try {
        const { category_name, description } = data;
        if (!category_name || !description) {
            throw new ApiError(400, "All fields are required");
        }
        const category_data = await category.create({
            category_name,
            description
        });
        return category_data;

    } catch (error) {
        throw new ApiError(500, "Something went wrong", error.message);
    }
}

const getAllCategory = async (data) => {
    try {
        const category_data = await category.find(data);
        return category_data;
    } catch (error) {
        throw new ApiError(505, "Something went wrong", error.message);

    }
}


export { createCategory, getAllCategory };