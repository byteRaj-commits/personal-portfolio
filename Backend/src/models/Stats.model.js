import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ["leetcode", "github", "geeksforgeeks"],
      unique: true,
    },

    // ─── LeetCode ───────────────────────────────
    leetcode: {
      username: { type: String, default: "" },
      totalSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      ranking: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 0 },
      acceptanceRate: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      profileUrl: { type: String, default: "" },
      lastUpdated: { type: Date, default: Date.now },
    },

    // ─── GitHub ─────────────────────────────────
    github: {
      username: { type: String, default: "" },
      publicRepos: { type: Number, default: 0 },
      totalStars: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
      totalCommits: { type: Number, default: 0 },
      contributionStreak: { type: Number, default: 0 },
      topLanguages: [
        {
          name: String,
          percentage: Number,
          color: String,
        },
      ],
      profileUrl: { type: String, default: "" },
      avatarUrl: { type: String, default: "" },
      lastUpdated: { type: Date, default: Date.now },
    },

    // ─── GeeksForGeeks ──────────────────────────
    geeksforgeeks: {
      username: { type: String, default: "" },
      totalProblemsSolved: { type: Number, default: 0 },
      school: { type: Number, default: 0 },
      basic: { type: Number, default: 0 },
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
      codingScore: { type: Number, default: 0 },
      instituteRank: { type: Number, default: 0 },
      monthlyScore: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      profileUrl: { type: String, default: "" },
      lastUpdated: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

const Stats = mongoose.model("Stats", statsSchema);
export default Stats;
