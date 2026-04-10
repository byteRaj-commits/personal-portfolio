import { Router } from "express";
import {
  getProfile,
  upsertProfile,
  deleteResume,
  getResumeDownloadUrl,
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Public
router.get("/", getProfile);
router.get("/resume", getResumeDownloadUrl);

// Admin
router.put(
  "/",
  verifyJWT,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  upsertProfile
);

router.delete("/resume", verifyJWT, deleteResume);

export default router;
