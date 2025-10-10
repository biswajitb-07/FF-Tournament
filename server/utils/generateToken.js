import jwt from "jsonwebtoken";

export const generateToken = (res, user, message, statusCode = 200) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "2d",
  });

  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };

  return res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      user: userResponse,
    });
};