import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";

export async function GET() {
  await dbConnect();
  const boards = await Board.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json(boards);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const board = await Board.create({
    name: body.name,
    description: body.description || "",
    columns: body.columns || ["Por hacer", "En progreso", "En revisión", "Completado"],
  });

  return NextResponse.json(board, { status: 201 });
}
