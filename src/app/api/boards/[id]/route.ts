import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import Task from "@/models/Task";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const board = await Board.findById(params.id).lean();
  if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const tasks = await Task.find({ boardId: params.id }).sort({ order: 1 }).lean();
  return NextResponse.json({ ...board, tasks });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();

  const board = await Board.findByIdAndUpdate(
    params.id,
    { name: body.name, description: body.description, columns: body.columns },
    { new: true }
  );

  if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(board);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  await Task.deleteMany({ boardId: params.id });
  const board = await Board.findByIdAndDelete(params.id);
  if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
