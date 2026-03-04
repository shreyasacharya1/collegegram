import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const sanitizeUser = (u: any) => ({
  _id: u._id,
  fullName: u.fullName,
  email: u.email,
  collegeName: u.collegeName,
  yearOfStudy: u.yearOfStudy,
  branch: u.branch,
  bio: u.bio,
  avatarUrl: u.avatarUrl,
  followers: u.followers,
  following: u.following,
  isSenior: u.yearOfStudy >= 3
});

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password, collegeName, yearOfStudy, branch } = req.body;

  if (!fullName || !email || !password || !collegeName || !yearOfStudy || !branch) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Future hardening: enforce college email domain allowlist here.
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName,
    email,
    password: hash,
    collegeName,
    yearOfStudy: Number(yearOfStudy),
    branch
  });

  const token = signToken({ userId: user.id });
  return res.status(201).json({ token, user: sanitizeUser(user) });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ userId: user.id });
  return res.json({ token, user: sanitizeUser(user) });
};

export const me = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json(sanitizeUser(user));
};
