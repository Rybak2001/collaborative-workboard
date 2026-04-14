"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Board {
  _id: string;
  name: string;
  description: string;
  columns: string[];
  taskCount: number;
  createdAt: string;
}

export default function AdminBoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    fetch("/api/admin/boards")
      .then((r) => r.json())
      .then(setBoards);
  }, []);

  async function deleteBoard(id: string) {
    if (!confirm("¿Eliminar este tablero y todas sus tareas?")) return;
    const res = await fetch(`/api/boards/${id}`, { method: "DELETE" });
    if (res.ok) setBoards((prev) => prev.filter((b) => b._id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Gestión de Tableros</h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Tablero</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Columnas</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Tareas</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Creado</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {boards.map((b) => (
              <tr key={b._id}>
                <td className="px-4 py-3">
                  <Link href={`/boards/${b._id}`} className="font-medium text-violet-600 hover:text-violet-800">
                    {b.name}
                  </Link>
                  {b.description && <p className="text-xs text-slate-400 mt-0.5">{b.description}</p>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {b.columns.map((c) => (
                      <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{b.taskCount}</td>
                <td className="px-4 py-3 text-xs text-slate-400">{new Date(b.createdAt).toLocaleDateString("es")}</td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteBoard(b._id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded transition">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {boards.length === 0 && (
          <p className="text-center text-slate-400 py-8 text-sm">No hay tableros</p>
        )}
      </div>
    </div>
  );
}
