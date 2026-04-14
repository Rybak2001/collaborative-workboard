import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();
  const { email, password, name, role } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
  }

  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, name, role: role || "member" });

  return NextResponse.json({ id: user._id, email: user.email, name: user.name, role: user.role }, { status: 201 });
}
