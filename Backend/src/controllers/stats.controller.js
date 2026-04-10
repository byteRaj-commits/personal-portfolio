import Stats from "../models/Stats.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { syncLeetcodeStats } from "../utils/leetcodeSync.js";
import { syncGfgStats } from "../utils/gfgSync.js";

// ─── Get All Platform Stats (Public) ─────────────────
export const getAllStats = asyncHandler(async (req, res) => {
  const stats = await Stats.find();

  const formatted = {};
  stats.forEach((s) => {
    formatted[s.platform] = s[s.platform];
  });

  try {
    formatted.leetcode = await syncLeetcodeStats();
  } catch (error) {
    console.error("LeetCode sync failed:", error.message);
  }

  try {
    formatted.geeksforgeeks = await syncGfgStats();
  } catch (error) {
    console.error("GFG sync failed:", error.message);
  }

  res.status(200).json(new ApiResponse(200, formatted, "Stats fetched successfully"));
});

// ─── Get Stats by Platform (Public) ──────────────────
export const getStatsByPlatform = asyncHandler(async (req, res) => {
  const { platform } = req.params;
  const validPlatforms = ["leetcode", "github", "geeksforgeeks"];

  if (!validPlatforms.includes(platform)) {
    throw new ApiError(400, `Invalid platform. Valid: ${validPlatforms.join(", ")}`);
  }

  const stats = await Stats.findOne({ platform });
  if (!stats) throw new ApiError(404, `Stats for ${platform} not found`);

  if (platform === "leetcode") {
    try {
      const liveStats = await syncLeetcodeStats();
      return res
        .status(200)
        .json(new ApiResponse(200, liveStats, `${platform} stats fetched`));
    } catch (error) {
      console.error("LeetCode sync failed:", error.message);
    }
  }

  if (platform === "geeksforgeeks") {
    try {
      const liveStats = await syncGfgStats();
      return res
        .status(200)
        .json(new ApiResponse(200, liveStats, `${platform} stats fetched`));
    } catch (error) {
      console.error("GFG sync failed:", error.message);
    }
  }

  res.status(200).json(new ApiResponse(200, stats[platform], `${platform} stats fetched`));
});

// ─── Upsert LeetCode Stats (Admin) ───────────────────
export const upsertLeetcodeStats = asyncHandler(async (req, res) => {
  const {
    username, totalSolved, easySolved, mediumSolved, hardSolved,
    ranking, totalQuestions, acceptanceRate, streak, profileUrl,
  } = req.body;

  const stats = await Stats.findOneAndUpdate(
    { platform: "leetcode" },
    {
      $set: {
        platform: "leetcode",
        "leetcode.username": username,
        "leetcode.totalSolved": totalSolved,
        "leetcode.easySolved": easySolved,
        "leetcode.mediumSolved": mediumSolved,
        "leetcode.hardSolved": hardSolved,
        "leetcode.ranking": ranking,
        "leetcode.totalQuestions": totalQuestions,
        "leetcode.acceptanceRate": acceptanceRate,
        "leetcode.streak": streak,
        "leetcode.profileUrl": profileUrl,
        "leetcode.lastUpdated": new Date(),
      },
    },
    { new: true, upsert: true }
  );

  res.status(200).json(new ApiResponse(200, stats.leetcode, "LeetCode stats updated"));
});

// ─── Upsert GitHub Stats (Admin) ─────────────────────
export const upsertGithubStats = asyncHandler(async (req, res) => {
  const {
    username, publicRepos, totalStars, followers, following,
    totalCommits, contributionStreak, topLanguages, profileUrl, avatarUrl,
  } = req.body;

  const stats = await Stats.findOneAndUpdate(
    { platform: "github" },
    {
      $set: {
        platform: "github",
        "github.username": username,
        "github.publicRepos": publicRepos,
        "github.totalStars": totalStars,
        "github.followers": followers,
        "github.following": following,
        "github.totalCommits": totalCommits,
        "github.contributionStreak": contributionStreak,
        "github.topLanguages": topLanguages || [],
        "github.profileUrl": profileUrl,
        "github.avatarUrl": avatarUrl,
        "github.lastUpdated": new Date(),
      },
    },
    { new: true, upsert: true }
  );

  res.status(200).json(new ApiResponse(200, stats.github, "GitHub stats updated"));
});

// ─── Upsert GFG Stats (Admin) ────────────────────────
export const upsertGFGStats = asyncHandler(async (req, res) => {
  const {
    username, totalProblemsSolved, school, basic, easy, medium, hard,
    codingScore, instituteRank, monthlyScore, streak, profileUrl,
  } = req.body;

  const stats = await Stats.findOneAndUpdate(
    { platform: "geeksforgeeks" },
    {
      $set: {
        platform: "geeksforgeeks",
        "geeksforgeeks.username": username,
        "geeksforgeeks.totalProblemsSolved": totalProblemsSolved,
        "geeksforgeeks.school": school,
        "geeksforgeeks.basic": basic,
        "geeksforgeeks.easy": easy,
        "geeksforgeeks.medium": medium,
        "geeksforgeeks.hard": hard,
        "geeksforgeeks.codingScore": codingScore,
        "geeksforgeeks.instituteRank": instituteRank,
        "geeksforgeeks.monthlyScore": monthlyScore,
        "geeksforgeeks.streak": streak,
        "geeksforgeeks.profileUrl": profileUrl,
        "geeksforgeeks.lastUpdated": new Date(),
      },
    },
    { new: true, upsert: true }
  );

  res.status(200).json(new ApiResponse(200, stats.geeksforgeeks, "GFG stats updated"));
});
