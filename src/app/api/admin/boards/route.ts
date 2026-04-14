import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import Task from "@/models/Task";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  const boards = await Board.find().sort({ createdAt: -1 }).lean();
  const boardsWithCount = await Promise.all(
    boards.map(async (b) => {
      const taskCount = await Task.countDocuments({ boardId: b._id });
      return { ...b, taskCount };
    })
  );

  return NextResponse.json(boardsWithCount);
}
