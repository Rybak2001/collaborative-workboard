const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const BoardSchema = new mongoose.Schema(
  { name: String, description: String, columns: [String] },
  { timestamps: true }
);

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    column: String,
    priority: { type: String, enum: ["low", "medium", "high", "urgent"] },
    assignedTo: String,
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    order: Number,
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    passwordHash: String,
    name: String,
    role: { type: String, enum: ["admin", "member"], default: "member" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", BoardSchema);
const Task = mongoose.model("Task", TaskSchema);
const User = mongoose.model("User", UserSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  await Task.deleteMany({});
  await Board.deleteMany({});
  await User.deleteMany({});

  // Create users
  const adminHash = await bcrypt.hash("admin123", 12);
  const userHash = await bcrypt.hash("user123", 12);

  await User.insertMany([
    { email: "admin@workboard.com", passwordHash: adminHash, name: "Admin", role: "admin", active: true },
    { email: "carlos@workboard.com", passwordHash: userHash, name: "Carlos García", role: "member", active: true },
    { email: "maria@workboard.com", passwordHash: userHash, name: "María López", role: "member", active: true },
  ]);
  console.log("✅ Created 3 users (admin@workboard.com/admin123, carlos@workboard.com/user123)");

  const board = await Board.create({
    name: "Sprint 14 - Desarrollo",
    description: "Board principal del equipo de desarrollo para el sprint actual",
    columns: ["Backlog", "En Progreso", "Revisión", "Listo"],
  });

  const board2 = await Board.create({
    name: "Marketing Q1 2025",
    description: "Planificación de campañas del primer trimestre",
    columns: ["Ideas", "Planificación", "Ejecución", "Completado"],
  });

  const tasks = [
    { title: "Implementar autenticación OAuth2", description: "Integrar login con Google y GitHub", column: "En Progreso", priority: "high", assignedTo: "Carlos", boardId: board._id, order: 0 },
    { title: "Diseñar API de pagos", description: "Definir endpoints REST para Stripe", column: "Backlog", priority: "urgent", assignedTo: "María", boardId: board._id, order: 0 },
    { title: "Optimizar queries de dashboard", description: "Reducir tiempo de carga a <200ms", column: "En Progreso", priority: "medium", assignedTo: "Pedro", boardId: board._id, order: 1 },
    { title: "Tests E2E del checkout", description: "Cubrir flujo completo de compra", column: "Revisión", priority: "high", assignedTo: "Ana", boardId: board._id, order: 0 },
    { title: "Migrar a Next.js 15", description: "Actualizar framework y verificar compatibilidad", column: "Backlog", priority: "low", assignedTo: "", boardId: board._id, order: 1 },
    { title: "Fix: error en carrito vacío", description: "NullPointerException cuando no hay items", column: "Listo", priority: "medium", assignedTo: "Carlos", boardId: board._id, order: 0 },
    { title: "Documentar API v2", description: "Swagger/OpenAPI para los nuevos endpoints", column: "Revisión", priority: "low", assignedTo: "Pedro", boardId: board._id, order: 1 },
    { title: "Campaña Black Friday", description: "Preparar assets y landing page", column: "Ideas", priority: "high", assignedTo: "Laura", boardId: board2._id, order: 0 },
    { title: "Newsletter mensual", description: "Contenido + diseño para enero", column: "Ejecución", priority: "medium", assignedTo: "Ana", boardId: board2._id, order: 0 },
    { title: "Análisis competencia SEO", description: "Benchmark de keywords principales", column: "Planificación", priority: "low", assignedTo: "María", boardId: board2._id, order: 0 },
  ];

  await Task.insertMany(tasks);
  console.log(`✅ Created 2 boards and ${tasks.length} tasks`);
  console.log("🎉 Seed completed!");

  await mongoose.disconnect();
}

seed().catch(console.error);
