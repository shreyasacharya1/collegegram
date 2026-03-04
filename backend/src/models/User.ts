import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    collegeName: { type: String, required: true, trim: true },
    yearOfStudy: { type: Number, required: true, min: 1, max: 6 },
    branch: { type: String, required: true, trim: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

userSchema.index({ fullName: "text", collegeName: "text", branch: "text" });

export const User = mongoose.model("User", userSchema);
