import jwt from "jsonwebtoken";

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
export default isAuthenticatedUser;
