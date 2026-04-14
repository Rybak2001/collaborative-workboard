import { NextRequest, NextResponse } from "next/server";
import { boardStore } from "@/lib/store";

export async function GET() {
  return NextResponse.json(boardStore.findAll());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const board = boardStore.create({
    name: body.name,
    description: body.description || "",
    columns: body.columns || ["Por hacer", "En progreso", "En revisión", "Completado"],
  });
  return NextResponse.json(board, { status: 201 });
}
