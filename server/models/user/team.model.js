import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    teamType: {
      type: String,
      enum: ["duo", "squad"],
      required: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamLogo: {
      type: String,
      default: "",
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        memberType: {
          type: String,
          enum: ["join_request", "invite"],
          default: "join_request",
        },
      },
    ],
    maxMembers: {
      type: Number,
      default: function () {
        return this.teamType === "duo" ? 2 : 4;
      },
    },
    inviteCode: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model("Team", teamSchema);
