import Project from "../models/Project.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─── Get All Projects (Public, Paginated) ────────────
export const getAllProjects = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 9,
    category,
    status,
    featured,
    search,
  } = req.query;

  const matchStage = {};
  if (category) matchStage.category = category;
  if (status) matchStage.status = status;
  if (featured !== undefined) matchStage.featured = featured === "true";
  if (search) {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { techStack: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const aggregate = Project.aggregate([
    { $match: matchStage },
    { $sort: { featured: -1, order: 1, createdAt: -1 } },
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const result = await Project.aggregatePaginate(aggregate, options);

  res.status(200).json(
    new ApiResponse(200, {
      projects: result.docs,
      totalProjects: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    }, "Projects fetched successfully")
  );
});

// ─── Get Single Project (Public) ─────────────────────
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  res.status(200).json(new ApiResponse(200, project, "Project fetched successfully"));
});

// ─── Get Featured Projects (Public) ──────────────────
export const getFeaturedProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ featured: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(6);
  res.status(200).json(new ApiResponse(200, projects, "Featured projects fetched"));
});

// ─── Create Project (Admin) ───────────────────────────
export const createProject = asyncHandler(async (req, res) => {
  const {
    title, description, shortDescription, techStack,
    liveUrl, githubUrl, category, featured, status, order,
  } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  const projectData = {
    title, description, shortDescription,
    techStack: Array.isArray(techStack) ? techStack : JSON.parse(techStack || "[]"),
    liveUrl, githubUrl, category, status, order,
    featured: featured === "true" || featured === true,
  };

  // Upload thumbnail
  if (req.files?.thumbnail?.[0]) {
    const result = await uploadOnCloudinary(req.files.thumbnail[0].path, "portfolio/projects");
    if (!result) throw new ApiError(500, "Thumbnail upload failed");
    projectData.thumbnail = { url: result.secure_url, publicId: result.public_id };
  }

  // Upload additional images
  if (req.files?.images?.length) {
    const uploads = await Promise.all(
      req.files.images.map((f) => uploadOnCloudinary(f.path, "portfolio/projects"))
    );
    projectData.images = uploads
      .filter(Boolean)
      .map((r) => ({ url: r.secure_url, publicId: r.public_id }));
  }

  const project = await Project.create(projectData);
  res.status(201).json(new ApiResponse(201, project, "Project created successfully"));
});

// ─── Update Project (Admin) ───────────────────────────
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");

  const {
    title, description, shortDescription, techStack,
    liveUrl, githubUrl, category, featured, status, order,
  } = req.body;

  const updateData = {
    title, description, shortDescription,
    techStack: techStack
      ? Array.isArray(techStack) ? techStack : JSON.parse(techStack)
      : project.techStack,
    liveUrl, githubUrl, category, status, order,
    featured: featured !== undefined ? featured === "true" || featured === true : project.featured,
  };

  // Replace thumbnail if new one uploaded
  if (req.files?.thumbnail?.[0]) {
    if (project.thumbnail?.publicId) {
      await deleteFromCloudinary(project.thumbnail.publicId);
    }
    const result = await uploadOnCloudinary(req.files.thumbnail[0].path, "portfolio/projects");
    if (!result) throw new ApiError(500, "Thumbnail upload failed");
    updateData.thumbnail = { url: result.secure_url, publicId: result.public_id };
  }

  // Append new images
  if (req.files?.images?.length) {
    const uploads = await Promise.all(
      req.files.images.map((f) => uploadOnCloudinary(f.path, "portfolio/projects"))
    );
    const newImages = uploads
      .filter(Boolean)
      .map((r) => ({ url: r.secure_url, publicId: r.public_id }));
    updateData.images = [...(project.images || []), ...newImages];
  }

  const updated = await Project.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, updated, "Project updated successfully"));
});

// ─── Delete Project Image (Admin) ─────────────────────
export const deleteProjectImage = asyncHandler(async (req, res) => {
  const { id, publicId } = req.params;
  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, "Project not found");

  await deleteFromCloudinary(decodeURIComponent(publicId));
  project.images = project.images.filter((img) => img.publicId !== decodeURIComponent(publicId));
  await project.save();

  res.status(200).json(new ApiResponse(200, project, "Image deleted successfully"));
});

// ─── Delete Project (Admin) ───────────────────────────
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");

  // Delete all Cloudinary assets
  const deletePromises = [];
  if (project.thumbnail?.publicId) {
    deletePromises.push(deleteFromCloudinary(project.thumbnail.publicId));
  }
  project.images.forEach((img) => {
    if (img.publicId) deletePromises.push(deleteFromCloudinary(img.publicId));
  });
  await Promise.all(deletePromises);

  await project.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Project deleted successfully"));
});
