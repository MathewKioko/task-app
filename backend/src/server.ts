import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// If you already import routes, keep them
// import taskRoutes from "./routes/tasks";

const app = express();
const PORT = process.env.PORT || 3000;

// Required for ES modules + TS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// ================= API ROUTES =================
// app.use("/api/tasks", taskRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ================= FRONTEND =================
const distPath = path.join(__dirname, "../../dist");

// Serve static files
app.use(express.static(distPath));

// SPA fallback (React Router support)
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
