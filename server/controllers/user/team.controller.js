import { Team } from "../../models/user/team.model.js";
import { User } from "../../models/user/user.model.js";
import {
  uploadMedia,
  deleteMediaFromCloudinary,
} from "../../utils/cloudinary.js";
import { generateInviteCode } from "../../utils/helper.js";

export const createTeam = async (req, res) => {
  try {
    const { teamName, teamType } = req.body;
    const leaderId = req.id;

    // Validate inputs
    if (!teamName || teamName.length < 3 || teamName.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Team name must be 3-30 characters",
      });
    }

    if (!["duo", "squad"].includes(teamType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team type. Must be 'duo' or 'squad'",
      });
    }

    // Check creation limits: max 2 per type per user
    const userTeams = await Team.find({ leader: leaderId });
    const typeCount = userTeams.filter(
      (team) => team.teamType === teamType
    ).length;
    if (typeCount >= 2) {
      return res.status(400).json({
        success: false,
        message: `You can create maximum 2 ${teamType} teams`,
      });
    }

    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "Team name already exists",
      });
    }

    // Generate unique invite code
    const inviteCode = await generateInviteCode();

    const maxMembers = teamType === "duo" ? 2 : 4;
    const newTeam = new Team({
      teamName,
      teamType,
      leader: leaderId,
      members: [{ user: leaderId, status: "accepted" }],
      inviteCode,
      maxMembers,
    });

    await newTeam.save();

    // Add team to user's teamId array
    await User.findByIdAndUpdate(leaderId, { $push: { teamId: newTeam._id } });

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      team: {
        _id: newTeam._id,
        teamName: newTeam.teamName,
        teamType: newTeam.teamType,
        teamLogo: newTeam.teamLogo,
        inviteCode: newTeam.inviteCode,
        maxMembers: newTeam.maxMembers,
      },
    });
  } catch (error) {
    console.error("Create team error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during team creation",
    });
  }
};

export const getMyTeams = async (req, res) => {
  try {
    const userId = req.id;

    // Fetch user's teams from User.teamId and populate
    const user = await User.findById(userId).populate({
      path: "teamId",
      populate: [
        { path: "leader", select: "_id username" },
        { path: "members.user", select: "_id username" },
      ],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const teams = user.teamId || [];
    const duoTeams = teams.filter((team) => team.teamType === "duo");
    const squadTeams = teams.filter((team) => team.teamType === "squad");

    return res.status(200).json({
      success: true,
      duoTeams,
      squadTeams,
      duoCount: duoTeams.length,
      squadCount: squadTeams.length,
    });
  } catch (error) {
    console.error("Get my teams error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching teams",
    });
  }
};

export const getPendingInvites = async (req, res) => {
  try {
    const userId = req.id;

    const pendingTeams = await Team.find({
      members: {
        $elemMatch: {
          user: userId,
          status: "pending",
          memberType: "invite",
        },
      },
    })
      .populate("leader", "_id username")
      .populate({
        path: "members.user",
        select: "_id username",
        match: { _id: userId },
      });

    const invites = pendingTeams.map((team) => ({
      _id: team._id,
      teamName: team.teamName,
      teamType: team.teamType,
      teamLogo: team.teamLogo,
      inviteCode: team.inviteCode,
      leader: team.leader,
      maxMembers: team.maxMembers,
      status: "pending",
    }));

    return res.status(200).json({
      success: true,
      invites,
      count: invites.length,
    });
  } catch (error) {
    console.error("Get pending invites error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching pending invites",
    });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.id;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.leader.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only team leader can delete the team",
      });
    }

    if (team.teamLogo) {
      const urlParts = team.teamLogo.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split(".")[0];
      await deleteMediaFromCloudinary(`gamerpulse/team/${publicId}`);
    }

    const acceptedMemberIds = team.members
      .filter((m) => m.status === "accepted")
      .map((m) => m.user);
    await User.updateMany(
      { _id: { $in: acceptedMemberIds } },
      { $pull: { teamId: teamId } }
    );

    await Team.findByIdAndDelete(teamId);

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Delete team error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during team deletion",
    });
  }
};

