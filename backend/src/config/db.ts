import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  if (!env.MONGO_URI) throw new Error("MONGO_URI missing in environment");
  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected");
};
