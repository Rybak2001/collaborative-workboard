import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "WorkBoard - Tablero Colaborativo",
  description: "Tablero de trabajo para equipos colaborativos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 min-h-screen">
        <AuthProvider>
          <nav className="bg-slate-900 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
              <Link href="/" className="text-lg font-bold text-violet-400">
                🗂️ WorkBoard
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/" className="text-slate-300 hover:text-violet-400 transition">
                  Mis Tableros
                </Link>
                <UserMenu />
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
