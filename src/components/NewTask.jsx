import React, { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import useTaskStore from "../../store/taskStore.js";

const NewTask = () => {
  const addTask = useTaskStore((state) => state.addTask);
  const creating = useTaskStore((state) => state.creating);

  const [draft, setDraft] = useState({
    title: "",
    description: "",
    status: "",
    due_date: null,
  });

  return (
    <section className="mb-4 mt-4 border-1 border-gray-300 p-4 bg-white w-full">
      <form
        form-control
        className="flex flex-col gap-2 form-control"
        onSubmit={(e) => {
          e.preventDefault();
          addTask(draft);
        }}
      >
        <h2 className="text-xl font-bold mb-4">New Task</h2>
        <span className="text-sm text-gray-500 mb-2">
          <strong className="text-red-500 mr-2">*</strong>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            form-control
            required
            placeholder="Title"
            className="border p-3 w-full form-control"
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </span>
        <span className="text-sm text-gray-500 mb-2">
          <strong className="text-red-500 mr-2">*</strong>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            form-control
            required
            placeholder="Description"
            className="border p-3 w-full form-control"
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
          />
        </span>
        <span className="text-sm text-gray-500 mb-2">
          <strong className="text-red-500 mr-2">*</strong>
          <label htmlFor="description">Select Status</label>
          <select
            id="status"
            form-control
            required
            className="border p-3 w-full form-control"
            onChange={(e) => setDraft({ ...draft, status: e.target.value })}
          >
            <option value="">Select Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </span>
        <span className="text-sm text-gray-500 mb-2">
          <strong className="text-red-500 mr-2">*</strong>
          <label htmlFor="description">Due Date</label>
          <input
            id="due_date"
            required
            form-control
            type="datetime-local"
            className="border p-3 w-full form-control"
            placeholder="Due Date"
            onChange={(e) =>
              setDraft({ ...draft, due_date: e.target.value.toString() })
            }
          />
        </span>
        <button
          type="submit"
          className="form-control border-0 p-3 text-white bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center gap-1 cursor-pointer"
        >
          <IconPlus size={16} />
          {creating ? "Adding…" : "Add"}
        </button>
      </form>
    </section>
  );
};

export default NewTask;
