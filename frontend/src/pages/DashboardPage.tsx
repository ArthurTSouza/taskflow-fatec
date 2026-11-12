import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, CircleDashed, Clock3, ListTodo, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { taskApi } from "@/services/api";
import type { Task } from "@/types/task";

const statusLabel = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída"
} as const;

const priorityVariant = {
  LOW: "secondary",
  MEDIUM: "warning",
  HIGH: "destructive"
} as const;

const priorityLabel = { LOW: "Baixa", MEDIUM: "Média", HIGH: "Alta" } as const;

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskApi.list()
      .then(setTasks)
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Não foi possível carregar as tarefas."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "PENDING").length,
    progress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    completed: tasks.filter((task) => task.status === "COMPLETED").length
  }), [tasks]);

  const recent = tasks.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-600">TERÇA-FEIRA · SEU PAINEL</p>
          <h1 className="text-3xl font-bold tracking-tight">Visão geral</h1>
          <p className="mt-2 text-sm text-slate-500">Acompanhe suas tarefas e mantenha tudo em movimento.</p>
        </div>
        <Button asChild><Link to="/tarefas"><Plus size={17} /> Nova tarefa</Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total de tarefas", value: stats.total, icon: ListTodo, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pendentes", value: stats.pending, icon: CircleDashed, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Em andamento", value: stats.progress, icon: Clock3, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Concluídas", value: stats.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-bold">{loading ? "—" : item.value}</p>
              </div>
              <div className={`rounded-xl p-3 ${item.bg} ${item.color}`}><item.icon size={21} /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="font-semibold">Tarefas recentes</h2>
            <p className="mt-1 text-sm text-slate-500">As últimas atividades adicionadas.</p>
          </div>
          <Button variant="ghost" size="sm" asChild><Link to="/tarefas">Ver todas <ArrowUpRight size={15} /></Link></Button>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6"><div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" /><div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" /><div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" /></div>
          ) : recent.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search size={20} /></div>
              <p className="font-medium">Nenhuma tarefa por aqui</p>
              <p className="mt-1 text-sm text-slate-500">Crie sua primeira tarefa para começar.</p>
              <Button className="mt-4" asChild><Link to="/tarefas"><Plus size={16} /> Criar tarefa</Link></Button>
            </div>
          ) : (
            <div className="divide-y">
              {recent.map((task) => (
                <div key={task.id} className="flex flex-col justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{task.title}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{task.description || "Sem descrição"}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={priorityVariant[task.priority]}>{priorityLabel[task.priority]}</Badge>
                    <Badge variant={task.status === "COMPLETED" ? "success" : task.status === "IN_PROGRESS" ? "default" : "secondary"}>{statusLabel[task.status]}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
