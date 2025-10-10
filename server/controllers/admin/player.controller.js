import mongoose from "mongoose";
import { User } from "../../models/user/user.model.js";
import { Team } from "../../models/user/team.model.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    const users = await User.find(query).select("-password -otp -otpExpireAt");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -otp -otpExpireAt"
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    user.isBlocked = !user.isBlocked;
    if (user.isBlocked && reason) {
      user.banReason = reason;
    } else if (!user.isBlocked) {
      user.banReason = "";
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userAccess = await User.findById(req.id);
    if (!userAccess || userAccess.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only admins can delete users",
      });
    }

    const userId = req.params.id;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const teams = await Team.find({
        $or: [{ "members.user": userId }, { leader: userId }],
      }).session(session);
      const teamIds = teams.map((team) => team._id);

      await Team.updateMany(
        { "members.user": userId },
        { $pull: { members: { user: userId } } },
        { session }
      );

      await Team.deleteMany({ leader: userId }, { session });

      await User.updateMany(
        { teamId: { $in: teamIds } },
        { $pull: { teamId: { $in: teamIds } } },
        { session }
      );

      await User.findByIdAndDelete(userId, { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "User and all related team data deleted successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error deleting user: ${error.message}`,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const userAccess = await User.findById(req.id);

    if (userAccess.role != "admin")
      return res.status(404).json({
        success: false,
        message: "Access denied: Only admins can update roles",
      });

    if (!["player", "room_host", "admin"].includes(role))
      return res.status(400).json({ success: false, message: "Invalid role" });
    const user = await User.findById(req.params.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.role = role;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    user.isVerified = isVerified;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User verification status updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userAccess = await User.findById(req.id);

    if (userAccess.role != "admin")
      return res.status(404).json({
        success: false,
        message: "Access denied: Only admins can update roles",
      });

    if (!newPassword)
      return res
        .status(400)
        .json({ success: false, message: "New password is required" });
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -otp -otpExpireAt")
      .populate({
        path: "tournaments",
        select: "name startDate endDate",
      })
      .populate({
        path: "teamId",
        select: "teamName teamType members inviteCode",
        populate: {
          path: "members.user",
          select: "username email gameDetails",
        },
      });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const stats = {
      tournamentsPlayed: user.tournamentsPlayed,
      tournamentsWon: user.tournamentsWon,
      winRate:
        user.tournamentsPlayed > 0
          ? ((user.tournamentsWon / user.tournamentsPlayed) * 100).toFixed(2) +
            "%"
          : "0%",
      teams: user.teamId.map((team) => ({
        teamName: team.teamName,
        teamType: team.teamType,
        inviteCode: team.inviteCode,
        members: team.members
          .filter((member) => member.status === "accepted")
          .map((member) => ({
            username: member.user.username,
            email: member.user.email,
            gameDetails: member.user.gameDetails,
          })),
      })),
      gameDetails: user.gameDetails,
      walletBalance: user.wallet.balance,
      lastLogin: user.lastLoginAt,
    };
    res.status(200).json({ success: true, user, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
