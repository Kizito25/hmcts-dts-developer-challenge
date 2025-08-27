import React, { useEffect, useMemo, useState } from "react";
import Axios from "axios";
/**
 * Task App — Single‑file React frontend (JavaScript version)
 * Drop this component into a Vite React app and render <TasksApp />.
 *
 * Assumed REST API (Laravel-friendly):
 *   GET    /api/tasks                      -> Task[]
 *   POST   /api/tasks                      -> Task
 *   PATCH  /api/tasks/:id                  -> Task
 *   DELETE /api/tasks/:id                  -> { success: true }
 */

// ---- Config ----
const API_BASE = import.meta.env.VITE_API_BASE; // e.g. "http://localhost:8000"
const tasksUrl = (path = "") => `${API_BASE}/tasks${path}`;

// ---- Utilities ----
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");
const cls = (...xs) => xs.filter(Boolean).join(" ");

// ---- Main Component ----
export default function TasksApp() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & sort
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all"); // "all" | "open" | "done"
  const [sortBy, setSortBy] = useState("createdAt"); // "createdAt" | "dueDate" | "priority"
  const [sortDir, setSortDir] = useState("desc"); // "asc" | "desc"

  // Create form state
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: null,
  });
  const [creating, setCreating] = useState(false);

  // Edit modal state
  const [editing, setEditing] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Fetch tasks
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // const res = await fetch(tasksUrl());
        const res = await Axios.get(tasksUrl());
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        console.log(res);
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    let arr = tasks.filter(
      (t) =>
        (status === "all" || t.status === status) &&
        (!ql ||
          t.title.toLowerCase().includes(ql) ||
          (t.description || "").toLowerCase().includes(ql))
    );
    const prioNum = (p) =>
      p === "TODO" ? 3 : p === "IN_PROGRESS" ? 2 : p === "DONE" ? 1 : 0;
    arr.sort((a, b) => {
      let vA = 0;
      let vB = 0;
      switch (sortBy) {
        case "createdAt":
          vA = a.createdAt || "";
          vB = b.createdAt || "";
          break;
        case "dueDate":
          vA = a.dueDate || "";
          vB = b.dueDate || "";
          break;
        case "priority":
          vA = prioNum(a.priority);
          vB = prioNum(b.priority);
          break;
        default:
          break;
      }
      if (vA < vB) return sortDir === "asc" ? -1 : 1;
      if (vA > vB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [tasks, q, status, sortBy, sortDir]);

  // Create task
  async function handleCreate(e) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(tasksUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, status: "open" }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const created = await res.json();
      setTasks((prev) => [created, ...prev]);
      setDraft({
        title: "",
        description: "",
        priority: "medium",
        dueDate: null,
      });
    } catch (e) {
      alert(e?.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  }

  // Toggle done
  async function toggleDone(t) {
    const optimistic = { ...t, status: t.status === "done" ? "open" : "done" };
    setTasks((prev) => prev.map((x) => (x.id === t.id ? optimistic : x)));
    try {
      const res = await fetch(tasksUrl(`/${t.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: optimistic.status }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated = await res.json();
      setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    } catch (e) {
      // rollback
      const err = e?.message || "Failed to update status";
      console.error(err);
      setTasks((prev) => prev.map((x) => (x.id === t.id ? t : x)));
      alert("Failed to update status");
    }
  }

  // Delete
  async function handleDelete(t) {
    if (!confirm(`Delete “${t.title}”?`)) return;
    const prev = tasks;
    setTasks(prev.filter((x) => x.id !== t.id));
    try {
      const res = await fetch(tasksUrl(`/${t.id}`), { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    } catch (e) {
      const err = e?.message || "Failed to delete";
      console.error(err);
      setTasks(prev); // rollback
      alert("Failed to delete");
    }
  }

  // Save edit
  async function saveEdit() {
    if (!editing) return;
    setSavingEdit(true);
    try {
      const res = await fetch(tasksUrl(`/${editing.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title,
          description: editing.description,
          priority: editing.priority,
          dueDate: editing.dueDate,
        }),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      const updated = await res.json();
      setTasks((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setEditing(null);
    } catch (e) {
      alert(e?.message || "Failed to save");
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <div
      style={{ minHeight: "100vh", background: "#0b1220", color: "#e6eefc" }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 16px" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg,#5b9dff,#7b61ff)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 6px 16px rgba(0,0,0,.35)",
            }}
          >
            <span style={{ fontWeight: 900 }}>✓</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: 0.2 }}>
            Tasks
          </h1>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              title="Status filter"
              style={selectStyle}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="done">Done</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort by"
              style={selectStyle}
            >
              <option value="createdAt">Created</option>
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
            </select>
            <button
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              style={btnGhost}
            >
              {sortDir === "asc" ? "↑" : "↓"}
            </button>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              style={inputStyle}
            />
          </div>
        </header>

        <section style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            Create Task
          </h2>
          <form
            onSubmit={handleCreate}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
              gap: 8,
            }}
          >
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Title"
              style={inputStyle}
            />
            <input
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              placeholder="Description"
              style={inputStyle}
            />
            <select
              value={draft.priority}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
              style={selectStyle}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={draft.dueDate || ""}
              onChange={(e) =>
                setDraft({ ...draft, dueDate: e.target.value || null })
              }
              style={inputStyle}
            />
            <button type="submit" disabled={creating} style={btnPrimary}>
              {creating ? "Adding…" : "Add"}
            </button>
          </form>
        </section>

        <section style={card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>
              Tasks ({filtered.length})
            </h2>
            {loading && <span style={{ opacity: 0.8 }}>Loading…</span>}
            {error && <span style={{ color: "#ff8080" }}>{error}</span>}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead>
                <tr>
                  {["", "Title", "Priority", "Due", "Created", ""].map(
                    (h, i) => (
                      <th key={i} style={thStyle}>
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} style={{ background: "#0f182b" }}>
                    <td style={tdStyle}>
                      <input
                        type="checkbox"
                        checked={t.status === "done"}
                        onChange={() => toggleDone(t)}
                      />
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            textDecoration:
                              t.status === "done" ? "line-through" : "none",
                          }}
                        >
                          {t.title}
                        </div>
                        {t.description && (
                          <div style={{ opacity: 0.8, fontSize: 13 }}>
                            {t.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span className={cls("pill", t.priority)}>
                        {(t.priority || "").toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>{fmtDate(t.dueDate)}</td>
                    <td style={tdStyle}>{fmtDate(t.createdAt)}</td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          title="Edit"
                          style={btnGhost}
                          onClick={() => setEditing(t)}
                        >
                          ✏️
                        </button>
                        <button
                          title="Delete"
                          style={btnDanger}
                          onClick={() => handleDelete(t)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ ...tdStyle, textAlign: "center", opacity: 0.8 }}
                    >
                      No tasks match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Edit modal */}
        {editing && (
          <div style={modalOverlay} onClick={() => setEditing(null)}>
            <div style={modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginTop: 0 }}>Edit Task</h3>
              <div style={{ display: "grid", gap: 8 }}>
                <label style={label}>
                  Title
                  <input
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                    style={inputStyle}
                  />
                </label>
                <label style={label}>
                  Description
                  <textarea
                    value={editing.description || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                    style={{ ...inputStyle, minHeight: 90 }}
                  />
                </label>
                <label style={label}>
                  Priority
                  <select
                    value={editing.priority || "medium"}
                    onChange={(e) =>
                      setEditing({ ...editing, priority: e.target.value })
                    }
                    style={selectStyle}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
                <label style={label}>
                  Due date
                  <input
                    type="date"
                    value={editing.dueDate || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        dueDate: e.target.value || null,
                      })
                    }
                    style={inputStyle}
                  />
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <button onClick={() => setEditing(null)} style={btnGhost}>
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={savingEdit}
                  style={btnPrimary}
                >
                  {savingEdit ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        <footer style={{ opacity: 0.7, textAlign: "center", marginTop: 24 }}>
          <small>
            API base: <code>{API_BASE || "(current origin)"}</code> • Edit
            VITE_API_BASE to change
          </small>
        </footer>
      </div>
      <style>{globalStyles}</style>
    </div>
  );
}

// ---- Styles ----
const card = {
  background: "#0f182b",
  border: "1px solid #1e2a44",
  boxShadow: "0 6px 16px rgba(0,0,0,.35)",
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
};

const inputBase = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #2a3a5f",
  background: "#0b1220",
  color: "#e6eefc",
  outline: "none",
};

const inputStyle = { ...inputBase };
const selectStyle = { ...inputBase, appearance: "none" };
const btnBase = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid transparent",
  cursor: "pointer",
  fontWeight: 700,
};
const btnPrimary = {
  ...btnBase,
  background: "linear-gradient(135deg,#5b9dff,#7b61ff)",
  color: "#0b1220",
  boxShadow: "0 4px 10px rgba(91,157,255,.35)",
};
const btnGhost = {
  ...btnBase,
  background: "transparent",
  border: "1px solid #2a3a5f",
  color: "#e6eefc",
};
const btnDanger = {
  ...btnBase,
  background: "#3d1220",
  border: "1px solid #5f2a3a",
  color: "#ffb3c1",
};
const thStyle = { textAlign: "left", padding: 12, fontSize: 12, opacity: 0.7 };
const tdStyle = {
  padding: 12,
  borderTop: "1px solid #1e2a44",
  verticalAlign: "top",
};
const label = { display: "grid", gap: 6, fontSize: 12, opacity: 0.9 };
const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.5)",
  display: "grid",
  placeItems: "center",
  padding: 16,
};
const modal = {
  background: "#0f182b",
  color: "#e6eefc",
  border: "1px solid #1e2a44",
  borderRadius: 14,
  maxWidth: 560,
  width: "100%",
  padding: 16,
  boxShadow: "0 8px 30px rgba(0,0,0,.55)",
};

const globalStyles = `
  .pill { display: inline-block; padding: 4px 10px; border-radius: 1000px; font-size: 12px; font-weight: 800; }
  .pill.low { background: #0e2b1a; color: #9cf2c2; border: 1px solid #1a4d30; }
  .pill.medium { background: #2b230e; color: #f2e29c; border: 1px solid #4d411a; }
  .pill.high { background: #2b0e12; color: #f29caf; border: 1px solid #4d1a24; }
`;
