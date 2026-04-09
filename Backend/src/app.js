import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ─── Route Imports ───────────────────────────────────
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import projectRoutes from "./routes/project.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import aiRoutes from "./routes/ai.routes.js";

// ─── Middleware Imports ──────────────────────────────
import errorHandler from "./middleware/error.middleware.js";

const app = express();

// ─── Core Middleware ─────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ─── Health Check ────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running ",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ──────────────────────────────────────
const API = "/api/v1";

app.use(`${API}/auth`, authRoutes);
app.use(`${API}/profile`, profileRoutes);
app.use(`${API}/projects`, projectRoutes);
app.use(`${API}/skills`, skillRoutes);
app.use(`${API}/contact`, contactRoutes);
app.use(`${API}/stats`, statsRoutes);
app.use(`${API}/ai`, aiRoutes);

// ─── 404 Handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ────────────────────────────
app.use(errorHandler);

export default app;
