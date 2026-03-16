import jwt from "jsonwebtoken";
import { User } from "../Model/User.model.js";
import { asyncHadler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const tokenVerify = asyncHadler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    const user = await User.findById(decoded._id).select("-password -token -otp -otpExpiry");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();

})

const adminVerify = asyncHadler(async (req, res, next) => {
    if (req.user.role !== "Admin") {
        throw new ApiError(401, "Unauthorized");
    }
    next();
});

const customerVerify = asyncHadler(async (req, res, next) => {
    if (req.user.role !== "Customer") {
        throw new ApiError(401, "Unauthorized");
    }
    next();
})

export { tokenVerify, adminVerify, customerVerify }
