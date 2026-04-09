import { Router } from "express";
import { chat } from "../controllers/ai.controller.js";

const router = Router();

// Public — rate limiting is handled at controller level
router.post("/chat", chat);

export default router;
