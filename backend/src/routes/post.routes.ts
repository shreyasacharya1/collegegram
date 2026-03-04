import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addComment,
  createPost,
  deleteOwnComment,
  deleteOwnPost,
  getAskSeniors,
  getFeed,
  toggleCommentUpvote,
  toggleLike,
  upload
} from "../controllers/post.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/feed", getFeed);
router.get("/ask-seniors", getAskSeniors);
router.post("/", upload.single("image"), createPost);
router.post("/:postId/like-toggle", toggleLike);
router.delete("/:postId", deleteOwnPost);
router.post("/:postId/comments", addComment);
router.delete("/:postId/comments/:commentId", deleteOwnComment);
router.post("/:postId/comments/:commentId/upvote-toggle", toggleCommentUpvote);

export default router;
