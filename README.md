# Tablero de Trabajo para Equipos Colaborativos

Herramienta para planificar tareas y monitorear avance en equipos distribuidos, mejorando visibilidad y cumplimiento de entregas.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API Routes
- **Base de datos:** MongoDB Atlas (Mongoose)
- **Tiempo real:** Pusher (WebSockets)
- **Deploy:** Vercel

## Funcionalidades

- Tableros Kanban con columnas personalizables
- Drag & drop de tareas entre columnas
- Sincronización en tiempo real con Pusher (WebSockets)
- Crear, editar y eliminar tareas con prioridad y asignado
- Notificaciones visuales en tiempo real
- Dashboard con resumen de progreso

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Rybak1234/collaborative-workboard.git
cd collaborative-workboard
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

- **MongoDB Atlas:** Cluster gratuito en [mongodb.com/atlas](https://www.mongodb.com/atlas)
- **Pusher:** Cuenta gratuita en [pusher.com](https://pusher.com) → Channels → Create app

### 3. Desarrollo

```bash
npm run dev
```

### 4. Deploy en Vercel

Importa el repo en Vercel y agrega las variables de entorno.

## Estructura

```
src/
├── app/
│   ├── api/
│   │   ├── boards/        # CRUD tableros
│   │   └── tasks/         # CRUD tareas
│   ├── boards/[id]/       # Vista de tablero individual
│   └── page.tsx           # Lista de tableros
├── components/            # TaskCard, Column, BoardView
├── lib/                   # MongoDB, Pusher
└── models/                # Board, Task
```
