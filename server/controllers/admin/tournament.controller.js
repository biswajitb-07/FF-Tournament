import { Tournament } from "../../models/admin/tournament.model.js";
import { User } from "../../models/user/user.model.js";
import { Team } from "../../models/user/team.model.js";
import { Transaction } from "../../models/user/transaction.model.js";

export const createTournament = async (req, res) => {
  try {
    const {
      name,
      tournamentType,
      mapName,
      entryFee,
      totalPrizePool,
      prizeDistribution,
      maxSlots,
      startDate,
      startTime,
      registrationEndTime,
    } = req.body;

    const hostId = req.id;

    const host = await User.findById(hostId);
    if (!host) {
      return res.status(404).json({
        message: "Host not found",
        success: false,
      });
    }

    if (host.role != "admin") {
      return res.status(404).json({
        message: "Player cannot create room",
        success: false,
      });
    }

    const tournament = new Tournament({
      name,
      tournamentType,
      mapName,
      entryFee,
      totalPrizePool,
      prizeDistribution,
      maxSlots,
      startDate,
      startTime,
      registrationEndTime,
      host: hostId,
      isActive: false,
    });

    await tournament.save();

    return res.status(201).json({
      success: true,
      message: "Tournament created successfully (pending admin approval).",
      tournament,
    });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create tournament.",
      error: error.message,
    });
  }
};

export const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate("host", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tournaments.length,
      tournaments,
    });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tournaments.",
      error: error.message,
    });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id).populate(
      "host",
      "username email"
    );

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found.",
      });
    }

    return res.status(200).json({
      success: true,
      tournament,
    });
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tournament.",
      error: error.message,
    });
  }
};

export const editTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tournament updated successfully.",
      tournament: updatedTournament,
    });
  } catch (error) {
    console.error("Error updating tournament:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tournament.",
      error: error.message,
    });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTournament = await Tournament.findByIdAndDelete(id);

    if (!deletedTournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tournament deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting tournament:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete tournament.",
      error: error.message,
    });
  }
};

export const joinTournament = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.id;
    const tournamentId = req.params.id;

    console.log("Join tournament request:", { tournamentId, userId, teamId });

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    if (tournament.status !== "registration_open") {
      return res.status(400).json({
        success: false,
        message: `Registration is not open. Current status: ${tournament.status}`,
      });
    }

    if (tournament.currentSlots >= tournament.maxSlots) {
      return res.status(400).json({
        success: false,
        message: "Tournament is full",
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has complete game details
    if (
      !user.gameDetails?.gameId ||
      !user.gameDetails?.level ||
      !user.gameDetails?.gameUsername
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete your game details first",
      });
    }

    let entity;
    let entityModel;

    if (tournament.tournamentType === "solo") {
      // For solo tournaments, user joins directly
      if (teamId) {
        return res.status(400).json({
          success: false,
          message: "Teams are not allowed in solo tournaments",
        });
      }

      entity = userId;
      entityModel = "User";

      // Check if user already joined
      const alreadyJoined = tournament.participants.some(
        (p) => p.entityModel === "User" && p.entity.toString() === userId
      );

      if (alreadyJoined) {
        return res.status(400).json({
          success: false,
          message: "You have already joined this tournament",
        });
      }
    } else {
      if (!teamId) {
        return res.status(400).json({
          success: false,
          message: `Team is required for ${tournament.tournamentType} tournaments`,
        });
      }
      const team = await Team.findById(teamId).populate(
        "members.user",
        "gameDetails"
      );
      if (!team) {
        return res.status(400).json({
          success: false,
          message: "Team not found",
        });
      }

      // Check if team type matches tournament type
      if (team.teamType !== tournament.tournamentType) {
        return res.status(400).json({
          success: false,
          message: `Team type (${team.teamType}) does not match tournament type (${tournament.tournamentType})`,
        });
      }

      // Only team leader can join the tournament
      if (team.leader.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Only the team leader can join the tournament",
        });
      }

      // Check if team has the required number of members
      const acceptedMembers = team.members.filter(
        (m) => m.status === "accepted"
      );
      if (acceptedMembers.length !== tournament.teamSize) {
        return res.status(400).json({
          success: false,
          message: `Team must have exactly ${tournament.teamSize} members`,
        });
      }

      // Check if all team members have complete game details
      for (const member of acceptedMembers) {
        if (
          !member.user.gameDetails?.gameId ||
          !member.user.gameDetails?.level ||
          !member.user.gameDetails?.gameUsername
        ) {
          return res.status(400).json({
            success: false,
            message: "All team members must have complete game details",
          });
        }
      }

      // Check if team already joined
      const alreadyJoined = tournament.participants.some(
        (p) => p.entityModel === "Team" && p.entity.toString() === teamId
      );

      if (alreadyJoined) {
        return res.status(400).json({
          success: false,
          message: "Team has already joined this tournament",
        });
      }

      entity = teamId;
      entityModel = "Team";
    }

    // Check wallet balance for entry fee
    if (user.wallet.balance < tournament.entryFee) {
      return res.status(400).json({
        success: false,
        message:
          "Insufficient wallet balance. Please add funds to your wallet.",
      });
    }

    // Create participant entry
    const participant = {
      entity,
      entityModel,
      registeredAt: new Date(),
      paymentStatus: "paid", // Always "paid" after deduction
      paymentId: `TOURNAMENT_${tournament._id}_${Date.now()}`,
    };

    // Add participant to tournament
    tournament.participants.push(participant);

    // Deduct entry fee (even if 0, it's a no-op)
    user.wallet.balance -= tournament.entryFee;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      user: userId,
      type: "deduction",
      amount: -tournament.entryFee, // Negative for deduction, 0 for free
      status: "completed",
      paymentId: participant.paymentId,
      description: `Entry fee for tournament: ${tournament.name}`,
      tournament: tournament._id,
    });
    await transaction.save();

    await tournament.save();

    // Update user's tournament participation
    if (entityModel === "User") {
      await User.findByIdAndUpdate(entity, {
        $push: { tournaments: tournament._id },
        $inc: { tournamentsPlayed: 1 },
      });
    } else {
      const team = await Team.findById(entity);
      const acceptedMemberIds = team.members
        .filter((m) => m.status === "accepted")
        .map((m) => m.user);

      await User.updateMany(
        { _id: { $in: acceptedMemberIds } },
        {
          $push: { tournaments: tournament._id },
          $inc: { tournamentsPlayed: 1 },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Successfully joined the tournament!",
      tournament: {
        _id: tournament._id,
        name: tournament.name,
        tournamentType: tournament.tournamentType,
        currentSlots: tournament.currentSlots,
        maxSlots: tournament.maxSlots,
      },
    });
  } catch (error) {
    console.error("Join tournament error:", error);
    if (error.afterDeduction) {
      const user = await User.findById(req.id);
      const tournamentId = req.params.id;
      const tournament = await Tournament.findById(tournamentId);
      user.wallet.balance += tournament.entryFee;
      await user.save();
    }
    return res.status(500).json({
      success: false,
      message: "Server error while joining tournament",
      error: error.message,
    });
  }
};