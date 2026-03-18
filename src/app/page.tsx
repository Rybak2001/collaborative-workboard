"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Board {
  _id: string;
  name: string;
  description: string;
  columns: string[];
  createdAt: string;
}

export default function HomePage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/api/boards")
      .then((r) => r.json())
      .then(setBoards);
  }, []);

  async function createBoard() {
    if (!name.trim()) return;
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) {
      const board = await res.json();
      setBoards((prev) => [board, ...prev]);
      setName("");
      setDescription("");
      setShowCreate(false);
    }
  }

  async function deleteBoard(id: string) {
    if (!confirm("¿Eliminar este tablero y todas sus tareas?")) return;
    const res = await fetch(`/api/boards/${id}`, { method: "DELETE" });
    if (res.ok) setBoards((prev) => prev.filter((b) => b._id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Tableros</h1>
          <p className="text-slate-500 text-sm">{boards.length} tableros</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition text-sm font-medium"
        >
          + Nuevo Tablero
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h2 className="font-semibold text-slate-900 mb-3">Nuevo Tablero</h2>
          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del tablero"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción (opcional)"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
            />
            <div className="flex gap-2">
              <button onClick={createBoard} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-700">
                Crear
              </button>
              <button onClick={() => setShowCreate(false)} className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {boards.length === 0 && !showCreate ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <div className="text-6xl mb-4">🗂️</div>
          <p className="text-slate-400 text-lg mb-4">No tienes tableros aún</p>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-violet-600 text-white px-5 py-2.5 rounded-lg hover:bg-violet-700 transition"
          >
            Crear primer tablero
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board._id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between mb-2">
                <Link href={`/boards/${board._id}`} className="flex-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-violet-600 transition">
                    {board.name}
                  </h3>
                </Link>
                <button
                  onClick={() => deleteBoard(board._id)}
                  className="text-slate-300 hover:text-red-500 text-sm ml-2"
                >
                  ✕
                </button>
              </div>
              {board.description && (
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{board.description}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {board.columns.map((col) => (
                  <span key={col} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {col}
                  </span>
                ))}
              </div>
              <Link
                href={`/boards/${board._id}`}
                className="text-sm text-violet-600 hover:text-violet-800 font-medium"
              >
                Abrir tablero →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
