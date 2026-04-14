"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  }

  async function createUser() {
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Todos los campos son requeridos"); return; }
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) { const e = await res.json(); setError(e.error); return; }
    setForm({ name: "", email: "", password: "", role: "member" });
    setShowCreate(false);
    fetchUsers();
  }

  async function toggleRole(user: User) {
    const newRole = user.role === "admin" ? "member" : "admin";
    await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  }

  async function toggleActive(user: User) {
    await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    fetchUsers();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
        >
          + Nuevo Usuario
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h2 className="font-semibold text-slate-900 mb-3">Crear Usuario</h2>
          {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mb-3">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500" />
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contraseña" type="password" className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500">
              <option value="member">Miembro</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={createUser} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-700">Crear</button>
            <button onClick={() => setShowCreate(false)} className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Usuario</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Rol</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Estado</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Registro</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u._id} className={!u.active ? "opacity-50" : ""}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {u.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString("es")}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => toggleRole(u)} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition" title="Cambiar rol">
                      {u.role === "admin" ? "→ Member" : "→ Admin"}
                    </button>
                    <button onClick={() => toggleActive(u)} className={`text-xs px-2 py-1 rounded transition ${u.active ? "bg-red-50 hover:bg-red-100 text-red-600" : "bg-green-50 hover:bg-green-100 text-green-600"}`}>
                      {u.active ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
