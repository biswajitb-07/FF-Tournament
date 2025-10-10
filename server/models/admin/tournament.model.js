import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    tournamentType: {
      type: String,
      enum: ["solo", "duo", "squad"],
      required: true,
    },
    mapName: {
      type: String,
      enum: ["bermuda", "kalahari", "purgatory", "nexterra", "alpine"],
      required: true,
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrizePool: {
      type: Number,
      required: true,
      min: 0,
    },
    prizeDistribution: {
      type: Map,
      of: Number,
      default: {},
    },
    maxSlots: {
      type: Number,
      required: true,
    },
    currentSlots: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    timezone: {
      type: String,
      default: "IST",
    },
    registrationStartTime: {
      type: Date,
      default: Date.now,
    },
    registrationEndTime: {
      type: Date,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "upcoming",
        "registration_open",
        "registration_closed",
        "live",
        "completed",
        "cancelled",
      ],
      default: "upcoming",
    },
    roomDetails: {
      roomId: String,
      roomPassword: String,
      sharedAt: Date,
    },

    participants: [
      {
        entity: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "participants.entityModel",
          required: true,
        },
        entityModel: {
          type: String,
          required: true,
          enum: ["User", "Team"],
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        rank: {
          type: Number,
          default: 0,
        },
        kills: {
          type: Number,
          default: 0,
        },
        points: {
          type: Number,
          default: 0,
        },
        prizeWon: {
          type: Number,
          default: 0,
        },
        paymentStatus: {
          type: String,
          enum: ["pending", "paid", "refunded"],
          default: "pending",
        },
        paymentId: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    teamSize: {
      type: Number,
      default: function () {
        if (this.tournamentType === "solo") return 1;
        if (this.tournamentType === "duo") return 2;
        if (this.tournamentType === "squad") return 4;
        return 1;
      },
    },
  },
  {
    timestamps: true,
  }
);

tournamentSchema.virtual("remainingSlots").get(function () {
  return this.maxSlots - this.currentSlots;
});

tournamentSchema.pre("save", function (next) {
  this.currentSlots = this.participants.length;
  next();
});

export const Tournament = mongoose.model("Tournament", tournamentSchema);
