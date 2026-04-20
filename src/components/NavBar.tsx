"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import { HiViewColumns } from "react-icons/hi2";

export default function NavBar() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-violet-400 flex items-center gap-1.5">
          <HiViewColumns /> WorkBoard
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-slate-300 hover:text-violet-400 transition">
            Mis Tableros
          </Link>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
