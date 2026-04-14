"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalBoards: number;
  totalTasks: number;
  totalUsers: number;
  tasksByPriority: Record<string, number>;
  tasksByColumn: Record<string, number>;
  recentBoards: { _id: string; name: string; createdAt: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const kpis = [
    { label: "Tableros", value: stats.totalBoards, icon: "🗂️", color: "bg-violet-50 text-violet-700" },
    { label: "Tareas", value: stats.totalTasks, icon: "📋", color: "bg-blue-50 text-blue-700" },
    { label: "Usuarios", value: stats.totalUsers, icon: "👥", color: "bg-emerald-50 text-emerald-700" },
    { label: "Urgentes", value: stats.tasksByPriority?.urgent || 0, icon: "🔴", color: "bg-red-50 text-red-700" },
  ];

  const priorityColors: Record<string, string> = {
    urgent: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Panel de Administración</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`rounded-xl p-5 ${kpi.color}`}>
            <div className="text-2xl mb-1">{kpi.icon}</div>
            <p className="text-3xl font-bold">{kpi.value}</p>
            <p className="text-sm opacity-70">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tasks by Priority */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Tareas por Prioridad</h2>
          <div className="space-y-3">
            {Object.entries(stats.tasksByPriority || {}).map(([priority, count]) => (
              <div key={priority} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${priorityColors[priority] || "bg-slate-400"}`} />
                <span className="text-sm text-slate-600 capitalize flex-1">{priority}</span>
                <span className="font-bold text-slate-900">{count}</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${priorityColors[priority] || "bg-slate-400"}`}
                    style={{ width: `${Math.min(100, (count / stats.totalTasks) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks by Column/Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Tareas por Estado</h2>
          <div className="space-y-3">
            {Object.entries(stats.tasksByColumn || {}).map(([col, count]) => (
              <div key={col} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{col}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{count}</span>
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${Math.min(100, (count / stats.totalTasks) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Boards */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-4">Tableros Recientes</h2>
          <div className="divide-y divide-slate-100">
            {stats.recentBoards?.map((board) => (
              <div key={board._id} className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-slate-900">🗂️ {board.name}</span>
                <span className="text-xs text-slate-400">{new Date(board.createdAt).toLocaleDateString("es")}</span>
              </div>
            ))}
            {(!stats.recentBoards || stats.recentBoards.length === 0) && (
              <p className="text-sm text-slate-400 py-3">No hay tableros</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
