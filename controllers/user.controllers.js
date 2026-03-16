import * as userServices from "../services/user.services.js"
import { asyncHadler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const userRegisterController = asyncHadler(async (req, res) => {

    const result = await userServices.userRegisterService(req.body);

    const message = result.type === "register" ? "User Register Successfull" : "User Login Successfull";
    return res.json(
        new ApiResponse(200, message, result)
    )
});

const getAllUserController = asyncHadler(async (req, res) => {
    const result = await userServices.getAllUser(req.query);

    return res.json(
        new ApiResponse(200, " Get all user", result,)
    )
})

const verifyOtpController = asyncHadler(async (req, res) => {
    const { email, otp } = req.body;

    const result = await userServices.verifyOtpService({ email, otp });

    const { user, accessToken, refreshToken } = result;

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(
        new ApiResponse(200, "User Login Successfull", { user, accessToken, refreshToken })
    )
});

const forgetPasswordController = asyncHadler(async (req, res) => {
    const result = await userServices.forgetPassword(req.body);

    return res.json(
        new ApiResponse(200, "Forget Password Successfull", result)
    )
});

const resetPasswordController = asyncHadler(async (req, res) => {
    const result = await userServices.resetPassword(req.body);

    return res.json(
        new ApiResponse(200, "Reset Password Successfull", result)
    )
});

const getAllUserByIdController = asyncHadler(async (req, res) => {
    const result = await userServices.getAllUserById(req.body);

    return res.json(
        new ApiResponse(200, "Get all user by id", result)
    )
})
const updateUserController = asyncHadler(async (req, res) => {

    const result = await userServices.updateUserervice({
        id: req.params.id,
        ...req.body
    });

    return res.json(
        new ApiResponse(200, "Update user successfully", result)
    );
});

const deleteUserCotroller = asyncHadler(async (req, res) => {
    const result = await userServices.deleteUserService({
        _id: req.params.id
    });

    return res.json(
        new ApiResponse(200, "Delete user successfully")
    )
})
export { userRegisterController, verifyOtpController, forgetPasswordController, getAllUserController, resetPasswordController, updateUserController, deleteUserCotroller, getAllUserByIdController }