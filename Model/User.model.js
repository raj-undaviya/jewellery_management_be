import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

export const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    token: { type: String, default: "" },
    otp: { type: String, default: "" },
    otpExpiry: { type: Date },
    is_staff: { type: Boolean, default: false },
    role: { type: String, enum: ["Customer", "Admin"], default: "Customer" }
});

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.ACCESS_TOKEN,
        {
            expiresIn: "20min"
        }

    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN,
        {
            expiresIn: "1d"
        }

    )
}

export const User = mongoose.model("User", userSchema);

// http://localhost:8000/api/users/auth