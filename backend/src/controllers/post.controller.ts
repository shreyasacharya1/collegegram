import type { Request, Response } from "express";
import { Types } from "mongoose";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadBuffer = async (buffer: Buffer): Promise<string> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "collegegram/posts" }, (err, result) => {
      if (err || !result) return reject(err || new Error("Upload failed"));
      resolve(result.secure_url);
    });

    stream.end(buffer);
  });

export const createPost = async (req: Request, res: Response) => {
  const { text, type = "normal", askCategory = null } = req.body;
  if (!text || text.length > 500) return res.status(400).json({ message: "Invalid text" });

  let imageUrl = "";
  if (req.file) imageUrl = await uploadBuffer(req.file.buffer);

  const post = await Post.create({
    author: req.user!.userId,
    text,
    imageUrl,
    type,
    askCategory: type === "ask" ? askCategory : null
  });

  const populated = await post.populate("author", "fullName collegeName yearOfStudy branch");
  return res.status(201).json(populated);
};

export const getFeed = async (req: Request, res: Response) => {
  const me = await User.findById(req.user!.userId);
  if (!me) return res.status(404).json({ message: "User not found" });

  const ids = [new Types.ObjectId(req.user!.userId), ...me.following];
  const posts = await Post.find({ author: { $in: ids } })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("author", "fullName collegeName yearOfStudy branch")
    .populate("comments.author", "fullName yearOfStudy");

  return res.json(posts);
};

export const getAskSeniors = async (_req: Request, res: Response) => {
  const posts = await Post.find({ type: "ask" })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("author", "fullName collegeName yearOfStudy branch")
    .populate("comments.author", "fullName yearOfStudy");

  return res.json(posts);
};

export const toggleLike = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const uid = req.user!.userId;
  const liked = post.likes.some((id) => id.toString() === uid);

  post.likes = liked ? post.likes.filter((id) => id.toString() !== uid) : [...post.likes, new Types.ObjectId(uid)];
  await post.save();

  return res.json({ liked: !liked, likesCount: post.likes.length });
};

export const addComment = async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || text.length > 300) return res.status(400).json({ message: "Invalid comment" });

  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({ author: new Types.ObjectId(req.user!.userId), text, upvotes: [] } as any);
  await post.save();
  await post.populate("comments.author", "fullName yearOfStudy");

  return res.status(201).json(post.comments[post.comments.length - 1]);
};

export const deleteOwnPost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author.toString() !== req.user!.userId) return res.status(403).json({ message: "Forbidden" });

  await post.deleteOne();
  return res.json({ ok: true });
};

export const deleteOwnComment = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = post.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user!.userId) return res.status(403).json({ message: "Forbidden" });

  comment.deleteOne();
  await post.save();
  return res.json({ ok: true });
};

export const toggleCommentUpvote = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = post.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  const uid = req.user!.userId;
  const has = comment.upvotes.some((id) => id.toString() === uid);
  comment.upvotes = has
    ? comment.upvotes.filter((id) => id.toString() !== uid)
    : [...comment.upvotes, new Types.ObjectId(uid)];

  await post.save();
  return res.json({ upvoted: !has, upvotesCount: comment.upvotes.length });
};
