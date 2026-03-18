import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import pusher from "@/lib/pusher-server";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");

  const filter: Record<string, string> = {};
  if (boardId) filter.boardId = boardId;

  const tasks = await Task.find(filter).sort({ order: 1 }).lean();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const task = await Task.create({
    title: body.title,
    description: body.description || "",
    column: body.column,
    priority: body.priority || "medium",
    assignedTo: body.assignedTo || "",
    boardId: body.boardId,
    order: body.order || 0,
  });

  await pusher.trigger(`board-${body.boardId}`, "task-created", task);

  return NextResponse.json(task, { status: 201 });
}
