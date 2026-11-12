import { Request, Response } from "express";
import { ValidationError } from "sequelize";
import { Task, TaskPriority, TaskStatus } from "../models/Task";

const statuses: TaskStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED"];
const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

function validTaskBody(body: unknown): body is {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
} {
  if (!body || typeof body !== "object") return false;
  const value = body as Record<string, unknown>;
  return (
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    value.title.trim().length <= 120 &&
    (value.description === undefined ||
      value.description === null ||
      typeof value.description === "string") &&
    (value.status === undefined || statuses.includes(value.status as TaskStatus)) &&
    (value.priority === undefined || priorities.includes(value.priority as TaskPriority)) &&
    (value.dueDate === undefined ||
      value.dueDate === null ||
      (typeof value.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.dueDate)))
  );
}

export async function listTasks(_req: Request, res: Response): Promise<void> {
  const tasks = await Task.findAll({ order: [["createdAt", "DESC"]] });
  res.status(200).json(tasks);
}

export async function getTask(req: Request, res: Response): Promise<void> {
  const task = await Task.findByPk(Number(req.params.id));
  if (!task) {
    res.status(404).json({ message: "Tarefa não encontrada." });
    return;
  }
  res.status(200).json(task);
}

export async function createTask(req: Request, res: Response): Promise<void> {
  if (!validTaskBody(req.body)) {
    res.status(400).json({ message: "Dados inválidos. Informe um título e valores válidos." });
    return;
  }
  const task = await Task.create({
    title: req.body.title.trim(),
    description: req.body.description?.trim() || null,
    status: req.body.status ?? "PENDING",
    priority: req.body.priority ?? "MEDIUM",
    dueDate: req.body.dueDate ?? null
  });
  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  if (!validTaskBody(req.body)) {
    res.status(400).json({ message: "Dados inválidos. Informe um título e valores válidos." });
    return;
  }
  const task = await Task.findByPk(Number(req.params.id));
  if (!task) {
    res.status(404).json({ message: "Tarefa não encontrada." });
    return;
  }
  await task.update({
    title: req.body.title.trim(),
    description: req.body.description?.trim() || null,
    status: req.body.status ?? task.status,
    priority: req.body.priority ?? task.priority,
    dueDate: req.body.dueDate === undefined ? task.dueDate : req.body.dueDate
  });
  res.status(200).json(task);
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const task = await Task.findByPk(Number(req.params.id));
  if (!task) {
    res.status(404).json({ message: "Tarefa não encontrada." });
    return;
  }
  await task.destroy();
  res.status(204).send();
}

export function handleControllerError(error: unknown, res: Response): void {
  if (error instanceof ValidationError) {
    res.status(400).json({ message: "Os dados informados são inválidos." });
    return;
  }
  console.error(error);
  res.status(500).json({ message: "Erro interno ao processar a solicitação." });
}
