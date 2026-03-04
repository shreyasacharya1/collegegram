import type { Request, Response } from "express";
import { User } from "../models/User.js";

export const getProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId)
    .select("-password")
    .populate("following", "fullName collegeName branch yearOfStudy")
    .populate("followers", "fullName collegeName branch yearOfStudy");

  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ ...user.toObject(), isSenior: user.yearOfStudy >= 3 });
};

export const searchUsers = async (req: Request, res: Response) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);

  const users = await User.find({ $text: { $search: q } })
    .select("-password")
    .limit(20)
    .sort({ createdAt: -1 });

  return res.json(users.map((u) => ({ ...u.toObject(), isSenior: u.yearOfStudy >= 3 })));
};

export const toggleFollow = async (req: Request, res: Response) => {
  const meId = req.user!.userId;
  const targetId = req.params.userId;

  if (meId === targetId) return res.status(400).json({ message: "Cannot follow yourself" });

  const [me, target] = await Promise.all([User.findById(meId), User.findById(targetId)]);
  if (!me || !target) return res.status(404).json({ message: "User not found" });

  const isFollowing = me.following.some((id) => id.toString() === targetId);
  if (isFollowing) {
    me.following = me.following.filter((id) => id.toString() !== targetId);
    target.followers = target.followers.filter((id) => id.toString() !== meId);
  } else {
    me.following.push(target._id);
    target.followers.push(me._id);
  }

  await Promise.all([me.save(), target.save()]);
  return res.json({ following: !isFollowing });
};
