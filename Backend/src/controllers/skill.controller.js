import Skill from "../models/Skill.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─── Get All Skills (Public) ─────────────────────────
export const getAllSkills = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const filter = category ? { category } : {};

  // Group by category for easy frontend rendering
  const skills = await Skill.aggregate([
    { $match: filter },
    { $sort: { order: 1, name: 1 } },
    {
      $group: {
        _id: "$category",
        skills: {
          $push: {
            _id: "$_id",
            name: "$name",
            proficiency: "$proficiency",
            icon: "$icon",
            order: "$order",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(new ApiResponse(200, skills, "Skills fetched successfully"));
});

// ─── Get Skills Flat List (Public) ───────────────────
export const getSkillsFlat = asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
  res.status(200).json(new ApiResponse(200, skills, "Skills fetched successfully"));
});

// ─── Create Skill (Admin) ─────────────────────────────
export const createSkill = asyncHandler(async (req, res) => {
  const { name, category, proficiency, icon, order } = req.body;

  if (!name || !category) {
    throw new ApiError(400, "Name and category are required");
  }

  const exists = await Skill.findOne({ name: name.trim(), category });
  if (exists) throw new ApiError(409, "Skill already exists in this category");

  const skill = await Skill.create({ name, category, proficiency, icon, order });
  res.status(201).json(new ApiResponse(201, skill, "Skill created successfully"));
});

// ─── Update Skill (Admin) ─────────────────────────────
export const updateSkill = asyncHandler(async (req, res) => {
  const { name, category, proficiency, icon, order } = req.body;

  const skill = await Skill.findByIdAndUpdate(
    req.params.id,
    { $set: { name, category, proficiency, icon, order } },
    { new: true, runValidators: true }
  );

  if (!skill) throw new ApiError(404, "Skill not found");
  res.status(200).json(new ApiResponse(200, skill, "Skill updated successfully"));
});

// ─── Bulk Create Skills (Admin) ───────────────────────
export const bulkCreateSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body;
  if (!Array.isArray(skills) || skills.length === 0) {
    throw new ApiError(400, "Provide an array of skills");
  }

  const inserted = await Skill.insertMany(skills, { ordered: false });
  res.status(201).json(new ApiResponse(201, inserted, `${inserted.length} skills created`));
});

// ─── Delete Skill (Admin) ─────────────────────────────
export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) throw new ApiError(404, "Skill not found");
  res.status(200).json(new ApiResponse(200, {}, "Skill deleted successfully"));
});
