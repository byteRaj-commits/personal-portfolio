import Profile from "../models/Profile.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";

// ─── Get Profile (Public) ────────────────────────────
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  const profileObject = profile.toObject();

  if (profileObject?.resume?.publicId) {
    profileObject.resume.downloadUrl = "/api/v1/profile/resume";
  }
  res.status(200).json(new ApiResponse(200, profileObject, "Profile fetched successfully"));
});

// ─── Create or Update Profile (Admin) ───────────────
export const upsertProfile = asyncHandler(async (req, res) => {
  const {
    name, title, bio, about, email, phone, location,
    "social.github": github,
    "social.linkedin": linkedin,
    "social.twitter": twitter,
    "social.leetcode": leetcode,
    "social.geeksforgeeks": geeksforgeeks,
  } = req.body;

  // Build social object from flat or nested input
  const social = {
    github: req.body?.social?.github || github || "",
    linkedin: req.body?.social?.linkedin || linkedin || "",
    twitter: req.body?.social?.twitter || twitter || "",
    leetcode: req.body?.social?.leetcode || leetcode || "",
    geeksforgeeks: req.body?.social?.geeksforgeeks || geeksforgeeks || "",
  };

  const updateData = { name, title, bio, about, email, phone, location, social };

  // Handle avatar upload
  if (req.files?.avatar?.[0]) {
    const existing = await Profile.findOne({}, "avatar");
    if (existing?.avatar?.publicId) {
      await deleteFromCloudinary(existing.avatar.publicId);
    }
    const result = await uploadOnCloudinary(req.files.avatar[0].path, "portfolio/avatars");
    if (!result) throw new ApiError(500, "Avatar upload failed");
    updateData.avatar = { url: result.secure_url, publicId: result.public_id };
  }

  // Handle resume upload (PDF)
  if (req.files?.resume?.[0]) {
    const existing = await Profile.findOne({}, "resume");
    if (existing?.resume?.publicId) {
      await deleteFromCloudinary(existing.resume.publicId, "raw");
    }
    const result = await uploadOnCloudinary(req.files.resume[0].path, "portfolio/resume");
    if (!result) throw new ApiError(500, "Resume upload failed");
    updateData.resume = { url: result.secure_url, publicId: result.public_id };
  }

  const profile = await Profile.findOneAndUpdate(
    {},
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, profile, "Profile updated successfully"));
});

// ─── Delete Resume (Admin) ────────────────────────────
export const deleteResume = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({}, "resume");
  if (!profile?.resume?.publicId) {
    throw new ApiError(404, "No resume found");
  }

  await deleteFromCloudinary(profile.resume.publicId, "raw");
  await Profile.findOneAndUpdate({}, { $set: { resume: { url: "", publicId: "" } } });

  res.status(200).json(new ApiResponse(200, {}, "Resume deleted successfully"));
});

export const getResumeDownloadUrl = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({}, "resume");

  if (!profile?.resume?.publicId) {
    throw new ApiError(404, "No resume found");
  }

  const signedUrl = cloudinary.url(profile.resume.publicId, {
    resource_type: "image",
    type: "upload",
    sign_url: true,
    secure: true,
    attachment: true,
    format: "pdf",
  });

  res.redirect(signedUrl);
});
