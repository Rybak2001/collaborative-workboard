"use client";

import { HiXMark } from "react-icons/hi2";

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string;
  assignedTo: string;
}

const priorityColor: Record<string, string> = {
  urgent: "border-l-red-500 bg-red-50",
  high: "border-l-orange-500 bg-orange-50",
  medium: "border-l-blue-500 bg-blue-50",
  low: "border-l-slate-300 bg-slate-50",
};

const priorityLabel: Record<string, string> = {
  urgent: "Urgente",
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const priorityDot: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-blue-500",
  low: "bg-slate-400",
};

export default function TaskCard({
  task,
  onDelete,
  onDragStart,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      className={`border-l-4 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition ${priorityColor[task.priority]}`}
    >
      <div className="flex items-start justify-between mb-1">
        <h4 className="text-sm font-medium text-slate-900 flex-1">{task.title}</h4>
        <button
          onClick={() => onDelete(task._id)}
          className="text-slate-300 hover:text-red-500 text-xs ml-2 shrink-0"
        >
          <HiXMark />
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`} />
          <span className="text-xs text-slate-400">{priorityLabel[task.priority]}</span>
        </div>
        {task.assignedTo && (
          <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded-full border">
            {task.assignedTo}
          </span>
        )}
      </div>
    </div>
  );
}
