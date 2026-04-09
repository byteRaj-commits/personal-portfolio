import { Router } from "express";
import {
  login,
  logout,
  refreshAccessToken,
  changePassword,
  getMe,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

// Protected
router.post("/logout", verifyJWT, logout);
router.patch("/change-password", verifyJWT, changePassword);
router.get("/me", verifyJWT, getMe);

export default router;
