"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import TaskCard from "@/components/TaskCard";
import { getPusherClient } from "@/lib/pusher-client";

interface Task {
  _id: string;
  title: string;
  description: string;
  column: string;
  priority: string;
  assignedTo: string;
  order: number;
}

interface Board {
  _id: string;
  name: string;
  description: string;
  columns: string[];
  tasks: Task[];
}

export default function BoardPage() {
  const params = useParams();
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newAssigned, setNewAssigned] = useState("");

  const loadBoard = useCallback(() => {
    fetch(`/api/boards/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setBoard(data);
        setTasks(data.tasks || []);
      });
  }, [params.id]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  // Real-time with Pusher
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`board-${params.id}`);

    channel.bind("task-created", (task: Task) => {
      setTasks((prev) => [...prev, task]);
    });

    channel.bind("task-updated", (updated: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    });

    channel.bind("task-deleted", ({ _id }: { _id: string }) => {
      setTasks((prev) => prev.filter((t) => t._id !== _id));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`board-${params.id}`);
    };
  }, [params.id]);

  async function addTask(column: string) {
    if (!newTitle.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        column,
        priority: newPriority,
        assignedTo: newAssigned,
        boardId: params.id,
      }),
    });

    setNewTitle("");
    setNewPriority("medium");
    setNewAssigned("");
    setAddingTo(null);
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData("taskId", taskId);
  }

  async function handleDrop(e: React.DragEvent, targetColumn: string) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.column === targetColumn) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, column: targetColumn } : t))
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, column: targetColumn }),
    });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-400">
        Cargando tablero...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-xl font-bold text-slate-900">{board.name}</h1>
        {board.description && <p className="text-sm text-slate-500">{board.description}</p>}
        <p className="text-xs text-slate-400 mt-1">
          {tasks.length} tareas · Tiempo real activado
        </p>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full min-w-max">
          {board.columns.map((column) => {
            const columnTasks = tasks.filter((t) => t.column === column);

            return (
              <div
                key={column}
                onDrop={(e) => handleDrop(e, column)}
                onDragOver={handleDragOver}
                className="w-72 bg-slate-100 rounded-xl flex flex-col shrink-0"
              >
                <div className="px-4 py-3 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-700">{column}</h2>
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDelete={deleteTask}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>

                <div className="p-3 border-t border-slate-200">
                  {addingTo === column ? (
                    <div className="space-y-2">
                      <input
                        autoFocus
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTask(column)}
                        placeholder="Título de la tarea"
                        className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <div className="flex gap-2">
                        <select
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value)}
                          className="border border-slate-300 rounded-lg px-2 py-1 text-xs outline-none flex-1"
                        >
                          <option value="low">Baja</option>
                          <option value="medium">Media</option>
                          <option value="high">Alta</option>
                          <option value="urgent">Urgente</option>
                        </select>
                        <input
                          value={newAssigned}
                          onChange={(e) => setNewAssigned(e.target.value)}
                          placeholder="Asignado"
                          className="border border-slate-300 rounded-lg px-2 py-1 text-xs outline-none flex-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addTask(column)}
                          className="bg-violet-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-violet-700 flex-1"
                        >
                          Agregar
                        </button>
                        <button
                          onClick={() => setAddingTo(null)}
                          className="border border-slate-300 px-3 py-1 rounded-lg text-xs hover:bg-slate-50"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTo(column)}
                      className="w-full text-sm text-slate-400 hover:text-violet-600 hover:bg-slate-200 rounded-lg py-1.5 transition"
                    >
                      + Agregar tarea
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