export const updateTeamLogo = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.id;
    const teamLogoFile = req.file;

    if (!teamLogoFile) {
      return res.status(400).json({
        success: false,
        message: "Team logo file is required",
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.leader.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only team leader can update logo",
      });
    }

    if (teamLogoFile.size > 500 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Profile picture must be 500 KB or smaller.",
      });
    }

    if (team.teamLogo) {
      const urlParts = team.teamLogo.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split(".")[0];
      await deleteMediaFromCloudinary(`gamerpulse/team/${publicId}`);
    }

    const cloudResponse = await uploadMedia(teamLogoFile, "team");
    if (!cloudResponse || !cloudResponse.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload team logo",
      });
    }

    team.teamLogo = cloudResponse.secure_url;
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Team logo updated successfully",
      teamLogo: team.teamLogo,
    });
  } catch (error) {
    console.error("Update team logo error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logo update",
    });
  }
};

export const joinTeamRequest = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.id;

    if (
      !inviteCode ||
      typeof inviteCode !== "string" ||
      inviteCode.trim().length !== 6
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid invite code",
      });
    }

    const formattedCode = inviteCode.trim().toUpperCase();

    const user = await User.findById(userId).populate("teamId");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const gameId = user.gameDetails?.gameId;
    const level = user.gameDetails?.level;
    const gameUsername = user.gameDetails?.gameUsername?.trim();

    if (
      !gameId ||
      gameId === null ||
      gameId === 0 ||
      !level ||
      level <= 0 ||
      !gameUsername ||
      gameUsername === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Please update your complete game details first",
      });
    }

    const team = await Team.findOne({ inviteCode: formattedCode }).populate(
      "leader"
    );
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found with this invite code",
      });
    }

    if (!team.leader) {
      console.error(`Team ${team._id} has no valid leader`);
      return res.status(400).json({
        success: false,
        message: "Team has no valid leader",
      });
    }

    if (team.leader._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You are the leader of this team. No need to join.",
      });
    }

    // Check user's team membership limits
    const userTeams = user.teamId || [];
    const duoTeams = userTeams.filter((t) => t.teamType === "duo").length;
    const squadTeams = userTeams.filter((t) => t.teamType === "squad").length;

    if (team.teamType === "duo" && duoTeams >= 2) {
      return res.status(400).json({
        success: false,
        message: "You have already joined the maximum of 2 duo teams",
      });
    }
    if (team.teamType === "squad" && squadTeams >= 2) {
      return res.status(400).json({
        success: false,
        message: "You have already joined the maximum of 2 squad teams",
      });
    }

    const isAlreadyMember = team.members.some(
      (member) =>
        member.user.toString() === userId && member.status === "accepted"
    );
    const hasPendingRequest = team.members.some(
      (member) =>
        member.user.toString() === userId && member.status === "pending"
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this team",
      });
    }

    if (hasPendingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request for this team",
      });
    }

    const acceptedMembersCount = team.members.filter(
      (member) => member.status === "accepted"
    ).length;
    if (acceptedMembersCount >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Team is full",
      });
    }

    team.members.push({
      user: userId,
      status: "pending",
      memberType: "join_request",
    });
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Join request sent successfully",
      teamId: team._id,
    });
  } catch (error) {
    console.error("Join team request error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during join request",
    });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { teamName } = req.body;
    const userId = req.id;

    if (!teamName || teamName.length < 3 || teamName.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Team name must be 3-30 characters",
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.leader.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only team leader can update team",
      });
    }

    const existingTeam = await Team.findOne({ teamName, _id: { $ne: teamId } });
    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "Team name already exists",
      });
    }

    team.teamName = teamName;
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Team updated successfully",
      team: {
        _id: team._id,
        teamName: team.teamName,
        teamType: team.teamType,
        teamLogo: team.teamLogo,
        inviteCode: team.inviteCode,
        maxMembers: team.maxMembers,
      },
    });
  } catch (error) {
    console.error("Update team error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during team update",
    });
  }
};

