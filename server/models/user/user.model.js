import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      default: "",
    },
    gameDetails: {
      gameId: {
        type: Number,
        required: false,
        default: null,
      },
      level: {
        type: Number,
        required: false,
      },
      gameUsername: {
        type: String,
        required: false,
        trim: true,
        default: "",
      },
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    country: {
      type: String,
      required: false,
      trim: true,
    },
    teamId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    tournaments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
      },
    ],
    tournamentsWon: {
      type: Number,
      default: 0,
    },
    tournamentsPlayed: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["player", "room_host", "admin"],
      default: "player",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      default: "",
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      withdrawalMethods: {
        upi: {
          upiId: {
            type: String,
            trim: true,
            required: false,
          },
        },
        bank: {
          bankName: {
            type: String,
            trim: true,
            required: false,
          },
          accountNumber: {
            type: String,
            trim: true,
            required: false,
          },
          ifscCode: {
            type: String,
            trim: true,
            required: false,
          },
          accountHolderName: {
            type: String,
            trim: true,
            maxlength: 50,
            required: false,
          },
        },
      },
    },
    otp: {
      type: String,
      default: "",
    },
    otpExpireAt: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
