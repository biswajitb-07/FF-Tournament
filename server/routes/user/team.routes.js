import express from "express";
import upload from "../../utils/multer.js";
import {
  createTeam,
  getMyTeams,
  getPendingInvites,
  deleteTeam,
  updateTeamLogo,
  joinTeamRequest,
  updateTeam,
  acceptJoinRequest,
  rejectJoinRequest,
  userAcceptInvite,
  userRejectInvite,
  getTeamDetails,
  removeTeamMember,
  inviteByGameId,
  leaveTeam,
} from "../../controllers/user/team.controller.js";
import isAuthenticatedUser from "../../middleware/isAuthenticatedUser.js";

const teamRouter = express.Router();

teamRouter.post("/create", isAuthenticatedUser, createTeam);
teamRouter.get("/my-teams", isAuthenticatedUser, getMyTeams);
teamRouter.get("/pending-invites", isAuthenticatedUser, getPendingInvites);
teamRouter.delete("/delete/:teamId", isAuthenticatedUser, deleteTeam);
teamRouter.post(
  "/logo/:teamId",
  isAuthenticatedUser,
  upload.single("teamLogo"),
  updateTeamLogo
);
teamRouter.post("/join", isAuthenticatedUser, joinTeamRequest);
teamRouter.put("/update/:teamId", isAuthenticatedUser, updateTeam);
teamRouter.post("/accept-request", isAuthenticatedUser, acceptJoinRequest);
teamRouter.post("/reject-request", isAuthenticatedUser, rejectJoinRequest);
teamRouter.post("/user-accept-invite", isAuthenticatedUser, userAcceptInvite);
teamRouter.post("/user-reject-invite", isAuthenticatedUser, userRejectInvite);
teamRouter.post("/remove-member", isAuthenticatedUser, removeTeamMember);
teamRouter.post("/invite-by-gameid", isAuthenticatedUser, inviteByGameId);
teamRouter.post("/leave", isAuthenticatedUser, leaveTeam);
teamRouter.get("/details/:teamId", isAuthenticatedUser, getTeamDetails);

export default teamRouter;
