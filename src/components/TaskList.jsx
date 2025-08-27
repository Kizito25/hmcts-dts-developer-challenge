import React from "react";
import { Link } from "react-router";
import { IconTrash } from "@tabler/icons-react";
import useTaskStore from "../../store/taskStore.js";
import { formatDateTime } from "../../lib/utils/";

const TaskList = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const deleteTask = useTaskStore((state) => state.removeTask);
  const isLoading = useTaskStore((state) => state.loading);
  const updateStatus = useTaskStore((state) => state.updateTask);
  const error = useTaskStore((state) => state.error);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const runChecks = () => {
    if (isLoading) {
      return <div className="">Loading...</div>;
    }
    if (error) {
      return <div className="text-red-500">Error: ${error}</div>;
    }
    if (!tasks || Object.keys(tasks).length === 0) {
      return <div className="text-red-500">No task found.</div>;
    }
    return null;
  };

  return (
    <section className="w-full mx-auto h-full bg-white p-5">
      {runChecks() ||
        tasks?.map((task) => (
          <div key={task?.id} className="border p-4 mb-2 space-y-1">
            <div className="flex justify-between items-center">
              <Link
                to={`/tasks/${task?.id}`}
                key={task?.id}
                className={`
            ${task?.status === "DONE" && "text-green-500"} 
            ${task?.status === "TODO" && "text-yellow-500"} 
            ${task?.status === "IN_PROGRESS" && "text-indigo-500"} 
            `}
              >
                <h3 className="text-lg font-bold">{task?.title}</h3>
              </Link>

              <span className="w-8 h-8 text-sm px-2 py-1 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                <IconTrash
                  size={16}
                  className="cursor-pointer"
                  onClick={() => deleteTask(task?.id)}
                />
              </span>
            </div>
            <p className="text-lg font-light max-w-full">
              {task?.description.length > 100
                ? task?.description.substring(0, 100) + "..."
                : task?.description}
            </p>
            <p className="text-sm">
              <span className="font-bold">Due: </span>{" "}
              {formatDateTime(task?.due_date)}
            </p>
            <p className="text-sm">
              <span className="font-bold">OverDue? </span>
              <span
                className={task?.is_overdue ? "text-red-500" : "text-green-500"}
              >
                {task?.is_overdue ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-bold">Status: </span>
              <span
                className={`
            ${task?.status === "DONE" && "text-green-500"} 
            ${task?.status === "TODO" && "text-yellow-500"} 
            ${task?.status === "IN_PROGRESS" && "text-indigo-500"} 
            `}
              >
                <select
                  className="border p-2 mr-2"
                  defaultValue={task?.status}
                  onChange={(e) => {
                    const updatedTask = { ...task, status: e.target.value };
                    updateStatus(updatedTask);
                  }}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </span>
            </p>
          </div>
        ))}
    </section>
  );
};

export default TaskList;
