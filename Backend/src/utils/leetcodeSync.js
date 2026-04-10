import axios from "axios";
import Stats from "../models/Stats.model.js";

const DEFAULT_LEETCODE_PROFILE_API =
  "https://4.213.1.116.nip.io/api/v1/users/Raj7753/profile";

const getValue = (source, paths, fallback = undefined) => {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, key) => acc?.[key], source);
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return fallback;
};

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const getDifficultyCount = (items, difficulty) => {
  if (!Array.isArray(items)) return 0;
  const match = items.find((item) => item?.difficulty === difficulty);
  return toNumber(match?.count, 0);
};

const mapLeetcodePayload = (payload) => {
  const root = payload?.data ?? payload ?? {};

  const username = getValue(root, [
    "username",
    "user.username",
    "profile.username",
    "matchedUser.username",
  ], "Raj7753");

  const easySolved = toNumber(
    getValue(root, [
      "easySolved",
      "submitStats.acSubmissionNum.1.count",
      "submitStatsGlobal.acSubmissionNum.1.count",
      "profile.easySolved",
    ], getDifficultyCount(root.numAcceptedQuestions, "EASY"))
  );

  const mediumSolved = toNumber(
    getValue(root, [
      "mediumSolved",
      "submitStats.acSubmissionNum.2.count",
      "submitStatsGlobal.acSubmissionNum.2.count",
      "profile.mediumSolved",
    ], getDifficultyCount(root.numAcceptedQuestions, "MEDIUM"))
  );

  const hardSolved = toNumber(
    getValue(root, [
      "hardSolved",
      "submitStats.acSubmissionNum.3.count",
      "submitStatsGlobal.acSubmissionNum.3.count",
      "profile.hardSolved",
    ], getDifficultyCount(root.numAcceptedQuestions, "HARD"))
  );

  const totalQuestions =
    getDifficultyCount(root.numAcceptedQuestions, "EASY") +
    getDifficultyCount(root.numAcceptedQuestions, "MEDIUM") +
    getDifficultyCount(root.numAcceptedQuestions, "HARD") +
    getDifficultyCount(root.numFailedQuestions, "EASY") +
    getDifficultyCount(root.numFailedQuestions, "MEDIUM") +
    getDifficultyCount(root.numFailedQuestions, "HARD") +
    getDifficultyCount(root.numUntouchedQuestions, "EASY") +
    getDifficultyCount(root.numUntouchedQuestions, "MEDIUM") +
    getDifficultyCount(root.numUntouchedQuestions, "HARD");

  return {
    username,
    totalSolved: toNumber(
      getValue(root, [
        "totalSolved",
        "submitStats.acSubmissionNum.0.count",
        "submitStatsGlobal.acSubmissionNum.0.count",
        "profile.totalSolved",
      ], easySolved + mediumSolved + hardSolved)
    ),
    easySolved,
    mediumSolved,
    hardSolved,
    easyTotal: getDifficultyCount(root.numAcceptedQuestions, "EASY") +
      getDifficultyCount(root.numFailedQuestions, "EASY") +
      getDifficultyCount(root.numUntouchedQuestions, "EASY"),
    mediumTotal: getDifficultyCount(root.numAcceptedQuestions, "MEDIUM") +
      getDifficultyCount(root.numFailedQuestions, "MEDIUM") +
      getDifficultyCount(root.numUntouchedQuestions, "MEDIUM"),
    hardTotal: getDifficultyCount(root.numAcceptedQuestions, "HARD") +
      getDifficultyCount(root.numFailedQuestions, "HARD") +
      getDifficultyCount(root.numUntouchedQuestions, "HARD"),
    ranking: toNumber(
      getValue(root, ["ranking", "profile.ranking", "userContestRanking.globalRanking"], 0)
    ),
    totalQuestions: toNumber(
      getValue(root, [
        "totalQuestions",
        "totalQuestionsCount",
        "profile.totalQuestions",
      ], totalQuestions)
    ),
    acceptanceRate: toNumber(
      getValue(root, [
        "acceptanceRate",
        "profile.acceptanceRate",
        "totalQuestionBeatsPercentage",
      ], 0)
    ),
    streak: toNumber(
      getValue(root, [
        "streak",
        "userCalendar.streak",
        "profile.streak",
      ], 0)
    ),
    profileUrl: getValue(root, [
      "profileUrl",
      "url",
      "profile.url",
      "leetcodeUrl",
    ], `https://leetcode.com/u/${username}/`),
    lastUpdated: new Date(),
  };
};

export const syncLeetcodeStats = async () => {
  const url = process.env.LEETCODE_PROFILE_API_URL || DEFAULT_LEETCODE_PROFILE_API;

  const response = await axios.get(url, {
    timeout: 10000,
    headers: { Accept: "application/json" },
  });

  const mapped = mapLeetcodePayload(response.data);

  const stats = await Stats.findOneAndUpdate(
    { platform: "leetcode" },
    {
      $set: {
        platform: "leetcode",
        leetcode: mapped,
      },
    },
    { new: true, upsert: true }
  );

  return stats.leetcode;
};
