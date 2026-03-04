import { Router } from "express";
import { getProfile, searchUsers, toggleFollow } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/search", searchUsers);
router.get("/:userId", getProfile);
router.post("/:userId/follow-toggle", toggleFollow);

export default router;
