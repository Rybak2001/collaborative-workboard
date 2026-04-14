/* In-memory data store — replaces MongoDB for demo deployment */
let counter = 100;
function newId() { return (++counter).toString(36) + Date.now().toString(36); }

export interface IBoard {
  _id: string;
  name: string;
  description: string;
  columns: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  column: string;
  priority: string;
  assignedTo: string;
  boardId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const now = new Date().toISOString();

const boards: IBoard[] = [
  { _id: "b1", name: "Dev Sprint 14", description: "Sprint de desarrollo — funcionalidades Q1", columns: ["Por hacer", "En progreso", "En revisión", "Completado"], createdAt: now, updatedAt: now },
  { _id: "b2", name: "Marketing Q1", description: "Campañas y contenido del primer trimestre", columns: ["Ideas", "En progreso", "Aprobado", "Publicado"], createdAt: now, updatedAt: now },
];

const tasks: ITask[] = [
  { _id: "t1", title: "Implementar autenticación OAuth", description: "Integrar login con Google y GitHub", column: "En progreso", priority: "high", assignedTo: "Carlos", boardId: "b1", order: 0, createdAt: now, updatedAt: now },
  { _id: "t2", title: "Diseñar API de notificaciones", description: "Endpoint REST + WebSockets", column: "Por hacer", priority: "medium", assignedTo: "María", boardId: "b1", order: 1, createdAt: now, updatedAt: now },
  { _id: "t3", title: "Refactorizar módulo de pagos", description: "Migrar de Stripe v2 a v3", column: "En revisión", priority: "high", assignedTo: "Ana", boardId: "b1", order: 2, createdAt: now, updatedAt: now },
  { _id: "t4", title: "Tests E2E del dashboard", description: "Cubrir flujos críticos con Playwright", column: "Por hacer", priority: "low", assignedTo: "", boardId: "b1", order: 3, createdAt: now, updatedAt: now },
  { _id: "t5", title: "Optimizar queries de reportes", description: "Reducir tiempo de carga de 3s a < 500ms", column: "Completado", priority: "medium", assignedTo: "Carlos", boardId: "b1", order: 4, createdAt: now, updatedAt: now },
  { _id: "t6", title: "Campaña Black Friday", description: "Emails + redes sociales + landing", column: "Aprobado", priority: "high", assignedTo: "Laura", boardId: "b2", order: 0, createdAt: now, updatedAt: now },
  { _id: "t7", title: "Rediseño newsletter", description: "Nuevo template responsive", column: "En progreso", priority: "medium", assignedTo: "Pedro", boardId: "b2", order: 1, createdAt: now, updatedAt: now },
  { _id: "t8", title: "Video testimonio cliente", description: "Grabar y editar caso de éxito", column: "Ideas", priority: "low", assignedTo: "", boardId: "b2", order: 2, createdAt: now, updatedAt: now },
  { _id: "t9", title: "Análisis competencia SEO", description: "Benchmark de keywords principal", column: "Publicado", priority: "medium", assignedTo: "Laura", boardId: "b2", order: 3, createdAt: now, updatedAt: now },
  { _id: "t10", title: "Webinar producto nuevo", description: "Preparar slides y demo en vivo", column: "Ideas", priority: "high", assignedTo: "Pedro", boardId: "b2", order: 4, createdAt: now, updatedAt: now },
];

export const boardStore = {
  findAll: () => [...boards].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  findById: (id: string) => boards.find(b => b._id === id) || null,
  create: (data: Partial<IBoard>) => {
    const b: IBoard = { _id: newId(), name: data.name || "", description: data.description || "", columns: data.columns || ["Por hacer", "En progreso", "En revisión", "Completado"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    boards.push(b);
    return b;
  },
  update: (id: string, data: Partial<IBoard>) => {
    const i = boards.findIndex(b => b._id === id);
    if (i === -1) return null;
    Object.assign(boards[i], data, { updatedAt: new Date().toISOString() });
    return boards[i];
  },
  delete: (id: string) => {
    const i = boards.findIndex(b => b._id === id);
    if (i === -1) return null;
    return boards.splice(i, 1)[0];
  },
};

export const taskStore = {
  findByBoard: (boardId: string) => tasks.filter(t => t.boardId === boardId).sort((a, b) => a.order - b.order),
  findAll: (filter?: Record<string, string>) => {
    let result = [...tasks];
    if (filter?.boardId) result = result.filter(t => t.boardId === filter.boardId);
    return result.sort((a, b) => a.order - b.order);
  },
  findById: (id: string) => tasks.find(t => t._id === id) || null,
  create: (data: Partial<ITask>) => {
    const t: ITask = { _id: newId(), title: data.title || "", description: data.description || "", column: data.column || "", priority: data.priority || "medium", assignedTo: data.assignedTo || "", boardId: data.boardId || "", order: data.order || 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    tasks.push(t);
    return t;
  },
  update: (id: string, data: Partial<ITask>) => {
    const i = tasks.findIndex(t => t._id === id);
    if (i === -1) return null;
    Object.assign(tasks[i], data, { updatedAt: new Date().toISOString() });
    return tasks[i];
  },
  delete: (id: string) => {
    const i = tasks.findIndex(t => t._id === id);
    if (i === -1) return null;
    return tasks.splice(i, 1)[0];
  },
  deleteByBoard: (boardId: string) => {
    for (let i = tasks.length - 1; i >= 0; i--) {
      if (tasks[i].boardId === boardId) tasks.splice(i, 1);
    }
  },
};
