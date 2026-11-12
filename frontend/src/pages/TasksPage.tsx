import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TaskDialog } from "@/components/TaskDialog";
import { taskApi } from "@/services/api";
import type { Task, TaskPayload, TaskPriority, TaskStatus } from "@/types/task";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusLabel: Record<TaskStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
};
const priorityLabel: Record<TaskPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadTasks() {
    setLoading(true);
    try {
      setTasks(await taskApi.list());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha ao carregar tarefas.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesSearch = `${task.title} ${task.description ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "ALL" || task.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [tasks, search, statusFilter],
  );

  function openCreate() {
    setSelectedTask(null);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setSelectedTask(task);
    setDialogOpen(true);
  }

  async function saveTask(payload: TaskPayload) {
    try {
      if (selectedTask) {
        const updated = await taskApi.update(selectedTask.id, payload);
        setTasks((current) =>
          current.map((task) => (task.id === updated.id ? updated : task)),
        );
        toast.success("Tarefa atualizada com sucesso.");
      } else {
        const created = await taskApi.create(payload);
        setTasks((current) => [created, ...current]);
        toast.success("Tarefa criada com sucesso.");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a tarefa.";
      toast.error(message);
      throw error;
    }
  }

  async function deleteTask() {
    if (!taskToDelete || deleting) return;

    setDeleting(true);

    try {
      await taskApi.remove(taskToDelete.id);

      setTasks((current) =>
        current.filter((item) => item.id !== taskToDelete.id),
      );

      toast.success("Tarefa excluída com sucesso.");
      setTaskToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a tarefa.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-600">ORGANIZAÇÃO</p>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="mt-2 text-sm text-slate-500">
            Gerencie suas atividades em um só lugar.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={17} /> Nova tarefa
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título ou descrição..."
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border bg-white px-3 text-sm md:w-52"
            >
              <option value="ALL">Todos os status</option>
              <option value="PENDING">Pendente</option>
              <option value="IN_PROGRESS">Em andamento</option>
              <option value="COMPLETED">Concluída</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="h-48 animate-pulse bg-white">
              <CardContent className="space-y-4 p-5">
                <div className="h-4 w-2/3 rounded bg-slate-100" />
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-500">
              <Search size={22} />
            </div>
            <h2 className="font-semibold">
              {tasks.length === 0
                ? "Você ainda não tem tarefas"
                : "Nenhum resultado encontrado"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {tasks.length === 0
                ? "Adicione uma tarefa para começar a organizar seu trabalho."
                : "Tente ajustar a busca ou o filtro selecionado."}
            </p>
            {tasks.length === 0 && (
              <Button className="mt-5" onClick={openCreate}>
                <Plus size={16} /> Criar primeira tarefa
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="flex flex-col transition-shadow hover:shadow-md"
            >
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <Badge
                    variant={
                      task.status === "COMPLETED"
                        ? "success"
                        : task.status === "IN_PROGRESS"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {statusLabel[task.status]}
                  </Badge>
                  <Badge
                    variant={
                      task.priority === "HIGH"
                        ? "destructive"
                        : task.priority === "MEDIUM"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    Prioridade {priorityLabel[task.priority]}
                  </Badge>
                </div>
                <h3 className="font-semibold leading-snug">{task.title}</h3>
                <p className="mt-2 min-h-10 flex-1 text-sm leading-relaxed text-slate-500">
                  {task.description || "Sem descrição informada."}
                </p>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <span className="text-xs text-slate-500">
                    {task.dueDate
                      ? `Prazo: ${new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("pt-BR")}`
                      : "Sem prazo"}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Editar tarefa"
                      onClick={() => openEdit(task)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Excluir tarefa"
                      onClick={() => setTaskToDelete(task)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        onSubmit={saveTask}
      />

      <AlertDialog
        open={taskToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setTaskToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>

            <AlertDialogDescription>
              Tem certeza de que deseja excluir a tarefa{" "}
              <strong>{taskToDelete?.title}</strong>? Esta ação não poderá ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void deleteTask();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Excluindo..." : "Excluir tarefa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
