import { Router } from "express";
import {
  getAllSkills,
  getSkillsFlat,
  createSkill,
  updateSkill,
  bulkCreateSkills,
  deleteSkill,
} from "../controllers/skill.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.get("/", getAllSkills);           // Grouped by category
router.get("/flat", getSkillsFlat);      // Flat list

// Admin
router.post("/bulk", verifyJWT, bulkCreateSkills);
router.post("/", verifyJWT, createSkill);
router.put("/:id", verifyJWT, updateSkill);
router.delete("/:id", verifyJWT, deleteSkill);

export default router;
