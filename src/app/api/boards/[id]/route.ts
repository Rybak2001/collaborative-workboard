import { NextRequest, NextResponse } from "next/server";
import { boardStore, taskStore } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const board = boardStore.findById(params.id);
  if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const tasks = taskStore.findByBoard(params.id);
  return NextResponse.json({ ...board, tasks });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const board = boardStore.update(params.id, { name: body.name, description: body.description, columns: body.columns });
  if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(board);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  taskStore.deleteByBoard(params.id);
  const board = boardStore.delete(params.id);
  if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