export const acceptJoinRequest = async (req, res) => {
  try {
    const { teamId, userId } = req.body;
    const leaderId = req.id;

    const team = await Team.findById(teamId).populate("leader");
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.leader._id.toString() !== leaderId) {
      return res.status(403).json({
        success: false,
        message: "Only team leader can accept requests",
      });
    }

    const pendingMember = team.members.find(
      (member) =>
        member.user.toString() === userId &&
        member.status === "pending" &&
        member.memberType === "join_request"
    );
    if (!pendingMember) {
      return res.status(400).json({
        success: false,
        message: "No pending join request found",
      });
    }

    const pendingIndex = team.members.findIndex(
      (member) => member._id.toString() === pendingMember._id.toString()
    );

    const acceptedCount = team.members.filter(
      (member) => member.status === "accepted"
    ).length;
    if (acceptedCount >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Team is full",
      });
    }

    team.members[pendingIndex].status = "accepted";
    await team.save();

    await User.findByIdAndUpdate(userId, { $push: { teamId: teamId } });

    return res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      team,
    });
  } catch (error) {
    console.error("Accept join request error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during request acceptance",
    });
  }
};

export const rejectJoinRequest = async (req, res) => {
  try {
    const { teamId, userId } = req.body;
    const leaderId = req.id;

    const team = await Team.findById(teamId).populate("leader");
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.leader._id.toString() !== leaderId) {
      return res.status(403).json({
        success: false,
        message: "Only team leader can reject requests",
      });
    }

    const pendingMember = team.members.find(
      (member) =>
        member.user.toString() === userId &&
        member.status === "pending" &&
        member.memberType === "join_request"
    );
    if (!pendingMember) {
      return res.status(400).json({
        success: false,
        message: "No pending join request found",
      });
    }

    const pendingIndex = team.members.findIndex(
      (member) => member._id.toString() === pendingMember._id.toString()
    );

    team.members.splice(pendingIndex, 1);
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      team,
    });
  } catch (error) {
    console.error("Reject join request error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during request rejection",
    });
  }
};

export const userAcceptInvite = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.id;

    const user = await User.findById(userId).populate("teamId");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const team = await Team.findById(teamId).populate("leader");
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Check user's team membership limits
    const userTeams = user.teamId || [];
    const duoTeams = userTeams.filter((t) => t.teamType === "duo").length;
    const squadTeams = userTeams.filter((t) => t.teamType === "squad").length;

    if (team.teamType === "duo" && duoTeams >= 2) {
      return res.status(400).json({
        success: false,
        message: "You have already joined the maximum of 2 duo teams",
      });
    }
    if (team.teamType === "squad" && squadTeams >= 2) {
      return res.status(400).json({
        success: false,
        message: "You have already joined the maximum of 2 squad teams",
      });
    }

    const pendingMember = team.members.find(
      (member) =>
        member.user.toString() === userId &&
        member.status === "pending" &&
        member.memberType === "invite"
    );
    if (!pendingMember) {
      return res.status(400).json({
        success: false,
        message: "No pending invite found",
      });
    }

    const pendingIndex = team.members.findIndex(
      (member) => member._id.toString() === pendingMember._id.toString()
    );

    const acceptedCount = team.members.filter(
      (member) => member.status === "accepted"
    ).length;
    if (acceptedCount >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Team is full",
      });
    }

    team.members[pendingIndex].status = "accepted";
    await team.save();

    await User.findByIdAndUpdate(userId, { $push: { teamId: teamId } });

    return res.status(200).json({
      success: true,
      message: "Invite accepted successfully",
      team,
    });
  } catch (error) {
    console.error("User accept invite error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during invite acceptance",
    });
  }
};

export const userRejectInvite = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.id;

    const team = await Team.findById(teamId).populate("leader");
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const pendingMember = team.members.find(
      (member) =>
        member.user.toString() === userId &&
        member.status === "pending" &&
        member.memberType === "invite"
    );
    if (!pendingMember) {
      return res.status(400).json({
        success: false,
        message: "No pending invite found",
      });
    }

    const pendingIndex = team.members.findIndex(
      (member) => member._id.toString() === pendingMember._id.toString()
    );

    team.members.splice(pendingIndex, 1);
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Invite rejected successfully",
      team,
    });
  } catch (error) {
    console.error("User reject invite error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during invite rejection",
    });
  }
};

