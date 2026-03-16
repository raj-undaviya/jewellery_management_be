import { User } from "../Model/User.model.js"
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js"
import { ApiError } from "../utils/apiError.js";
import { mongooseAggregateFunction } from "../utils/aggregateFunction.js";

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.token = refreshToken;
    await user.save();

    return { accessToken, refreshToken };

};

const userRegisterService = async (data) => {

    const { first_name, last_name, username, password, phonenumber, email, role } = data;

    if (first_name && last_name && username && password && phonenumber && email && role) {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            throw new ApiError(409, "User already exists");
        }

        const hashPassword = await bcrypt.hash(password, 10);
        data.password = hashPassword;

        const otp_code = Math.floor(1000000 + Math.random() * 9000000);
        const hashOtp = await bcrypt.hash(otp_code.toString(), 10);
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        await User.create({ first_name, last_name, username, password: hashPassword, phonenumber, email, otp: hashOtp, otpExpiry, role });

        const user = await User.findOne({ email }).select("-password -otp -otpExpiry -token");

        const emailSend = await sendEmail(
            email,
            "User Registration Otp",
            `You otp for user registration is ${otp_code}. And Is Valid for 10 minutes`
        )

        return {
            type: "register",
            user,
            emailSend,
            message: "Otp is send to email for user registration"
        }
    }

    else {
        const { email, password } = data;
        if (email && password) {
            const user = await User.findOne({ email });
            if (!user) {
                throw new ApiError(404, "User not found");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new ApiError(401, "Invalid password");
            }

            await user.save();
            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

            const logUser = await User.findById(user._id)
                .select("-password -token -otp -otpExpiry");

            return {
                type: "login",
                user: logUser,
                accessToken,
                refreshToken
            }
        }
    }
}

const verifyOtpService = async (data) => {
    const { email, otp } = data;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.otpExpiry < Date.now()) {
        throw new ApiError(404, "otp expiry");
    }

    const matchOtp = await bcrypt.compare(otp.toString(), user.otp);
    if (!matchOtp) {
        throw new ApiError(404, "Otp is not match");
    }

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const logUser = await User.findById(user._id)
        .select("-password -token");

    return {
        user: logUser,
        accessToken,
        refreshToken
    }
}

const forgetPassword = async (data) => {
    const { email } = data

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const otp_code = Math.floor(100000 + Math.random() * 900000);
    const hashOtp = await bcrypt.hash(otp_code.toString(), 10);
    const expirtyOtp = Date.now() + 10 * 60 * 1000;

    user.otp = hashOtp;
    user.otpExpiry = expirtyOtp;

    await user.save();
    const emailSend = await sendEmail(
        email,
        "Password Reset Otp",
        `You otp for password resent OTP is ${otp_code}. And Is Valid for 10 minutes`
    )

    return {
        emailSend,
        message: "Otp is send to email for forget password"
    }
}

const resetPassword = async (data) => {
    const { email, otp, password } = data

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.otpExpiry < Date.now()) {
        throw new ApiError(404, "otp expiry")
    }

    const matchOtp = await bcrypt.compare(otp.toString(), user.otp);
    if (!matchOtp) {
        throw new ApiError(404, "Otp is not match")
    }

    user.password = await bcrypt.hash(password, 10);

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return {
        message: "Password reset successfully"
    }
}

const getAllUser = async (data) => {
    try {
        const user_data = await mongooseAggregateFunction(
            User,
            data,
            ["_id", "first_name", "last_name", "username", "email", "phonenumber", "role"],
            {},
            [],
            {},
            { created_at: -1 }
        );
        return user_data;
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong", error.message);

    }
}

const getAllUserById = async (data) => {
    try {
        const { id } = data;
        const user_data = await mongooseAggregateFunction(
            User,
            data,
            ["_id", "first_name", "last_name", "username", "email", "phonenumber", "role"],
            { _id: id },
            [],
            {},
            { created_at: -1 }
        );
        return user_data;
    } catch (error) {
        throw new ApiError(500, "Something went wrong", error.message);
    }
}

const updateUserervice = async (data) => {
    try {
        const { id, ...rest } = data;
        const user = await User.findByIdAndUpdate(id, rest, {
            returnDocument: "after",
            runValidators: true
        });

        return user;
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong", error.message);
    }
}

const deleteUserService = async (_id) => {
    try {
        const user = await User.findByIdAndDelete(_id);
        return user;
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong", error.message)
    }
}


export { generateAccessAndRefreshToken, userRegisterService, verifyOtpService, forgetPassword, resetPassword, getAllUser, updateUserervice, deleteUserService, getAllUserById }