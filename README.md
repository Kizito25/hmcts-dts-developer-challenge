# Caseworker Tasks Application Frontend Documentation

## Overview

The Task Application frontend is a **single-page application (SPA)** built with **React 19** and bundled using **Vite.js**. It communicates with a Laravel backend via a REST API. The application provides task management features including creating, updating, deleting, filtering, and sorting tasks for Caseworkers at HMCTS.

---

## Tech Stack

- **Vite.js** — Lightning-fast frontend build tool.
- **React 19** — Component-based UI framework.
- **React Router** — For routing through the app.
- **TailwindCSS** — A utility-first styling.
- **Axios API** — For making HTTP requests to the backend.
- **Zustand** — For Managing States, just like Redux.

---

## Project Structure

```
project-root/
├─ utils/
    ├─axios.js             # Axios config (for making API requests to the backend)
├─ functions/
    index.js               # All API calls to backend server
├─ lib/
    util.js                # All Auxiliary functions like Date Formatter
├─ store/
    ├─taskStore.js                # State management
├─ src/
│   ├─ App.jsx             # Main Tasks App component
│   ├─ index.css           # Entery CSS file 
│  ├─ main.jsx             # Application entry point
│  └─ components/          # Reusable reusable components
│   ├─ Container.jsx       # Layout container component for the entire App
│   ├─ Filter.jsx          # Filter Component of the App
│   ├─ Header.jsx          # Header Component of the App
│   ├─ NewTask.jsx         # New Task Form Component
│   ├─ TaskContainer.jsx   # Component Containing the To Do List
│   ├─ TaskList.jsx        # To Do List
│─
├─ index.html              # Root HTML file
├─ vite.config.js          # Vite configuration
├─ package.json            # Project dependencies and scripts
└─ netlify.toml            # Netlify deployment configuration
```

---

## Features

- **Task List Management**
  - View all tasks
  - Filter tasks by status (all, open, done)
  - Search tasks by title/description
  - Sort tasks by creation date, due date, or priority

- **CRUD Operations**
  - Create a new task (title, description, priority, due date)
  - Mark task as done/open
  - Edit task details (via modal)
  - Delete a task (with confirmation)

- **Responsive Design**
  - Works across desktop, tablet, and mobile
  - Uses `flex` and `max-width` for horizontal centering

- **Error & Loading States**
  - Loading indicators when fetching
  - Error messages on network/API failures
  - Optimistic UI updates for task completion toggles

---

## Environment Variables

The app uses Vite environment variables. Create a `.env` file in the project root:

```bash
VITE_API_BASE=http://localhost:8000
```

This variable is used to configure the API base URL.

---

## API Endpoints

The frontend expects the following endpoints from the Laravel backend:

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | `/api/tasks`         | Get all tasks            |
| POST   | `/api/tasks`         | Create a new task        |
| PATCH  | `/api/tasks/:id/status`     | Update an existing task status|
| DELETE | `/api/tasks/:id`     | Delete a task            |

### Example Task Object

```json
{
  "id": 1,
  "title": "Finish documentation",
  "description": "Write frontend docs for Vite+React",
  "status": "open",
  "priority": "high",
  "due_date": "2025-08-30T17:00:00",
  "createdAt": "2025-08-28T10:30:00",
  "updatedAt": "2025-08-28T11:00:00"
}
```

---

## Running the Project

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Deployment

### Netlify

The project includes a `netlify.toml` file for deployment:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures SPA routes are correctly handled.

---

## Styling

Currently, the app uses **inline styles** for simplicity. For scalability, TailwindCSS or styled-components can be added.

Example Tailwind setup for centering:

```html
<div class="flex justify-center overflow-x-hidden">
  <div class="w-full max-w-2xl p-6 bg-white rounded shadow">
    <h2>Task Manager</h2>
  </div>
</div>
```

---
