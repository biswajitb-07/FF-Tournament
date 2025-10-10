import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpireAt: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  type: {
    type: String,
    enum: ["registration", "login_verification", "password_change"],
    required: true,
  },
});

export const TempUser = mongoose.model("TempUser", tempUserSchema);
