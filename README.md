# TaskFlow Web Application (Frontend)

The frontend client for the TaskFlow application, built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Lucide React**.

---

## 🏛 Architecture Overview

The frontend follows a modern, modular, feature-oriented React architecture:

```
task-manager/
├── src/
│   ├── assets/              # Static SVG/image branding assets
│   ├── components/
│   │   ├── layout/          # Application shell (Navbar, AppLayout, PageContainer)
│   │   ├── tasks/           # Feature components (TaskCard, TaskFormModal, TaskFilter, DeleteModal)
│   │   └── ui/              # Reusable design system primitives (Button, Input, Select, Modal, Badge, Spinner)
│   ├── context/             # Global React Context providers (AuthContext, ToastContext)
│   ├── hooks/               # Custom React hooks (useAuth, useTasks, useDebounce)
│   ├── pages/               # Route-level views (Dashboard, Login, Register, NotFound)
│   ├── routes/              # Client-side routing configuration (Protected routes & Public routes)
│   ├── services/            # HTTP client & API abstraction services (api.ts, auth.service.ts, task.service.ts)
│   ├── types/               # TypeScript interfaces & domain models (auth.types.ts, task.types.ts)
│   ├── utils/               # Storage helpers (LocalStorage wrapper, date formatters)
│   ├── App.tsx              # Root component tree & toast provider mounting
│   ├── index.css            # Tailwind CSS v4 design tokens, color variables & glassmorphism utilities
│   └── main.tsx             # Application bootstrap & React StrictMode
├── nginx.conf               # Production Nginx reverse-proxy & SPA routing config
├── Dockerfile               # Production multi-stage Docker build definition
├── vite.config.ts           # Vite bundler plugins & dev proxy configuration
└── package.json             # Frontend dependencies & build scripts
```

### Key Architectural Layers:
1. **Presentation & UI System (`components/ui` & `index.css`)**: Reusable atomic UI components with consistent theme tokens, dark mode palette, smooth micro-transitions, and responsive layouts.
2. **Context & State Management (`context/` & `hooks/`)**:
   - `AuthContext`: Centralized authentication lifecycle, token persistence, user session storage, and proactive 401 handling.
   - `ToastContext`: Global notification toast stack for success, error, and info alerts.
   - `useTasks`: Encapsulated hook managing task fetching, status filtering, debounced search, optimistic mutations, and CRUD state.
3. **Routing Layer (`routes/AppRoutes.tsx`)**: React Router with `ProtectedRoute` guards ensuring unauthorized users are redirected to `/login` and authenticated users are redirected away from auth pages.
4. **Service Layer (`services/api.ts`)**: Unified `fetch` wrapper automatically injecting `Bearer <token>` headers, standardizing error formatting with `ApiError`, and handling unauthorized responses.

---

## 🛠 Technical Choices & Rationale

| Tool / Technology | Choice | Rationale |
| :--- | :--- | :--- |
| **Framework** | React 19 | High-performance reactive rendering with latest React features and enhanced hydration. |
| **Language** | TypeScript | Strong typing across API contracts, props, and entity models, eliminating runtime type bugs. |
| **Bundler & Tooling** | Vite 8 | Instant Hot Module Replacement (HMR), lightning-fast esbuild pre-bundling, and optimized Rollup builds. |
| **Styling** | Tailwind CSS v4 | Utility-first styling with modern CSS variables, zero-runtime overhead, and cohesive dark theme. |
| **Icons** | Lucide React | Modern, lightweight, customizable SVG icon set matching the clean aesthetics. |
| **Routing** | React Router DOM v7 | Standard client-side routing solution with declarative layout outlets and navigation guards. |
| **State & Fetching** | Custom Hooks + React Context | Clean, dependency-free state architecture avoiding heavyweight Redux boilerplate for a fast, responsive UI. |
| **Production Server** | Nginx Alpine | Ultra-lightweight web server providing gzip compression, static asset caching, and SPA fallback routing. |

---

## 📋 Key Features

- 🔐 **JWT Authentication**: User registration, login, and secure local token storage with automatic header attachment.
- 📋 **Complete Task Management**: Create, edit, delete, and inspect tasks with dynamic modal dialogs.
- 🔍 **Real-Time Filtering & Search**: Filter tasks by status (`TODO`, `IN_PROGRESS`, `COMPLETED`) and debounced search on title and description.
- 🎨 **Modern Dark Glassmorphism UI**: Polished interface with glowing gradients, responsive card layouts, and status badges.
- 🔔 **Interactive Feedback**: Non-blocking toast notifications for API operations and confirmation modals for destructive actions.

---

## 🚀 Installation & Execution Instructions

### Prerequisites
- **Node.js** 20.x or 22.x LTS
- **npm** 10.x+

---

### Method 1: Run Locally in Development Mode

1. **Navigate to the Frontend Directory**:
   ```bash
   cd task-manager
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file if needed (defaults to `/api` proxy):
   ```env
   VITE_API_BASE_URL=/api
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at: [http://localhost:5173](http://localhost:5173)

   > **Note on API Proxying**: In dev mode, Vite automatically proxies all `/api` requests to `http://localhost:5000` via `vite.config.ts`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

### Method 2: Run with Docker

1. **Build the Docker Image**:
   ```bash
   docker build -t taskflow-frontend .
   ```

2. **Run the Container**:
   ```bash
   docker run -d -p 80:80 --name taskflow-frontend taskflow-frontend
   ```

3. **Access the Application**:
   Open [http://localhost](http://localhost) in your browser.
