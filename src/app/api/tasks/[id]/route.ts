import { NextRequest, NextResponse } from "next/server";
import { taskStore } from "@/lib/store";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const task = taskStore.update(params.id, {
    title: body.title,
    description: body.description,
    column: body.column,
    priority: body.priority,
    assignedTo: body.assignedTo,
    order: body.order,
  });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const task = taskStore.delete(params.id);
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
