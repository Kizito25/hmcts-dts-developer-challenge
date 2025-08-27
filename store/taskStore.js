import { create } from "zustand";

// import task function from functions directory
import {
  addTask,
  fetchTasks,
  fetchTask,
  deleteTask,
  updateStatus as toggleTaskStatus,
  filterByStatus as apiFilterByStatus,
  filterByOverdueStatus,
} from "../functions/index.js";

const useTaskStore = create((set) => ({
  loading: true,
  error: null,
  isModalVisible: false,
  tasks: [],
  task: {},
  creating: false,
  toggleModalVisibility: () =>
    set((state) => ({ isModalVisible: !state.isModalVisible })),
  fetchTasks: async () => {
    try {
      set({ loading: true });
      const tasks = await fetchTasks();
      return set({ tasks, loading: false });
    } catch (err) {
      set({ loading: false });
      set({ error: err.message });
      setTimeout(() => set({ error: null }), 4000);
      return err;
    }
  },
  fetchTask: async (id) => {
    try {
      set({ loading: true });
      const task = await fetchTask(id);
      return set({ task, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
      setTimeout(() => set({ error: null }), 4000);
      return err;
    }
  },
  addTask: async ({ title, description, due_date, status }) => {
    try {
      set({ creating: true });
      const data = await addTask({ title, description, status, due_date });
      await fetchTasks();
      set({ creating: false });
      set({ isModalVisible: false });
      return set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: data?.id,
            title: data?.title,
            description: data?.description,
            due_date: data?.due_date,
            status: data?.status,
          },
        ],
      }));
    } catch (err) {
      set({ creating: false, error: err.message });
      setTimeout(() => set({ error: null }), 4000);
      return err;
    }
  },
  removeTask: async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete?")) {
        await deleteTask(id);
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      }
    } catch (err) {
      set({ error: err.message });
      setTimeout(() => set({ error: null }), 4000);
      return err;
    }
  },
  updateTask: async (updatedTask) => {
    try {
      await toggleTaskStatus(updatedTask.id, updatedTask.status);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
        task: state.task.id === updatedTask.id ? updatedTask : state.task,
      }));
    } catch (err) {
      set({ error: err.message });
      setTimeout(() => set({ error: null }), 4000);
      return err;
    }
  },

  filterByStatus: async (status, overdueStatus) => {
    try {
      const filteredTask = await apiFilterByStatus(status, overdueStatus);
      set({ tasks: filteredTask });
    } catch (err) {
      set({ error: err.message });
      setTimeout(() => set({ error: null }), 4000);
      return err;
    }
  },
  filterByOverdueStatus: async (overdueStatus, status) => {
    try {
      const filteredTask = await filterByOverdueStatus(overdueStatus, status);
      set({ tasks: filteredTask });
    } catch (err) {
      set({ error: err.message });
      setTimeout(() => set({ error: null }), 4000);
      return err;
    }
  },
}));
export default useTaskStore;
