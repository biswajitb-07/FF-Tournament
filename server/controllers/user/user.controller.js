import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken.js";
import { registerSchema, loginSchema } from "../../validation/validation.js";
import transporter from "../../utils/nodemailer.js";
import crypto from "crypto";
import { User } from "../../models/user/user.model.js";
import { TempUser } from "../../models/user/tempUser.model.js";
import jwt from "jsonwebtoken";
import {
  deleteMediaFromCloudinary,
  uploadMedia,
} from "../../utils/cloudinary.js";

export const googleAuth = async (req, res) => {
  try {
    if (!req.user) throw new Error("No user returned from Google");

    const freshUser = await User.findById(req.user._id);
    if (!freshUser) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/?google=error&message=User%20not%20found`
      );
    }

    if (freshUser.isBlocked) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?google=error&message=Your%20account%20has%20been%20blocked.%20Contact%20support.`
      );
    }

    freshUser.lastLoginAt = new Date();
    await freshUser.save();

    const token = jwt.sign({ userId: freshUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?google=error&message=Google%20login%20failed`
    );
  }
};

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.safeParse(req.body);
    if (!validatedData.success) {
      const fieldErrors = validatedData.error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {});
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: fieldErrors,
      });
    }

    const { username, email, password } = validatedData.data;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists, please login now",
      });
    }

    const existedTempUser = await TempUser.findOne({ email });
    if (existedTempUser) {
      await TempUser.deleteOne({ email });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpireAt = new Date(Date.now() + 15 * 60 * 1000);

    const user = await User.find({ username });
    if (user != "") {
      return res.status(400).json({
        success: false,
        message: "username already available",
      });
    }

    const newTempUser = new TempUser({
      username,
      email,
      password: hashPassword,
      otp,
      otpExpireAt,
      type: "registration",
    });

    await newTempUser.save();

    const mailOption = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "🎮 Complete Your Gamer Pulse Registration",
      html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Complete Registration - Gamer Pulse</title>
      </head>
      <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);min-height:100vh;">
          <tr>
            <td align="center" style="padding:40px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#000000;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(255,140,0,0.2);border:2px solid #ff8c00;">
                <!-- Header Section -->
                <tr>
                  <td style="background:linear-gradient(135deg, #ff8c00 0%, #ff6600 100%);padding:40px 30px;text-align:center;position:relative;">
                    <div style="display:inline-block;background:rgba(0,0,0,0.2);border-radius:12px;padding:15px 25px;margin-bottom:20px;">
                      <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:bold;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                        🎮 GAMER PULSE
                      </h1>
                    </div>
                    <h2 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;text-shadow:1px 1px 2px rgba(0,0,0,0.3);">
                      Complete Your Registration
                    </h2>
                    <div style="position:absolute;top:10px;right:10px;width:40px;height:40px;background:rgba(255,255,255,0.1);border-radius:50%;"></div>
                    <div style="position:absolute;bottom:10px;left:10px;width:30px;height:30px;background:rgba(255,255,255,0.1);border-radius:50%;"></div>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="background:#000000;padding:40px 30px;">
                    <div style="border-left:4px solid #ff8c00;padding-left:20px;margin-bottom:30px;">
                      <p style="font-size:20px;color:#ff8c00;line-height:28px;margin:0;font-weight:600;">
                        Welcome, ${username}! 🎯
                      </p>
                    </div>
                    
                    <p style="font-size:16px;color:#e0e0e0;line-height:26px;margin:0 0 30px;">
                      You're just one step away from joining the ultimate gaming community. Use the verification code below to activate your account and start your gaming journey with us!
                    </p>
                    
                    <!-- OTP Section -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                      <tr>
                        <td align="center">
                          <div style="background:linear-gradient(135deg, #ff8c00 0%, #ff6600 100%);border-radius:12px;padding:4px;margin:20px 0;">
                            <div style="background:#000000;border-radius:8px;padding:25px 35px;text-align:center;">
                              <p style="color:#ff8c00;font-size:14px;font-weight:600;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px;">
                                Your Verification Code
                              </p>
                              <span style="display:inline-block;background:linear-gradient(135deg, #ff8c00 0%, #ff6600 100%);color:#000000;font-size:36px;font-weight:bold;padding:15px 30px;border-radius:8px;letter-spacing:6px;text-shadow:none;font-family:monospace;">
                                ${otp}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Info Box -->
                    <div style="background:#1a1a1a;border:2px solid #ff8c00;border-radius:8px;padding:20px;margin:30px 0;">
                      <div style="display:flex;align-items:center;margin-bottom:10px;">
                        <span style="color:#ff8c00;font-size:18px;margin-right:10px;">⏰</span>
                        <p style="font-size:16px;color:#ff8c00;line-height:24px;margin:0;font-weight:600;">
                          Important Information
                        </p>
                      </div>
                      <p style="font-size:14px;color:#cccccc;line-height:22px;margin:10px 0 0;padding-left:28px;">
                        This verification code expires in <strong style="color:#ff8c00;">15 minutes</strong>. Your gaming account will be activated immediately after successful verification.
                      </p>
                    </div>
                    
                    <!-- Gaming Elements -->
                    <div style="text-align:center;margin:30px 0;">
                      <div style="display:inline-block;background:#1a1a1a;border:1px solid #ff8c00;border-radius:20px;padding:10px 20px;">
                        <span style="color:#ff8c00;font-size:14px;font-weight:600;">🏆 Level Up Your Gaming Experience 🎮</span>
                      </div>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background:#1a1a1a;padding:25px 30px;text-align:center;border-top:2px solid #ff8c00;">
                    <p style="font-size:14px;color:#888888;margin:0 0 15px;line-height:22px;">
                      Need assistance? Our support team is here to help!
                    </p>
                    <a href="mailto:support@gamerpulse.com" style="color:#ff8c00;text-decoration:none;font-weight:600;font-size:14px;padding:8px 20px;border:2px solid #ff8c00;border-radius:25px;display:inline-block;transition:all 0.3s ease;">
                      📧 Contact Support
                    </a>
                    <div style="margin-top:20px;padding-top:15px;border-top:1px solid #333333;">
                      <p style="font-size:12px;color:#666666;margin:0;">
                        © 2024 Gamer Pulse. All rights reserved.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Decorative Gaming Icons -->
              <div style="text-align:center;margin-top:20px;opacity:0.6;">
                <span style="color:#ff8c00;font-size:20px;margin:0 10px;">🎮</span>
                <span style="color:#ff8c00;font-size:20px;margin:0 10px;">🕹️</span>
                <span style="color:#ff8c00;font-size:20px;margin:0 10px;">🎯</span>
                <span style="color:#ff8c00;font-size:20px;margin:0 10px;">🏆</span>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOption);

    return res.status(200).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
      requiresVerification: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.safeParse(req.body);
    if (!validatedData.success) {
      const fieldErrors = validatedData.error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {});
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: fieldErrors,
      });
    }

    const { email, password } = validatedData.data;

    const tempUser = await TempUser.findOne({ email, type: "registration" });
    if (tempUser) {
      return res.status(403).json({
        success: false,
        message:
          "Please complete your registration by verifying the OTP sent to your email.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    return generateToken(res, user, "Login successful", 200);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({
        success: false,
        message: "No pending OTP found for this email",
      });
    }

    if (tempUser.otp !== otp || tempUser.otpExpireAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (tempUser.type === "registration") {
      const newUser = new User({
        username: tempUser.username,
        email: tempUser.email,
        password: tempUser.password,
        isVerified: true,
      });

      await newUser.save();

      await TempUser.deleteOne({ _id: tempUser._id });

      return generateToken(
        res,
        newUser,
        "Registration completed successfully. Welcome!",
        201
      );
    }

    if (tempUser.type === "login_verification") {
      const user = await User.findById(tempUser.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.isVerified = true;
      await user.save();

      await TempUser.deleteOne({ _id: tempUser._id });

      return generateToken(
        res,
        user,
        "Email verified successfully. You are now logged in.",
        200
      );
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP type",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({
        success: false,
        message: "No pending OTP found for this email",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpireAt = new Date(Date.now() + 15 * 60 * 1000);

    tempUser.otp = otp;
    tempUser.otpExpireAt = otpExpireAt;
    await tempUser.save();

    let username = tempUser.username || "";
    let subject = "";
    let htmlContent = "";

    if (tempUser.type === "registration") {
      username = tempUser.username;
      subject = "🔐 Complete Your Registration (Resend)";
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Complete Registration</title>
          </head>
          <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f7f7f7;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;">
              <tr>
                <td align="center" style="padding:40px 10px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">
                    <tr>
                      <td style="background:#f59e0b;padding:24px 30px;text-align:center;color:#ffffff;font-size:22px;font-weight:bold;">
                        Complete Your Registration
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;">
                        <p style="font-size:16px;color:#333333;line-height:24px;margin:0 0 20px;">
                          Hi ${username},
                        </p>
                        <p style="font-size:16px;color:#333333;line-height:24px;margin:0 0 20px;">
                          Here is your new OTP to complete registration:
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding:20px 0;">
                              <span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:28px;font-weight:bold;padding:12px 24px;border-radius:6px;letter-spacing:4px;">
                                ${otp}
                              </span>
                            </td>
                          </tr>
                        </table>
                        <p style="font-size:14px;color:#666666;line-height:22px;margin:0 0 10px;">
                          This OTP is valid for <strong>15 minutes</strong>.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#f3f4f6;padding:20px 30px;text-align:center;font-size:12px;color:#888888;">
                        Need help? <a href="mailto:support@yourapp.com" style="color:#f59e0b;text-decoration:none;">Contact Support</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    } else if (tempUser.type === "login_verification") {
      const user = await User.findById(tempUser.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      username = user.username;
      subject = "🔐 Verify Your Email to Login (Resend)";
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verify Email to Login</title>
          </head>
          <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f7f7f7;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;">
              <tr>
                <td align="center" style="padding:40px 10px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">
                    <tr>
                      <td style="background:#f59e0b;padding:24px 30px;text-align:center;color:#ffffff;font-size:22px;font-weight:bold;">
                        Verify Email to Login
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;">
                        <p style="font-size:16px;color:#333333;line-height:24px;margin:0 0 20px;">
                          Hi ${username},
                        </p>
                        <p style="font-size:16px;color:#333333;line-height:24px;margin:0 0 20px;">
                          Here is your new OTP to verify your email:
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding:20px 0;">
                              <span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:28px;font-weight:bold;padding:12px 24px;border-radius:6px;letter-spacing:4px;">
                                ${otp}
                              </span>
                            </td>
                          </tr>
                        </table>
                        <p style="font-size:14px;color:#666666;line-height:22px;margin:0 0 10px;">
                          This OTP is valid for <strong>15 minutes</strong>.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#f3f4f6;padding:20px 30px;text-align:center;font-size:12px;color:#888888;">
                        Need help? <a href="mailto:support@yourapp.com" style="color:#f59e0b;text-decoration:none;">Contact Support</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    }

    const mailOption = {
      from: process.env.GMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOption);

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during resend OTP",
    });
  }
};

export const sendPasswordOtp = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingTemp = await TempUser.findOne({
      userId,
      type: "password_change",
    });
    if (existingTemp) {
      await TempUser.deleteOne({ _id: existingTemp._id });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpireAt = new Date(Date.now() + 15 * 60 * 1000);

    const newTemp = new TempUser({
      email: user.email,
      otp,
      otpExpireAt,
      userId,
      type: "password_change",
    });

    await newTemp.save();

    const mailOption = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "🔐 Reset Your Gamer Pulse Password",
      html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset - Gamer Pulse</title>
      </head>
      <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);min-height:100vh;">
          <tr>
            <td align="center" style="padding:40px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#000000;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(255,140,0,0.2);border:2px solid #ff8c00;">
                
                <!-- Header Section -->
                <tr>
                  <td style="background:linear-gradient(135deg, #ff8c00 0%, #ff6600 100%);padding:40px 30px;text-align:center;position:relative;">
                    <div style="display:inline-block;background:rgba(0,0,0,0.2);border-radius:12px;padding:15px 25px;margin-bottom:20px;">
                      <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:bold;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                        🎮 GAMER PULSE
                      </h1>
                    </div>
                    <div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:15px;display:inline-block;">
                      <h2 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;text-shadow:1px 1px 2px rgba(0,0,0,0.3);">
                        🔐 Password Reset Request
                      </h2>
                    </div>
                    <!-- Security Icons -->
                    <div style="position:absolute;top:15px;right:15px;color:rgba(255,255,255,0.3);font-size:20px;">🛡️</div>
                    <div style="position:absolute;bottom:15px;left:15px;color:rgba(255,255,255,0.3);font-size:18px;">🔒</div>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="background:#000000;padding:40px 30px;">
                    <!-- Alert Banner -->
                    <div style="background:linear-gradient(135deg, #ff6600 0%, #ff8c00 100%);border-radius:8px;padding:3px;margin-bottom:30px;">
                      <div style="background:#000000;border-radius:5px;padding:15px;text-align:center;">
                        <span style="color:#ff8c00;font-size:16px;font-weight:600;">⚠️ Security Alert: Password Reset Requested</span>
                      </div>
                    </div>
                    
                    <div style="border-left:4px solid #ff8c00;padding-left:20px;margin-bottom:30px;">
                      <p style="font-size:20px;color:#ff8c00;line-height:28px;margin:0;font-weight:600;">
                        Hello, ${user.username}! 🎯
                      </p>
                    </div>
                    
                    <p style="font-size:16px;color:#e0e0e0;line-height:26px;margin:0 0 25px;">
                      We received a request to reset your Gamer Pulse account password. If this was you, use the verification code below to proceed with your password reset.
                    </p>
                    
                    <!-- OTP Section -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                      <tr>
                        <td align="center">
                          <div style="background:linear-gradient(135deg, #ff8c00 0%, #ff6600 100%);border-radius:12px;padding:4px;margin:20px 0;">
                            <div style="background:#000000;border-radius:8px;padding:25px 35px;text-align:center;">
                              <p style="color:#ff8c00;font-size:14px;font-weight:600;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px;">
                                🔐 Password Reset Code
                              </p>
                              <span style="display:inline-block;background:linear-gradient(135deg, #ff8c00 0%, #ff6600 100%);color:#000000;font-size:36px;font-weight:bold;padding:15px 30px;border-radius:8px;letter-spacing:6px;text-shadow:none;font-family:monospace;">
                                ${otp}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Security Info Box -->
                    <div style="background:#1a1a1a;border:2px solid #ff8c00;border-radius:8px;padding:20px;margin:30px 0;">
                      <div style="display:flex;align-items:center;margin-bottom:15px;">
                        <span style="color:#ff8c00;font-size:18px;margin-right:10px;">🛡️</span>
                        <p style="font-size:16px;color:#ff8c00;line-height:24px;margin:0;font-weight:600;">
                          Security Information
                        </p>
                      </div>
                      <p style="font-size:14px;color:#cccccc;line-height:22px;margin:10px 0 0;padding-left:28px;">
                        • This code expires in <strong style="color:#ff8c00;">15 minutes</strong><br>
                        • If you didn't request this reset, <strong style="color:#ff8c00;">please ignore this email</strong><br>
                        • Never share this code with anyone
                      </p>
                    </div>
                    
                    <!-- Warning Box -->
                    <div style="background:#2d1810;border:2px solid #ff6600;border-radius:8px;padding:20px;margin:20px 0;">
                      <div style="text-align:center;">
                        <span style="color:#ff6600;font-size:20px;">⚠️</span>
                        <p style="color:#ff6600;font-size:14px;font-weight:600;margin:10px 0 5px;">Didn't request this?</p>
                        <p style="color:#cccccc;font-size:13px;margin:0;line-height:20px;">
                          If you didn't request a password reset, someone might be trying to access your account. Consider updating your security settings.
                        </p>
                      </div>
                    </div>
                    
                    <!-- Gaming Elements -->
                    <div style="text-align:center;margin:30px 0;">
                      <div style="display:inline-block;background:#1a1a1a;border:1px solid #ff8c00;border-radius:20px;padding:10px 20px;">
                        <span style="color:#ff8c00;font-size:14px;font-weight:600;">🔐 Secure Your Gaming Account 🎮</span>
                      </div>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background:#1a1a1a;padding:25px 30px;text-align:center;border-top:2px solid #ff8c00;">
                    <p style="font-size:14px;color:#888888;margin:0 0 15px;line-height:22px;">
                      Questions about account security? We're here to help!
                    </p>
                    <div style="margin-bottom:20px;">
                      <a href="mailto:support@gamerpulse.com" style="color:#ff8c00;text-decoration:none;font-weight:600;font-size:14px;padding:8px 20px;border:2px solid #ff8c00;border-radius:25px;display:inline-block;margin:0 10px 10px 0;">
                        📧 Security Support
                      </a>
                      <a href="#" style="color:#cccccc;text-decoration:none;font-weight:600;font-size:14px;padding:8px 20px;border:2px solid #666;border-radius:25px;display:inline-block;margin:0 10px 10px 0;">
                        🔐 Account Settings
                      </a>
                    </div>
                    <div style="margin-top:20px;padding-top:15px;border-top:1px solid #333333;">
                      <p style="font-size:12px;color:#666666;margin:0;">
                        © 2024 Gamer Pulse. Your gaming security is our priority.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Decorative Security Icons -->
              <div style="text-align:center;margin-top:20px;opacity:0.6;">
                <span style="color:#ff8c00;font-size:20px;margin:0 10px;">🔐</span>
                <span style="color:#ff8c00;font-size:20px;margin:0 10px;">🛡️</span>
                <span style="color:#ff8c00;font-size:20px;margin:0 10px;">🔒</span>
                <span style="color:#ff8c00;font-size:20px;margin:0 10px;">⚡</span>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOption);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email for password reset.",
    });
  } catch (error) {
    console.error("Send password OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during sending OTP",
    });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const userId = req.id;

    if (!otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "OTP and new password are required",
      });
    }

    const tempUser = await TempUser.findOne({
      userId,
      type: "password_change",
    });
    if (!tempUser) {
      return res.status(404).json({
        success: false,
        message: "No pending OTP found",
      });
    }

    if (tempUser.otp !== otp || tempUser.otpExpireAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await TempUser.deleteOne({ _id: tempUser._id });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Set password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during password update",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }

    const userObj = user.toObject();
    userObj.hasPassword = !!user.password;
    userObj.isGoogleUser = user.isGoogleUser || false;
    delete userObj.password;

    return res.status(200).json({
      success: true,
      user: userObj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const {
      username,
      phoneNumber,
      dateOfBirth,
      country,
      gameId,
      level,
      gameUsername,
    } = req.body;
    const profilePictureFile = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (username) user.username = username;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (country) user.country = country;

    if (gameId) {
      user.gameDetails.gameId = gameId;
    } else {
      user.gameDetails.gameId = undefined;
    }
    if (level) {
      user.gameDetails.level = level;
    }
    if (gameUsername) user.gameDetails.gameUsername = gameUsername;

    if (profilePictureFile) {
      if (user.profilePicture) {
        const urlParts = user.profilePicture.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split(".")[0];
        await deleteMediaFromCloudinary(`gamerpulse/image/${publicId}`);
      }

      if (profilePictureFile.size > 600 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Profile picture must be 600 KB or smaller.",
        });
      }

      const cloudResponse = await uploadMedia(profilePictureFile);
      if (!cloudResponse || !cloudResponse.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture.",
        });
      }

      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.code === 11000 && error.keyPattern["gameDetails.gameId"]) {
      return res.status(400).json({
        success: false,
        message: "Game ID already exists. Please choose a unique Game ID.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

export const saveWithdrawalMethod = async (req, res) => {
  try {
    const userId = req.id;
    const { methodType, details } = req.body;

    if (!methodType || !details) {
      return res.status(400).json({
        success: false,
        message: "Method type and details are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (methodType === "upi") {
      if (!details.upiId) {
        return res.status(400).json({
          success: false,
          message: "UPI ID is required for UPI method",
        });
      }
      user.wallet.withdrawalMethods.upi.upiId = details.upiId;
    } else if (methodType === "bank") {
      if (
        !details.bankName ||
        !details.accountNumber ||
        !details.ifscCode ||
        !details.accountHolderName
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Account number, IFSC code, and account holder name are required for bank method",
        });
      }
      user.wallet.withdrawalMethods.bank.bankName = details.bankName;
      user.wallet.withdrawalMethods.bank.accountNumber = details.accountNumber;
      user.wallet.withdrawalMethods.bank.ifscCode = details.ifscCode;
      user.wallet.withdrawalMethods.bank.accountHolderName =
        details.accountHolderName;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid withdrawal method type. Must be 'upi' or 'bank'",
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Withdrawal method saved successfully",
      withdrawalMethods: user.wallet.withdrawalMethods,
    });
  } catch (error) {
    console.error("Save withdrawal method error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during saving withdrawal method",
    });
  }
};
