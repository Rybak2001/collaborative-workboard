import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "workboard-default-secret-change-me";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthUser(req: NextRequest): AuthUser | null {
  const cookie = req.cookies.get("token")?.value;
  if (!cookie) return null;
  return verifyToken(cookie);
}

export function requireAuth(req: NextRequest): AuthUser | NextResponse {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return user;
}

export function requireAdmin(req: NextRequest): AuthUser | NextResponse {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Requiere rol admin" }, { status: 403 });
  return user;
}
