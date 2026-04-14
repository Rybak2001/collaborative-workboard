import { NextRequest, NextResponse } from "next/server";
import { taskStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");
  const filter: Record<string, string> = {};
  if (boardId) filter.boardId = boardId;
  return NextResponse.json(taskStore.findAll(filter));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const task = taskStore.create({
    title: body.title,
    description: body.description || "",
    column: body.column,
    priority: body.priority || "medium",
    assignedTo: body.assignedTo || "",
    boardId: body.boardId,
    order: body.order || 0,
  });
  return NextResponse.json(task, { status: 201 });
}
