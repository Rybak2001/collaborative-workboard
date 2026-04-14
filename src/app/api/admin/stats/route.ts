import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import Task from "@/models/Task";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  const [totalBoards, totalTasks, totalUsers, boards] = await Promise.all([
    Board.countDocuments(),
    Task.countDocuments(),
    User.countDocuments(),
    Board.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  const tasks = await Task.find().lean();

  const tasksByPriority: Record<string, number> = {};
  const tasksByColumn: Record<string, number> = {};
  for (const t of tasks) {
    const p = (t as Record<string, unknown>).priority as string || "none";
    const c = (t as Record<string, unknown>).column as string || "unknown";
    tasksByPriority[p] = (tasksByPriority[p] || 0) + 1;
    tasksByColumn[c] = (tasksByColumn[c] || 0) + 1;
  }

  return NextResponse.json({
    totalBoards,
    totalTasks,
    totalUsers,
    tasksByPriority,
    tasksByColumn,
    recentBoards: boards,
  });
}
