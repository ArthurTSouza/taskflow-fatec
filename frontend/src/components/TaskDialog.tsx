import { useEffect, useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Task, TaskPayload, TaskPriority, TaskStatus } from "@/types/task";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSubmit: (payload: TaskPayload) => Promise<void>;
}

const emptyForm: TaskPayload = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: null
};

export function TaskDialog({ open, onOpenChange, task, onSubmit }: TaskDialogProps) {
  const [form, setForm] = useState<TaskPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(task ? {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
      } : emptyForm);
    }
  }, [open, task]);

  function update<K extends keyof TaskPayload>(key: K, value: TaskPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ ...form, title: form.title.trim() });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
          <DialogDescription>Preencha os dados para organizar sua atividade.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" required maxLength={120} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Ex.: Preparar apresentação" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea id="description" value={form.description ?? ""} onChange={(e) => update("description", e.target.value)} rows={3} placeholder="Detalhes da tarefa..." className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <select id="priority" value={form.priority} onChange={(e) => update("priority", e.target.value as TaskPriority)} className="h-10 w-full rounded-lg border bg-white px-3 text-sm">
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" value={form.status} onChange={(e) => update("status", e.target.value as TaskStatus)} className="h-10 w-full rounded-lg border bg-white px-3 text-sm">
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="COMPLETED">Concluída</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Prazo</Label>
            <Input id="dueDate" type="date" value={form.dueDate ?? ""} onChange={(e) => update("dueDate", e.target.value || null)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving || !form.title.trim()}>{saving ? "Salvando..." : task ? "Salvar alterações" : "Criar tarefa"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
