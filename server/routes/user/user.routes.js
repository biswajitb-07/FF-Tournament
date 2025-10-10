import express from "express";
import passport from "passport";
import {
  login,
  logout,
  register,
  verifyOtp,
  resendOtp,
  googleAuth,
  getUserProfile,
  updateUserProfile,
  sendPasswordOtp,
  setPassword,
  saveWithdrawalMethod,
} from "../../controllers/user/user.controller.js";
import upload from "../../utils/multer.js";
import isAuthenticatedUser from "../../middleware/isAuthenticatedUser.js";

const userRouter = express.Router();

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuth
);

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp);
userRouter.get("/logout", logout);

userRouter.get("/profile", isAuthenticatedUser, getUserProfile);
userRouter.put(
  "/profile/update",
  isAuthenticatedUser,
  upload.single("photo"),
  updateUserProfile
);
userRouter.post("/send-password-otp", isAuthenticatedUser, sendPasswordOtp);
userRouter.post("/set-password", isAuthenticatedUser, setPassword);
userRouter.put("/wallet/withdrawal-method", isAuthenticatedUser, saveWithdrawalMethod);

export default userRouter;
