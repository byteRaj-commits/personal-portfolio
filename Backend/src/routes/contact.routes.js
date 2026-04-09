import { Router } from "express";
import {
  submitContact,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getContactStats,
} from "../controllers/contact.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.post("/", submitContact);

// Admin
router.get("/stats", verifyJWT, getContactStats);
router.get("/", verifyJWT, getAllMessages);
router.get("/:id", verifyJWT, getMessageById);
router.patch("/:id/status", verifyJWT, updateMessageStatus);
router.delete("/:id", verifyJWT, deleteMessage);

export default router;
