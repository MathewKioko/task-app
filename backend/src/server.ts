import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});

// Get all tasks
app.get("/tasks", async (_req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(tasks);
});

// Create task
app.post("/tasks", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = await prisma.task.create({
    data: { title },
  });

  res.status(201).json(task);
});

// Toggle task
app.patch("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
  });

  res.json(updated);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
