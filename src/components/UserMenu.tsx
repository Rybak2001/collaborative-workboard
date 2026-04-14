"use client";

import { useAuth } from "./AuthProvider";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) return <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />;

  if (!user) {
    return (
      <div className="flex gap-2 text-sm">
        <Link href="/login" className="text-slate-300 hover:text-violet-400 transition">Iniciar Sesión</Link>
        <Link href="/register" className="bg-violet-600 text-white px-3 py-1 rounded-lg hover:bg-violet-700 transition">Registro</Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm"
      >
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-slate-300 hidden sm:block">{user.name}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
            <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full uppercase font-bold">{user.role}</span>
          </div>
          {user.role === "admin" && (
            <Link href="/admin" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
              Panel Admin
            </Link>
          )}
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
