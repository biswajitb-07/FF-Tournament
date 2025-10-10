import express from "express";
import * as userController from "../../controllers/admin/player.controller.js";
import isAuthenticatedUser from "../../middleware/isAuthenticatedUser.js";
import isAdmin from "../../middleware/isAdmin.js";

const playerRouter = express.Router();

playerRouter.get(
  "/users",
  [isAuthenticatedUser, isAdmin],
  userController.getAllUsers
);
playerRouter.get(
  "/users/:id",
  [isAuthenticatedUser, isAdmin],
  userController.getUserById
);
playerRouter.put(
  "/users/:id/block",
  [isAuthenticatedUser, isAdmin],
  userController.blockUser
);
playerRouter.delete(
  "/users/:id",
  [isAuthenticatedUser, isAdmin],
  userController.deleteUser
);
playerRouter.put(
  "/users/:id/role",
  [isAuthenticatedUser, isAdmin],
  userController.updateUserRole
);
playerRouter.put(
  "/users/:id/verify",
  [isAuthenticatedUser, isAdmin],
  userController.verifyUser
);
playerRouter.put(
  "/users/:id/reset-password",
  [isAuthenticatedUser, isAdmin],
  userController.resetPassword
);
playerRouter.get(
  "/users/:id/stats",
  [isAuthenticatedUser, isAdmin],
  userController.getUserStats
);

export default playerRouter;
