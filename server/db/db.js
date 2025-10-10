import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      retryWrites: true,
      w: "majority",
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected Securely");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectDB;
