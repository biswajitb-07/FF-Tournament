import express from "express";
import {
  createTournament,
  getTournaments,
  getTournamentById,
  editTournament,
  deleteTournament,
  joinTournament,
} from "../../controllers/admin/tournament.controller.js";
import isAuthenticatedUser from "../../middleware/isAuthenticatedUser.js";

const tournamentRouter = express.Router();

tournamentRouter.post("/create", isAuthenticatedUser, createTournament);
tournamentRouter.get("/", getTournaments);
tournamentRouter.get("/:id", isAuthenticatedUser, getTournamentById);
tournamentRouter.put("/:id", isAuthenticatedUser, editTournament);
tournamentRouter.delete("/:id", isAuthenticatedUser, deleteTournament);
tournamentRouter.post("/join/:id", isAuthenticatedUser, joinTournament);

export default tournamentRouter;
