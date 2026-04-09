import { Router } from "express";
import {
  getAllStats,
  getStatsByPlatform,
  upsertLeetcodeStats,
  upsertGithubStats,
  upsertGFGStats,
} from "../controllers/stats.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.get("/", getAllStats);
router.get("/:platform", getStatsByPlatform); // leetcode | github | geeksforgeeks

// Admin
router.put("/leetcode", verifyJWT, upsertLeetcodeStats);
router.put("/github", verifyJWT, upsertGithubStats);
router.put("/geeksforgeeks", verifyJWT, upsertGFGStats);

export default router;
