import dotenv from "dotenv";
dotenv.config();
import Profile from "../models/Profile.model.js";
import Project from "../models/Project.model.js";
import Skill from "../models/Skill.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";

// ─── Build system prompt from live DB data ───────────
const buildSystemPrompt = async () => {
  const [profile, projects, skills] = await Promise.all([
    Profile.findOne().lean(),
    Project.find({ status: "completed" })
      .select("title shortDescription techStack category")
      .lean(),
    Skill.find().lean(),
  ]);

  const skillList = skills.map((s) => `${s.name} (${s.category})`).join(", ");
  const projectList = projects
    .map(
      (p) =>
        `• ${p.title}: ${p.shortDescription || p.description?.slice(0, 100)} [${p.techStack?.join(", ")}]`
    )
    .join("\n");

  return `You are an AI assistant embedded in the personal portfolio of ${profile?.name || "a developer"}.
Your role is to answer questions about this developer in a friendly, professional, and concise manner.

== ABOUT ==
Name: ${profile?.name}
Title: ${profile?.title}
Bio: ${profile?.bio}
Location: ${profile?.location}
Email: ${profile?.email}

== SOCIAL LINKS ==
GitHub: ${profile?.social?.github || "https://github.com/byteRaj-commits"}
LinkedIn: ${profile?.social?.linkedin || "Not listed yet"}
LeetCode: ${profile?.social?.leetcode || "https://leetcode.com/u/Raj7753/"}
GeeksForGeeks: ${profile?.social?.geeksforgeeks || "https://www.geeksforgeeks.org/profile/rajp18zsll"}

== SKILLS ==
${skillList}

== PROJECTS ==
${projectList}

== GUIDELINES ==
- Only answer questions related to this developer, their work, skills, and projects.
- If asked something unrelated (politics, world events, general coding help), politely redirect.
- Keep answers short and helpful (2-4 sentences max unless asked for detail).
- Suggest contacting the developer via the contact section for collaboration inquiries.
- Do not make up information not provided above.
- Be enthusiastic but professional about the developer's work.`;
};

// ─── Parse SSE stream and extract final text ─────────
const parseSSEStream = (stream) => {
  return new Promise((resolve, reject) => {
    let fullContent = "";
    let buffer = "";

    stream.on("data", (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");

      // Keep the last potentially incomplete line in the buffer
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const jsonStr = trimmed.slice(5).trim();
        if (jsonStr === "[DONE]") continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) fullContent += delta;
        } catch (_) {
          // skip malformed SSE lines
        }
      }
    });

    stream.on("end", () => resolve(fullContent.trim() || "I'm sorry, I couldn't generate a response."));
    stream.on("error", (err) => reject(err));
  });
};

// ─── Chat with AI — Streaming via NVIDIA NIM ─────────
export const chat = asyncHandler(async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ApiError(400, "Messages array is required");
  }

  const validRoles = ["user", "assistant"];
  const isValid = messages.every(
    (m) =>
      validRoles.includes(m.role) &&
      typeof m.content === "string" &&
      m.content.trim()
  );
  if (!isValid) {
    throw new ApiError(
      400,
      "Each message must have a valid role (user/assistant) and a non-empty content string"
    );
  }

  // Limit history to last 20 messages
  const trimmedMessages = messages.slice(-20);
  const systemPrompt = await buildSystemPrompt();

  const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";

  const payload = {
    model: "google/gemma-4-31b-it",
    messages: [
      { role: "user", content: systemPrompt },   // Gemma doesn't support system role — inject as first user turn
      { role: "assistant", content: "Understood. I'll answer as this developer's portfolio assistant." },
      ...trimmedMessages,
    ],
    max_tokens: 512,
    temperature: 1.0,
    top_p: 0.95,
    stream: true,
    chat_template_kwargs: { enable_thinking: false }, // disable chain-of-thought for portfolio chat
  };

  let axiosResponse;
  try {
    axiosResponse = await axios.post(invokeUrl, payload, {
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Accept": "text/event-stream",
        "Content-Type": "application/json",
      },
      responseType: "stream",
      timeout: 30000,
    });
  } catch (err) {
    // Axios throws on non-2xx — extract NVIDIA's error message
    const status = err.response?.status;
    let detail = "AI service temporarily unavailable";

    if (err.response?.data) {
      try {
        const chunks = [];
        for await (const chunk of err.response.data) chunks.push(chunk);
        const body = JSON.parse(Buffer.concat(chunks).toString());
        detail = body?.detail || body?.message || detail;
        console.error("NVIDIA NIM error:", status, body);
      } catch (_) {}
    }

    throw new ApiError(502, detail);
  }

  // Consume the SSE stream and collect the full reply
  const reply = await parseSSEStream(axiosResponse.data);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        role: "assistant",
        content: reply,
      },
      "AI response generated"
    )
  );
});