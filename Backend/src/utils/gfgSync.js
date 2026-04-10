import axios from "axios";
import Stats from "../models/Stats.model.js";
import ApiError from "./ApiError.js";

const DEFAULT_GFG_USERNAME = "rajp18zsll";
const DEFAULT_GFG_BASE_URL = "https://www.geeksforgeeks.org";

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const buildProfileUrl = (username) =>
  `https://www.geeksforgeeks.org/profile/${username}`;

const extractObjectAfterMarker = (text, marker) => {
  const start = text.indexOf(marker);
  if (start < 0) return null;

  const objectStart = text.indexOf("{", start + marker.length);
  if (objectStart < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = objectStart; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      continue;
    }

    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(objectStart, i + 1);
      }
    }
  }

  return null;
};

const parseGfgRscPayload = (text) => {
  const rawObject = extractObjectAfterMarker(text, "\"userData\":");

  if (!rawObject) {
    throw new ApiError(502, "Could not locate GFG user data in public response.");
  }

  const parsed = JSON.parse(rawObject);

  if (parsed?.error) {
    throw new ApiError(502, parsed.error);
  }

  return parsed?.data ?? {};
};

const mapGfgPayload = (info, username) => {
  const school = toNumber(info.school, 0);
  const basic = toNumber(info.basic, 0);
  const easy = toNumber(info.easy, 0);
  const medium = toNumber(info.medium, 0);
  const hard = toNumber(info.hard, 0);

  return {
    username,
    totalProblemsSolved: toNumber(info.total_problems_solved, school + basic + easy + medium + hard),
    school,
    basic,
    easy,
    medium,
    hard,
    codingScore: toNumber(info.score, 0),
    instituteRank: toNumber(info.institute_rank, 0),
    monthlyScore: toNumber(info.monthly_score, 0),
    streak: toNumber(info.pod_solved_current_streak, 0),
    profileUrl: buildProfileUrl(username),
    lastUpdated: new Date(),
  };
};

export const syncGfgStats = async () => {
  const username = process.env.GFG_USERNAME || DEFAULT_GFG_USERNAME;
  const baseUrl = process.env.GFG_BASE_URL || DEFAULT_GFG_BASE_URL;
  const url = `${baseUrl.replace(/\/$/, "")}/profile/${username}?tab=activity&_rsc=codex`;

  const response = await axios.get(url, {
    timeout: 10000,
    headers: {
      Accept: "*/*",
      RSC: "1",
      "Next-Url": `/profile/${username}`,
      "Next-Router-State-Tree":
        `[%22%22,{%22children%22:[%22profile%22,{%22children%22:[[%22username%22,%22${username}%22,%22d%22],{%22children%22:[%22__PAGE__%22,{},null,null]}]}]}]`,
      "User-Agent": "Mozilla/5.0",
    },
  });

  const payload = parseGfgRscPayload(String(response.data));
  const mapped = mapGfgPayload(payload, username);

  const stats = await Stats.findOneAndUpdate(
    { platform: "geeksforgeeks" },
    {
      $set: {
        platform: "geeksforgeeks",
        geeksforgeeks: mapped,
      },
    },
    { new: true, upsert: true }
  );

  return stats.geeksforgeeks;
};
