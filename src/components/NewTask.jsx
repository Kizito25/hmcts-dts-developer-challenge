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
        <input
          form-control
          required
          placeholder="Title"
          className="border p-3 w-full form-control"
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <input
          form-control
          required
          placeholder="Description"
          className="border p-3 w-full form-control"
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
        <select
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
        <input
          required
          form-control
          type="datetime-local"
          className="border p-3 w-full form-control"
          placeholder="Due Date"
          onChange={(e) =>
            setDraft({ ...draft, due_date: e.target.value.toString() })
          }
        />
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
