import { NavLink, Outlet } from "react-router-dom";
import { CheckSquare, LayoutDashboard, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-white px-5 py-7 lg:block">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <CheckSquare size={21} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">TaskFlow</p>
            <p className="text-xs text-muted-foreground">Organize seu trabalho</p>
          </div>
        </div>
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">Workspace</p>
        <nav className="space-y-1">
          <NavLink to="/" end className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition", isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}>
            <LayoutDashboard size={18} /> Visão geral
          </NavLink>
          <NavLink to="/tarefas" className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition", isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}>
            <ListTodo size={18} /> Tarefas
          </NavLink>
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold">Mantenha o foco.</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Pequenos passos levam a grandes entregas.</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white/90 px-5 backdrop-blur md:px-9">
          <div className="flex items-center gap-2 lg:hidden">
            <CheckSquare className="text-blue-600" size={22} />
            <span className="font-bold">TaskFlow</span>
          </div>
          <div className="hidden text-sm text-slate-500 lg:block">Seu espaço de produtividade</div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Workspace pessoal
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-5 md:p-9">
          <div className="mb-5 flex gap-2 lg:hidden">
            <NavLink to="/" end className="rounded-md border bg-white px-3 py-2 text-sm">Visão geral</NavLink>
            <NavLink to="/tarefas" className="rounded-md border bg-white px-3 py-2 text-sm">Tarefas</NavLink>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
