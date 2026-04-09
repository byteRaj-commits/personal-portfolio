import Admin from "../models/Admin.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  //  process.env.NODE_ENV === "production",
  // sameSite: "strict",
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// ─── Login ───────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await admin.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  // Save refresh token to DB
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  const safeAdmin = { _id: admin._id, email: admin.email };

  res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
    .json(new ApiResponse(200, { admin: safeAdmin, accessToken }, "Login successful"));
});

// ─── Logout ──────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      returnDocument: "after",
    }
  );

  res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ─── Refresh Access Token ────────────────────────────
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decoded = jwt.verify(incomingToken, process.env.JWT_SECRET + "_refresh");

  const admin = await Admin.findById(decoded._id).select("+refreshToken");
  if (!admin || admin.refreshToken !== incomingToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
    .json(new ApiResponse(200, { accessToken }, "Token refreshed successfully"));
});

// ─── Change Password ─────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Both current and new passwords are required");
  }
  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters");
  }

  const admin = await Admin.findById(req.admin._id).select("+password");
  const isMatch = await admin.isPasswordCorrect(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  admin.password = newPassword;
  await admin.save();

  res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ─── Get Me ──────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.admin, "Admin fetched successfully"));
});
