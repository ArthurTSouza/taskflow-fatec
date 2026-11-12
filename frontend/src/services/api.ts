import type { Task, TaskPayload } from "@/types/task";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : `Erro HTTP ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const taskApi = {
  list: (): Promise<Task[]> => request<Task[]>("/api/tasks"),
  create: (payload: TaskPayload): Promise<Task> =>
    request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: TaskPayload): Promise<Task> =>
    request<Task>(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number): Promise<void> =>
    request<void>(`/api/tasks/${id}`, { method: "DELETE" })
};
