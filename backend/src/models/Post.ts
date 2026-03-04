import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 300 },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 500 },
    imageUrl: { type: String, default: "" },
    type: { type: String, enum: ["normal", "ask"], default: "normal" },
    askCategory: {
      type: String,
      enum: ["guidance", "placement", "course", "internship", "other"],
      default: null
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema]
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
