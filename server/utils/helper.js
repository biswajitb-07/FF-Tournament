import { Team } from "../models/user/team.model.js";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateInviteCode = async () => {
  let inviteCode;
  let isUnique = false;
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    inviteCode = "";
    for (let i = 0; i < 6; i++) {
      inviteCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const existingTeam = await Team.findOne({ inviteCode });
    if (!existingTeam) {
      isUnique = true;
      break;
    }
  }

  if (!isUnique) {
    throw new Error(
      "Failed to generate unique invite code after maximum attempts"
    );
  }

  return inviteCode;
};
