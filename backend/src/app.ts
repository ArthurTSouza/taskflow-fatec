import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";

const app = express();

const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors(allowedOrigin ? { origin: allowedOrigin.split(",").map((item) => item.trim()) } : undefined));
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: Number(process.uptime().toFixed(2))
  });
});

app.use("/api/tasks", taskRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  if (!res.headersSent) {
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default app;
