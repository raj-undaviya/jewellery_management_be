import express from 'express';
import { deleteUserCotroller, forgetPasswordController, getAllUserByIdController, getAllUserController, resetPasswordController, updateUserController, userRegisterController, verifyOtpController } from '../controllers/user.controllers.js';
import { adminVerify, tokenVerify } from '../Middleware/auth.middleware.js';


const router = express.Router();

//@api
//desc: user signup
//method : POST
//endpoint : /api/user/auth
router.post("/auth", userRegisterController);

//@api
//desc: user forget password
//method : POST
//endpoint : /api/user/auth/forget-password
router.post("/auth/forget-password", forgetPasswordController);

//@api
//desc: user verify otp
//method : POST
//endpoint : /api/user/auth/verify-otp
router.post('/auth/verify-otp', verifyOtpController);

//@api
//desc: user reset password
//method : POST
//endpoint : /api/user/auth/reset-password
router.post("/auth/reset-password", resetPasswordController);

//@api
//desc: user get all user
//method : GET
//endpoint : /api/user/auth/
router.get("/auth/", getAllUserController);

//@api
//desc: user get all user by id
//method : GET
//endpoint : /api/user/auth/:id
router.get("/auth/:id", getAllUserByIdController);

//@api
//desc: update user 
//method : PUT
//endpoint : /api/user/auth/update/:id
router.put("/auth/update/:id", tokenVerify, adminVerify, updateUserController);

//@api
//desc: delete user
//method : DELETE
//endpoint : /api/user/auth/delete/:id
router.delete("/auth/delete/:id", tokenVerify, adminVerify, deleteUserCotroller);


export default router;