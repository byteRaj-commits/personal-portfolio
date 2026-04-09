import { Router } from "express";
import {
  getAllProjects,
  getProjectById,
  getFeaturedProjects,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

const projectUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// Public
router.get("/", getAllProjects);
router.get("/featured", getFeaturedProjects);
router.get("/:id", getProjectById);

// Admin
router.post("/", verifyJWT, projectUpload, createProject);
router.put("/:id", verifyJWT, projectUpload, updateProject);
router.delete("/:id/images/:publicId", verifyJWT, deleteProjectImage);
router.delete("/:id", verifyJWT, deleteProject);

export default router;