export const removeTeamMember = async (req, res) => {
  try {
    const { teamId, userId } = req.body;
    const leaderId = req.id;

    const team = await Team.findById(teamId).populate("leader");
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.leader._id.toString() !== leaderId) {
      return res.status(403).json({
        success: false,
        message: "Only team leader can remove members",
      });
    }

    const memberIndex = team.members.findIndex(
      (member) =>
        member.user.toString() === userId && member.status === "accepted"
    );
    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Member not found in team",
      });
    }

    if (team.leader._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove the team leader",
      });
    }

    team.members.splice(memberIndex, 1);
    await team.save();

    await User.findByIdAndUpdate(userId, { $pull: { teamId: teamId } });

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      team,
    });
  } catch (error) {
    console.error("Remove team member error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during member removal",
    });
  }
};

export const inviteByGameId = async (req, res) => {
  try {
    const { teamId, gameId } = req.body;
    const leaderId = req.id;

    const team = await Team.findById(teamId).populate("leader");
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.leader._id.toString() !== leaderId) {
      return res.status(403).json({
        success: false,
        message: "Only team leader can invite members",
      });
    }

    const targetUser = await User.findOne({ "gameDetails.gameId": gameId });
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found with this Game ID",
      });
    }

    if (targetUser._id.toString() === leaderId) {
      return res.status(400).json({
        success: false,
        message: "Cannot invite yourself",
      });
    }

    const isAlreadyMember = team.members.some(
      (m) =>
        m.user.toString() === targetUser._id.toString() &&
        m.status === "accepted"
    );
    const hasPendingRequest = team.members.some(
      (m) =>
        m.user.toString() === targetUser._id.toString() &&
        m.status === "pending"
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this team",
      });
    }

    if (hasPendingRequest) {
      return res.status(400).json({
        success: false,
        message: "User already has a pending request for this team",
      });
    }

    const acceptedMembersCount = team.members.filter(
      (m) => m.status === "accepted"
    ).length;
    if (acceptedMembersCount >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Team is full",
      });
    }

    team.members.push({
      user: targetUser._id,
      status: "pending",
      memberType: "invite",
    });
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Invite sent successfully",
    });
  } catch (error) {
    console.error("Invite by Game ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during invite",
    });
  }
};

export const leaveTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.id;

    const team = await Team.findById(teamId).populate("leader");
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const memberIndex = team.members.findIndex(
      (m) => m.user.toString() === userId && m.status === "accepted"
    );
    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "You are not a member of this team",
      });
    }

    if (team.leader._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Team leader cannot leave the team",
      });
    }

    team.members.splice(memberIndex, 1);
    await team.save();

    await User.findByIdAndUpdate(userId, { $pull: { teamId: teamId } });

    return res.status(200).json({
      success: true,
      message: "Left team successfully",
    });
  } catch (error) {
    console.error("Leave team error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during leave team",
    });
  }
};

export const getTeamDetails = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.id;

    const team = await Team.findById(teamId)
      .populate({
        path: "members.user",
        select: "username profilePicture gameDetails _id",
      })
      .populate("leader", "username profilePicture gameDetails _id");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Allow access if leader, accepted member, or pending invite (memberType: "invite")
    const isAuthorized =
      team.leader._id.toString() === userId ||
      team.members.some((member) => {
        if (member.status === "accepted") {
          return member.user._id.toString() === userId;
        } else if (member.status === "pending") {
          return (
            member.user._id.toString() === userId &&
            member.memberType === "invite"
          );
        }
        return false;
      });

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You must be a leader, accepted member, or have a pending invite",
      });
    }

    const acceptedMembers = team.members
      .filter((member) => member.status === "accepted")
      .map((member) => ({
        ...member.user.toObject(),
        status:
          member.user._id.toString() === team.leader._id.toString()
            ? "leader"
            : "member",
      }));

    return res.status(200).json({
      success: true,
      team: {
        _id: team._id,
        teamName: team.teamName,
        teamType: team.teamType,
        teamLogo: team.teamLogo,
        inviteCode: team.inviteCode,
        maxMembers: team.maxMembers,
        currentMembers: acceptedMembers.length,
        members: acceptedMembers,
        leader: team.leader,
      },
    });
  } catch (error) {
    console.error("Get team details error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching team details",
    });
  }
};
