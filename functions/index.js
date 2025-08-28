import { Filter } from "lucide-react";
import axios from "../utils/axios.js";

const addTask = async (payload) => {
  try {
    const response = await axios.post("/tasks", {
      title: payload.title,
      description: payload.description,
      due_date: payload.due_date,
      status: payload.status,
    });
    return response.data;
  } catch (err) {
    return err.message;
  }
};

const fetchTasks = async () => {
  try {
    const response = await axios.get("/tasks");
    const { data } = response.data;
    return data;
  } catch (err) {
    return err.message;
  }
};

const fetchTask = async (taskId) => {
  try {
    const response = await axios.get(`/tasks/${taskId}`);
    const data = response.data;
    return data;
  } catch (err) {
    return err.message;
  }
};

const deleteTask = async (taskId) => {
  try {
    const respone = await axios.delete(`/tasks/${taskId}`);
    return respone.data;
  } catch (err) {
    return err.message;
  }
};

const updateStatus = async (taskId, status) => {
  try {
    const respone = await axios.patch(`/tasks/${taskId}/status`, {
      status: status,
    });
    return respone.data;
  } catch (err) {
    return err.message;
  }
};
const filterByStatus = async (status, overdueStatus) => {
  try {
    const response = await axios.get(
      `/tasks?status=${status}&overdue=${overdueStatus}`
    );
    const { data } = response.data;
    return data;
  } catch (err) {
    return err.message;
  }
};
const filterByOverdueStatus = async (overdueStatus, status) => {
  try {
    const response = await axios.get(
      `/tasks?overdue=${overdueStatus}&status=${status}`
    );
    const { data } = response.data;
    return data;
  } catch (err) {
    return err.message;
  }
};

export {
  fetchTasks,
  fetchTask,
  addTask,
  deleteTask,
  updateStatus,
  filterByStatus,
  filterByOverdueStatus,
};
