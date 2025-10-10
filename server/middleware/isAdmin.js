import { User } from "../models/user/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    if (!req.id) {
      return res.status(400).json({
        message: "User ID not provided",
        success: false,
      });
    }

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const allowedRoles = ["admin", "room_host"];
    if (!allowedRoles.includes(user.role.toLowerCase())) {
      return res.status(403).json({
        message: "Access denied: Admin or Room Host privileges required",
        success: false,
      });
    }
    next();
  } catch (error) {
    console.error("Admin Check Error:", {
      error: error.message,
      userId: req.id,
      stack: error.stack,
    });
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export default isAdmin;
